import type {
  Scenario, ScenarioImpact, ScenarioYearlyImpact,
  Site, SitePerformance, ProductionLine, Asset,
  WorkforceEntry, OpexBreakdown, CapexEntry,
  SiteProductQualification, BottleneckAlert, RadarScores,
} from "@/types";
import { computeNPV, computePaybackYears, computeIRR } from "./financial-projector";
import { calculateFTEImpact, getAvgCostPerFTE } from "./workforce-calculator";

interface BaselineData {
  sites: Site[];
  performance: SitePerformance[];
  lines: ProductionLine[];
  assets: Asset[];
  workforce: WorkforceEntry[];
  opex: OpexBreakdown[];
  capex: CapexEntry[];
  qualifications: SiteProductQualification[];
}

const HORIZON = 10;

export function computeScenarioImpact(
  scenario: Scenario,
  baseline: BaselineData
): ScenarioImpact {
  switch (scenario.type) {
    case "AddLine":
      return computeAddLine(scenario, baseline);
    case "RemoveLine":
      return computeRemoveLine(scenario, baseline);
    case "DivestSite":
      return computeDivestSite(scenario, baseline);
    case "CDMOShift":
      return computeCDMOShift(scenario, baseline);
    default:
      return emptyImpact(scenario.id);
  }
}

function computeAddLine(scenario: Scenario, baseline: BaselineData): ScenarioImpact {
  const { parameters: p } = scenario;
  const targetSiteId = p.targetSiteIds[0];
  const siteWorkforce = baseline.workforce.filter((w) => w.siteId === targetSiteId);
  const sitePerf = baseline.performance.find((pf) => pf.siteId === targetSiteId);
  const siteOpex = baseline.opex.find((o) => o.siteId === targetSiteId);
  const baseUtil = sitePerf?.utilization ?? 75;
  const baseOpex = siteOpex?.total ?? 100;

  const capex = p.capexInvestment ?? 75;
  const rampUpMonths = p.rampUpMonths ?? 30;
  const rampUpYears = Math.ceil(rampUpMonths / 12);
  const targetUtil = p.targetUtilization ?? 80;
  const avgCost = getAvgCostPerFTE(siteWorkforce);

  const yearlyImpacts: ScenarioYearlyImpact[] = [];
  const cashFlows: number[] = [];
  let cumCF = -capex;

  for (let y = 1; y <= HORIZON; y++) {
    const rampFraction = Math.min(1, y / rampUpYears);
    const utilDelta = (targetUtil - baseUtil) * rampFraction * 0.15;
    const fteDelta = calculateFTEImpact("AddLine", p, siteWorkforce, y);
    const opexDelta = fteDelta * avgCost * 0.001 + capex * 0.02;
    const revenueLift = rampFraction * capex * 0.18;
    const netCF = revenueLift - opexDelta;
    cumCF += netCF;
    cashFlows.push(netCF);

    yearlyImpacts.push({
      year: y,
      utilizationDelta: Math.round(utilDelta * 10) / 10,
      opexDelta: Math.round(opexDelta * 10) / 10,
      capexDelta: y === 1 ? capex : y <= rampUpYears ? capex * 0.1 : 0,
      headcountDelta: fteDelta,
      cumulativeNetCashFlow: Math.round(cumCF * 10) / 10,
      projectedUtilization: Math.round((baseUtil + utilDelta) * 10) / 10,
      projectedOpex: Math.round((baseOpex + opexDelta) * 10) / 10,
      projectedCapex: y === 1 ? capex : y <= rampUpYears ? capex * 0.1 : 0,
      projectedHeadcount: siteWorkforce.reduce((s, w) => s + w.headcount, 0) + fteDelta,
    });
  }

  const npv = Math.round(computeNPV(cashFlows) - capex);
  const payback = computePaybackYears(yearlyImpacts.map((y) => y.cumulativeNetCashFlow));
  const irr = computeIRR(cashFlows, capex);

  return {
    scenarioId: scenario.id,
    yearlyImpacts,
    summaryDeltas: computeSummaryDeltas(yearlyImpacts),
    npv,
    paybackYears: payback,
    irr,
    bottlenecks: detectBottlenecks(scenario, baseline, yearlyImpacts),
    radarScores: computeRadar(npv, yearlyImpacts, payback),
  };
}

