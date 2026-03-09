import type { WorkforceEntry, ScenarioType, ScenarioParameters } from "@/types";

export function calculateFTEImpact(
  type: ScenarioType,
  params: ScenarioParameters,
  siteWorkforce: WorkforceEntry[],
  year: number
): number {
  const totalSiteFTEs = siteWorkforce.reduce((sum, w) => sum + w.headcount, 0);

  switch (type) {
    case "AddLine": {
      const targetFTEs = params.additionalFTEs ?? 25;
      if (year === 1) return Math.round(targetFTEs * 0.5);
      return targetFTEs;
    }
    case "RemoveLine": {
      const lineCount = params.targetLineIds?.length ?? 1;
      const proportionalFTEs = Math.round(totalSiteFTEs * lineCount * 0.15);
      if (year === 1) return -Math.round(proportionalFTEs * 0.5);
      return -proportionalFTEs;
    }
    case "DivestSite": {
      if (year === 1) return -Math.round(totalSiteFTEs * 0.3);
      return -totalSiteFTEs;
    }
    case "CDMOShift": {
      const pct = (params.volumeToTransferPct ?? 100) / 100;
      const affectedFTEs = Math.round(totalSiteFTEs * 0.3 * pct);
      if (year === 1) return -Math.round(affectedFTEs * 0.3);
      if (year === 2) return -Math.round(affectedFTEs * 0.7);
      return -affectedFTEs;
    }
    default:
      return 0;
  }
}

export function getAvgCostPerFTE(workforce: WorkforceEntry[]): number {
  const total = workforce.reduce((sum, w) => sum + w.headcount, 0);
  const totalCost = workforce.reduce((sum, w) => sum + w.headcount * w.avgCostPerFTE, 0);
  return total > 0 ? totalCost / total : 85;
}