function computeRemoveLine(scenario: Scenario, baseline: BaselineData): ScenarioImpact {
  const { parameters: p } = scenario;
  const targetSiteId = p.targetSiteIds[0];
  const siteWorkforce = baseline.workforce.filter((w) => w.siteId === targetSiteId);
  const sitePerf = baseline.performance.find((pf) => pf.siteId === targetSiteId);
  const siteOpex = baseline.opex.find((o) => o.siteId === targetSiteId);
  const baseUtil = sitePerf?.utilization ?? 75;
  const baseOpex = siteOpex?.total ?? 100;
  const avgCost = getAvgCostPerFTE(siteWorkforce);

  const lineCount = p.targetLineIds?.length ?? 1;
  const decommCost = p.decommissionCost ?? 5;
  const transferCost = (p.productTransferCostPerProduct ?? 3) * lineCount;
  const totalUpfront = decommCost + transferCost;

  const yearlyImpacts: ScenarioYearlyImpact[] = [];
  const cashFlows: number[] = [];
  let cumCF = -totalUpfront;

  for (let y = 1; y <= HORIZON; y++) {
    const fteDelta = calculateFTEImpact("RemoveLine", p, siteWorkforce, y);
    const opexSaving = -Math.abs(fteDelta) * avgCost * 0.001 - lineCount * 1.5;
    const utilDelta = -lineCount * 3.5 * (y >= 2 ? 1 : 0.5);
    const netCF = -opexSaving;
    cumCF += netCF;
    cashFlows.push(netCF);

    yearlyImpacts.push({
      year: y,
      utilizationDelta: utilDelta,
      opexDelta: Math.round(opexSaving * 10) / 10,
      capexDelta: y === 1 ? -totalUpfront : 0,
      headcountDelta: fteDelta,
      cumulativeNetCashFlow: Math.round(cumCF * 10) / 10,
      projectedUtilization: Math.round((baseUtil + utilDelta) * 10) / 10,
      projectedOpex: Math.round((baseOpex + opexSaving) * 10) / 10,
      projectedCapex: y === 1 ? totalUpfront : 0,
      projectedHeadcount: siteWorkforce.reduce((s, w) => s + w.headcount, 0) + fteDelta,
    });
  }

  const npv = Math.round(computeNPV(cashFlows) - totalUpfront);
  const payback = computePaybackYears(yearlyImpacts.map((y) => y.cumulativeNetCashFlow));
  const irr = computeIRR(cashFlows, totalUpfront);

  return {
    scenarioId: scenario.id,
    yearlyImpacts,
    summaryDeltas: computeSummaryDeltas(yearlyImpacts),
    npv,
    paybackYears: payback,
    irr,
    bottlenecks: detectBottlenecks(scenario, baseline, yearlyImpacts),
    radarScores: computeRadar(npv, yearlyImpacts, payback),
  };
}

function computeDivestSite(scenario: Scenario, baseline: BaselineData): ScenarioImpact {
  const { parameters: p } = scenario;
  const targetSiteId = p.targetSiteIds[0];
  const siteWorkforce = baseline.workforce.filter((w) => w.siteId === targetSiteId);
  const siteOpex = baseline.opex.find((o) => o.siteId === targetSiteId);
  const sitePerf = baseline.performance.find((pf) => pf.siteId === targetSiteId);
  const baseUtil = sitePerf?.utilization ?? 75;
  const baseOpex = siteOpex?.total ?? 100;

  const restructuring = p.restructuringCharges ?? 20;
  const saleProceeds = p.estimatedSaleProceeds ?? 0;
  const transferCost = p.totalProductTransferCost ?? 15;
  const totalUpfront = restructuring + transferCost - saleProceeds;

  const yearlyImpacts: ScenarioYearlyImpact[] = [];
  const cashFlows: number[] = [];
  let cumCF = -totalUpfront;

  for (let y = 1; y <= HORIZON; y++) {
    const fteDelta = calculateFTEImpact("DivestSite", p, siteWorkforce, y);
    const opexSaving = y >= 2 ? -baseOpex * 0.85 : -baseOpex * 0.3;
    const netCF = -opexSaving;
    cumCF += netCF;
    cashFlows.push(netCF);

    yearlyImpacts.push({
      year: y,
      utilizationDelta: y >= 2 ? -baseUtil : -baseUtil * 0.3,
      opexDelta: Math.round(opexSaving * 10) / 10,
      capexDelta: y === 1 ? totalUpfront : 0,
      headcountDelta: fteDelta,
      cumulativeNetCashFlow: Math.round(cumCF * 10) / 10,
      projectedUtilization: y >= 2 ? 0 : Math.round(baseUtil * 0.7 * 10) / 10,
      projectedOpex: Math.round(Math.max(0, baseOpex + opexSaving) * 10) / 10,
      projectedCapex: y === 1 ? totalUpfront : 0,
      projectedHeadcount: Math.max(0, siteWorkforce.reduce((s, w) => s + w.headcount, 0) + fteDelta),
    });
  }

  const npv = Math.round(computeNPV(cashFlows) - totalUpfront);
  const payback = computePaybackYears(yearlyImpacts.map((y) => y.cumulativeNetCashFlow));
  const irr = computeIRR(cashFlows, totalUpfront);

  return {
    scenarioId: scenario.id,
    yearlyImpacts,
    summaryDeltas: computeSummaryDeltas(yearlyImpacts),
    npv,
    paybackYears: payback,
    irr,
    bottlenecks: detectBottlenecks(scenario, baseline, yearlyImpacts),
    radarScores: computeRadar(npv, yearlyImpacts, payback),
  };
}

function computeCDMOShift(scenario: Scenario, baseline: BaselineData): ScenarioImpact {
  const { parameters: p } = scenario;
  const targetSiteId = p.targetSiteIds[0];
  const siteWorkforce = baseline.workforce.filter((w) => w.siteId === targetSiteId);
  const sitePerf = baseline.performance.find((pf) => pf.siteId === targetSiteId);
  const siteOpex = baseline.opex.find((o) => o.siteId === targetSiteId);
  const baseUtil = sitePerf?.utilization ?? 75;
  const baseOpex = siteOpex?.total ?? 100;

  const cdmoCost = p.cdmoCostPerBatch ?? 150;
  const pctTransfer = (p.volumeToTransferPct ?? 100) / 100;
  const techTransfer = p.techTransferCost ?? 4;
  const overhead = (p.managementOverheadPct ?? 10) / 100;
  const avgCost = getAvgCostPerFTE(siteWorkforce);

  const annualCDMOCost = cdmoCost * 4 * pctTransfer * 0.001; // quarterly batches
  const internalSaving = baseOpex * pctTransfer * 0.4;

  const yearlyImpacts: ScenarioYearlyImpact[] = [];
  const cashFlows: number[] = [];
  let cumCF = -techTransfer;

  for (let y = 1; y <= HORIZON; y++) {
    const ramp = y === 1 ? 0.3 : y === 2 ? 0.8 : 1;
    const fteDelta = calculateFTEImpact("CDMOShift", p, siteWorkforce, y);
    const saving = internalSaving * ramp;
    const cdmoExpense = annualCDMOCost * ramp + overhead * annualCDMOCost * ramp;
    const opexDelta = cdmoExpense - saving;
    const utilDelta = -baseUtil * pctTransfer * 0.3 * ramp;
    const netCF = -opexDelta;
    cumCF += netCF;
    cashFlows.push(netCF);

    yearlyImpacts.push({
      year: y,
      utilizationDelta: Math.round(utilDelta * 10) / 10,
      opexDelta: Math.round(opexDelta * 10) / 10,
      capexDelta: y === 1 ? techTransfer : 0,
      headcountDelta: fteDelta,
      cumulativeNetCashFlow: Math.round(cumCF * 10) / 10,
      projectedUtilization: Math.round((baseUtil + utilDelta) * 10) / 10,
      projectedOpex: Math.round((baseOpex + opexDelta) * 10) / 10,
      projectedCapex: y === 1 ? techTransfer : 0,
      projectedHeadcount: siteWorkforce.reduce((s, w) => s + w.headcount, 0) + fteDelta,
    });
  }

  const npv = Math.round(computeNPV(cashFlows) - techTransfer);
  const payback = computePaybackYears(yearlyImpacts.map((y) => y.cumulativeNetCashFlow));
  const irr = computeIRR(cashFlows, techTransfer);

  return {
    scenarioId: scenario.id,
    yearlyImpacts,
    summaryDeltas: computeSummaryDeltas(yearlyImpacts),
    npv,
    paybackYears: payback,
    irr,
    bottlenecks: detectBottlenecks(scenario, baseline, yearlyImpacts),
    radarScores: computeRadar(npv, yearlyImpacts, payback),
  };
}

function computeSummaryDeltas(impacts: ScenarioYearlyImpact[]) {
  const last = impacts[impacts.length - 1];
  return {
    utilizationDelta: last.utilizationDelta,
    opexDelta: last.opexDelta,
    capexDelta: impacts.reduce((s, y) => s + y.capexDelta, 0),
    headcountDelta: last.headcountDelta,
    riskFlags: 0,
  };
}

function detectBottlenecks(
  scenario: Scenario,
  baseline: BaselineData,
  impacts: ScenarioYearlyImpact[]
): BottleneckAlert[] {
  const alerts: BottleneckAlert[] = [];
  const lastYear = impacts[impacts.length - 1];

  if (lastYear.projectedUtilization > 90) {
    alerts.push({
      type: "capacity",
      severity: "Critical",
      title: "Capacity Constraint",
      description: `Projected utilization reaches ${lastYear.projectedUtilization}%, exceeding safe threshold.`,
    });
  }

  if (scenario.type === "DivestSite" || scenario.type === "RemoveLine") {
    const affected = baseline.qualifications.filter((q) =>
      scenario.parameters.targetSiteIds.includes(q.siteId) && q.isOnlySource
    );
    if (affected.length > 0) {
      alerts.push({
        type: "single_source",
        severity: "Critical",
        title: "Single-Source Products At Risk",
        description: `${affected.length} product(s) have no backup source after this change.`,
      });
    }
  }

  if (Math.abs(lastYear.headcountDelta) > 100) {
    alerts.push({
      type: "workforce",
      severity: "Warning",
      title: "Major Workforce Impact",
      description: `Net headcount change of ${lastYear.headcountDelta} FTEs requires significant change management.`,
    });
  }

  return alerts;
}

function computeRadar(npv: number, impacts: ScenarioYearlyImpact[], payback: number): RadarScores {
  const costEff = Math.min(5, Math.max(1, npv > 0 ? 3 + npv / 100 : 2 - Math.abs(npv) / 200));
  const lastUtil = impacts[impacts.length - 1].projectedUtilization;
  const util = lastUtil > 85 ? 2 : lastUtil > 70 ? 4 : lastUtil > 50 ? 3 : 1;
  const risk = payback <= 3 ? 4 : payback <= 5 ? 3 : payback <= 7 ? 2 : 1;
  const resilience = Math.min(5, 3 + (impacts[impacts.length - 1].headcountDelta > 0 ? 1 : -0.5));
  const flexibility = Math.min(5, Math.max(1, 3 - impacts.filter((i) => i.capexDelta > 0).length * 0.3));

  return {
    costEfficiency: Math.round(costEff * 10) / 10,
    utilization: util,
    risk,
    resilience: Math.round(resilience * 10) / 10,
    flexibility: Math.round(flexibility * 10) / 10,
  };
}

function emptyImpact(scenarioId: string): ScenarioImpact {
  return {
    scenarioId,
    yearlyImpacts: [],
    summaryDeltas: { utilizationDelta: 0, opexDelta: 0, capexDelta: 0, headcountDelta: 0, riskFlags: 0 },
    npv: 0,
    paybackYears: 0,
    irr: 0,
    bottlenecks: [],
    radarScores: { costEfficiency: 3, utilization: 3, risk: 3, resilience: 3, flexibility: 3 },
  };
}
