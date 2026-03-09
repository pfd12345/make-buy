import type {
  Site, SitePerformance, ProductionLine, Asset,
  WorkforceEntry, OpexBreakdown, CapexEntry,
  SiteProductQualification, RiskAlert,
} from "@/types";

// ============================================================
// SITES
// ============================================================

export const sites: Site[] = [
  { id: "maple-creek", name: "Maple Creek", region: "North America", country: "USA", status: "Active", modalities: ["Small Molecule"], lineCount: 3, latitude: 40.0, longitude: -80.0 },
  { id: "rhine-valley", name: "Rhine Valley", region: "Europe", country: "Germany", status: "Active", modalities: ["Biologics"], lineCount: 2, latitude: 50.1, longitude: 8.7 },
  { id: "sakura-pharma", name: "Sakura Pharma", region: "Asia Pacific", country: "Japan", status: "Active", modalities: ["Small Molecule", "Biologics"], lineCount: 2, latitude: 35.7, longitude: 139.7 },
  { id: "nordic-bioworks", name: "Nordic Bioworks", region: "Europe", country: "Denmark", status: "Active", modalities: ["Biologics"], lineCount: 2, latitude: 55.7, longitude: 12.6 },
  { id: "lakeshore", name: "Lakeshore", region: "North America", country: "Canada", status: "Active", modalities: ["Small Molecule"], lineCount: 2, latitude: 43.7, longitude: -79.4 },
  { id: "singapore-hub", name: "Singapore Hub", region: "Asia Pacific", country: "Singapore", status: "Active", modalities: ["Biologics", "Small Molecule"], lineCount: 3, latitude: 1.3, longitude: 103.8 },
  { id: "cork-biopharma", name: "Cork Biopharma", region: "Europe", country: "Ireland", status: "Active", modalities: ["Biologics"], lineCount: 2, latitude: 51.9, longitude: -8.5 },
  { id: "hyderabad-centre", name: "Hyderabad Centre", region: "Asia Pacific", country: "India", status: "Active", modalities: ["Small Molecule"], lineCount: 3, latitude: 17.4, longitude: 78.5 },
  { id: "basel-flagship", name: "Basel Flagship", region: "Europe", country: "Switzerland", status: "Active", modalities: ["Biologics", "Small Molecule"], lineCount: 3, latitude: 47.6, longitude: 7.6 },
  { id: "carolina-plant", name: "Carolina Plant", region: "North America", country: "USA", status: "Active", modalities: ["Small Molecule"], lineCount: 2, latitude: 35.2, longitude: -80.8 },
];

// ============================================================
// SITE PERFORMANCE
// ============================================================

export const sitePerformance: SitePerformance[] = [
  { siteId: "maple-creek", utilization: 78, otif: 94, oe: 72, rft: 91 },
  { siteId: "rhine-valley", utilization: 65, otif: 91, oe: 60, rft: 88 },
  { siteId: "sakura-pharma", utilization: 83, otif: 96, oe: 76, rft: 94 },
  { siteId: "nordic-bioworks", utilization: 72, otif: 93, oe: 66, rft: 90 },
  { siteId: "lakeshore", utilization: 81, otif: 95, oe: 75, rft: 92 },
  { siteId: "singapore-hub", utilization: 74, otif: 92, oe: 68, rft: 89 },
  { siteId: "cork-biopharma", utilization: 69, otif: 90, oe: 63, rft: 87 },
  { siteId: "hyderabad-centre", utilization: 86, otif: 89, oe: 79, rft: 85 },
  { siteId: "basel-flagship", utilization: 71, otif: 97, oe: 65, rft: 95 },
  { siteId: "carolina-plant", utilization: 79, otif: 93, oe: 73, rft: 91 },
];

// ============================================================
// PRODUCTION LINES
// ============================================================

export const productionLines: ProductionLine[] = [
  // Maple Creek - 3 lines
  { id: "mc-osd-a", siteId: "maple-creek", name: "Oral Solid Dosage A", modality: "Small Molecule", lineType: "OSD", capacityValue: 120000, capacityUnit: "tabs/hr", utilization: 82, status: "Active", commissionYear: 2016 },
  { id: "mc-osd-b", siteId: "maple-creek", name: "Oral Solid Dosage B", modality: "Small Molecule", lineType: "OSD", capacityValue: 60000, capacityUnit: "tabs/hr", utilization: 71, status: "Active", commissionYear: 2012 },
  { id: "mc-pkg-1", siteId: "maple-creek", name: "Packaging Line 1", modality: "Small Molecule", lineType: "Packaging", capacityValue: 200, capacityUnit: "packs/min", utilization: 85, status: "Active", commissionYear: 2019 },
  // Rhine Valley - 2 lines
  { id: "rv-bio-1", siteId: "rhine-valley", name: "Bioreactor Train 1", modality: "Biologics", lineType: "Upstream", capacityValue: 6, capacityUnit: "batches/qtr", utilization: 70, status: "Active", commissionYear: 2020 },
  { id: "rv-ds-1", siteId: "rhine-valley", name: "Downstream Processing", modality: "Biologics", lineType: "Downstream", capacityValue: 4, capacityUnit: "batches/qtr", utilization: 58, status: "Active", commissionYear: 2018 },
  // Sakura Pharma - 2 lines
  { id: "sp-inj-1", siteId: "sakura-pharma", name: "Injectable Line", modality: "Biologics", lineType: "Sterile Fill", capacityValue: 300, capacityUnit: "vials/min", utilization: 88, status: "Active", commissionYear: 2021 },
  { id: "sp-osd-1", siteId: "sakura-pharma", name: "OSD Line", modality: "Small Molecule", lineType: "OSD", capacityValue: 90000, capacityUnit: "tabs/hr", utilization: 76, status: "Active", commissionYear: 2014 },
  // Nordic Bioworks - 2 lines
  { id: "nb-bio-1", siteId: "nordic-bioworks", name: "Bioreactor Suite 1", modality: "Biologics", lineType: "Upstream", capacityValue: 4, capacityUnit: "batches/qtr", utilization: 75, status: "Active", commissionYear: 2019 },
  { id: "nb-ds-1", siteId: "nordic-bioworks", name: "Purification Train", modality: "Biologics", lineType: "Downstream", capacityValue: 3, capacityUnit: "batches/qtr", utilization: 68, status: "Active", commissionYear: 2017 },
  // Lakeshore - 2 lines
  { id: "ls-osd-1", siteId: "lakeshore", name: "Solid Dosage Line 1", modality: "Small Molecule", lineType: "OSD", capacityValue: 100000, capacityUnit: "tabs/hr", utilization: 84, status: "Active", commissionYear: 2015 },
  { id: "ls-pkg-1", siteId: "lakeshore", name: "Blister Pack Line", modality: "Small Molecule", lineType: "Packaging", capacityValue: 150, capacityUnit: "packs/min", utilization: 78, status: "Active", commissionYear: 2018 },
  // Singapore Hub - 3 lines
  { id: "sh-bio-1", siteId: "singapore-hub", name: "Biologics Suite A", modality: "Biologics", lineType: "Upstream", capacityValue: 5, capacityUnit: "batches/qtr", utilization: 72, status: "Active", commissionYear: 2020 },
  { id: "sh-osd-1", siteId: "singapore-hub", name: "OSD Production", modality: "Small Molecule", lineType: "OSD", capacityValue: 80000, capacityUnit: "tabs/hr", utilization: 77, status: "Active", commissionYear: 2017 },
  { id: "sh-pkg-1", siteId: "singapore-hub", name: "Packaging & Labeling", modality: "Small Molecule", lineType: "Packaging", capacityValue: 180, capacityUnit: "packs/min", utilization: 70, status: "Active", commissionYear: 2019 },
  // Cork Biopharma - 2 lines
  { id: "cb-bio-1", siteId: "cork-biopharma", name: "Large-Scale Bioreactor", modality: "Biologics", lineType: "Upstream", capacityValue: 8, capacityUnit: "batches/qtr", utilization: 72, status: "Active", commissionYear: 2016 },
  { id: "cb-ds-1", siteId: "cork-biopharma", name: "Chromatography Suite", modality: "Biologics", lineType: "Downstream", capacityValue: 6, capacityUnit: "batches/qtr", utilization: 65, status: "Active", commissionYear: 2015 },
  // Hyderabad Centre - 3 lines
  { id: "hc-osd-1", siteId: "hyderabad-centre", name: "High-Volume OSD A", modality: "Small Molecule", lineType: "OSD", capacityValue: 150000, capacityUnit: "tabs/hr", utilization: 89, status: "Active", commissionYear: 2013 },
  { id: "hc-osd-2", siteId: "hyderabad-centre", name: "High-Volume OSD B", modality: "Small Molecule", lineType: "OSD", capacityValue: 130000, capacityUnit: "tabs/hr", utilization: 85, status: "Active", commissionYear: 2015 },
  { id: "hc-pkg-1", siteId: "hyderabad-centre", name: "Packaging Complex", modality: "Small Molecule", lineType: "Packaging", capacityValue: 250, capacityUnit: "packs/min", utilization: 82, status: "Active", commissionYear: 2018 },
  // Basel Flagship - 3 lines
  { id: "bf-bio-1", siteId: "basel-flagship", name: "Flagship Bioreactor", modality: "Biologics", lineType: "Upstream", capacityValue: 10, capacityUnit: "batches/qtr", utilization: 68, status: "Active", commissionYear: 2018 },
  { id: "bf-sf-1", siteId: "basel-flagship", name: "Sterile Fill-Finish", modality: "Biologics", lineType: "Sterile Fill", capacityValue: 400, capacityUnit: "vials/min", utilization: 74, status: "Active", commissionYear: 2020 },
  { id: "bf-osd-1", siteId: "basel-flagship", name: "Precision OSD", modality: "Small Molecule", lineType: "OSD", capacityValue: 70000, capacityUnit: "tabs/hr", utilization: 70, status: "Active", commissionYear: 2017 },
  // Carolina Plant - 2 lines
  { id: "cp-osd-1", siteId: "carolina-plant", name: "OSD Line Alpha", modality: "Small Molecule", lineType: "OSD", capacityValue: 95000, capacityUnit: "tabs/hr", utilization: 82, status: "Active", commissionYear: 2013 },
  { id: "cp-pkg-1", siteId: "carolina-plant", name: "Coating & Packaging", modality: "Small Molecule", lineType: "Packaging", capacityValue: 160, capacityUnit: "packs/min", utilization: 75, status: "Active", commissionYear: 2011 },
];

// ============================================================
// ASSETS (25-35 records)
// ============================================================

export const assets: Asset[] = [
  // Maple Creek
  { id: "a-mc-1", lineId: "mc-osd-a", siteId: "maple-creek", siteName: "Maple Creek", lineName: "Oral Solid Dosage A", assetType: "Tablet Press", capacityValue: 120000, capacityUnit: "tabs/hr", utilization: 82, ageYears: 8, expectedLifespan: 15, obsolescenceRisk: "Medium", annualMaintenanceCost: 1.2, replacementCost: 18 },
  { id: "a-mc-2", lineId: "mc-osd-b", siteId: "maple-creek", siteName: "Maple Creek", lineName: "Oral Solid Dosage B", assetType: "Coater", capacityValue: 60000, capacityUnit: "tabs/hr", utilization: 71, ageYears: 12, expectedLifespan: 15, obsolescenceRisk: "High", annualMaintenanceCost: 1.8, replacementCost: 14 },
  { id: "a-mc-3", lineId: "mc-pkg-1", siteId: "maple-creek", siteName: "Maple Creek", lineName: "Packaging Line 1", assetType: "Blister Pack", capacityValue: 200, capacityUnit: "packs/min", utilization: 85, ageYears: 5, expectedLifespan: 12, obsolescenceRisk: "Low", annualMaintenanceCost: 0.6, replacementCost: 8 },
  // Rhine Valley
  { id: "a-rv-1", lineId: "rv-bio-1", siteId: "rhine-valley", siteName: "Rhine Valley", lineName: "Bioreactor Train 1", assetType: "Bioreactor", capacityValue: 6, capacityUnit: "batches/qtr", utilization: 70, ageYears: 4, expectedLifespan: 20, obsolescenceRisk: "Low", annualMaintenanceCost: 2.0, replacementCost: 45 },
  { id: "a-rv-2", lineId: "rv-ds-1", siteId: "rhine-valley", siteName: "Rhine Valley", lineName: "Downstream Processing", assetType: "Chromatography", capacityValue: 4, capacityUnit: "batches/qtr", utilization: 58, ageYears: 6, expectedLifespan: 18, obsolescenceRisk: "Low", annualMaintenanceCost: 1.5, replacementCost: 32 },
  // Sakura Pharma
  { id: "a-sp-1", lineId: "sp-inj-1", siteId: "sakura-pharma", siteName: "Sakura Pharma", lineName: "Injectable Line", assetType: "Vial Filler", capacityValue: 300, capacityUnit: "vials/min", utilization: 88, ageYears: 3, expectedLifespan: 15, obsolescenceRisk: "Low", annualMaintenanceCost: 1.0, replacementCost: 22 },
  { id: "a-sp-2", lineId: "sp-osd-1", siteId: "sakura-pharma", siteName: "Sakura Pharma", lineName: "OSD Line", assetType: "Tablet Press", capacityValue: 90000, capacityUnit: "tabs/hr", utilization: 76, ageYears: 10, expectedLifespan: 15, obsolescenceRisk: "Medium", annualMaintenanceCost: 1.4, replacementCost: 16 },
  // Nordic Bioworks
  { id: "a-nb-1", lineId: "nb-bio-1", siteId: "nordic-bioworks", siteName: "Nordic Bioworks", lineName: "Bioreactor Suite 1", assetType: "Bioreactor", capacityValue: 4, capacityUnit: "batches/qtr", utilization: 75, ageYears: 5, expectedLifespan: 20, obsolescenceRisk: "Low", annualMaintenanceCost: 1.8, replacementCost: 38 },
  { id: "a-nb-2", lineId: "nb-ds-1", siteId: "nordic-bioworks", siteName: "Nordic Bioworks", lineName: "Purification Train", assetType: "Chromatography", capacityValue: 3, capacityUnit: "batches/qtr", utilization: 68, ageYears: 7, expectedLifespan: 18, obsolescenceRisk: "Low", annualMaintenanceCost: 1.3, replacementCost: 28 },
  // Lakeshore
  { id: "a-ls-1", lineId: "ls-osd-1", siteId: "lakeshore", siteName: "Lakeshore", lineName: "Solid Dosage Line 1", assetType: "Tablet Press", capacityValue: 100000, capacityUnit: "tabs/hr", utilization: 84, ageYears: 9, expectedLifespan: 15, obsolescenceRisk: "Medium", annualMaintenanceCost: 1.3, replacementCost: 17 },
  { id: "a-ls-2", lineId: "ls-pkg-1", siteId: "lakeshore", siteName: "Lakeshore", lineName: "Blister Pack Line", assetType: "Blister Pack", capacityValue: 150, capacityUnit: "packs/min", utilization: 78, ageYears: 6, expectedLifespan: 12, obsolescenceRisk: "Medium", annualMaintenanceCost: 0.5, replacementCost: 7 },
  // Singapore Hub
  { id: "a-sh-1", lineId: "sh-bio-1", siteId: "singapore-hub", siteName: "Singapore Hub", lineName: "Biologics Suite A", assetType: "Bioreactor", capacityValue: 5, capacityUnit: "batches/qtr", utilization: 72, ageYears: 4, expectedLifespan: 20, obsolescenceRisk: "Low", annualMaintenanceCost: 1.9, replacementCost: 42 },
  { id: "a-sh-2", lineId: "sh-osd-1", siteId: "singapore-hub", siteName: "Singapore Hub", lineName: "OSD Production", assetType: "Tablet Press", capacityValue: 80000, capacityUnit: "tabs/hr", utilization: 77, ageYears: 7, expectedLifespan: 15, obsolescenceRisk: "Low", annualMaintenanceCost: 1.1, replacementCost: 15 },
  { id: "a-sh-3", lineId: "sh-pkg-1", siteId: "singapore-hub", siteName: "Singapore Hub", lineName: "Packaging & Labeling", assetType: "Blister Pack", capacityValue: 180, capacityUnit: "packs/min", utilization: 70, ageYears: 5, expectedLifespan: 12, obsolescenceRisk: "Low", annualMaintenanceCost: 0.5, replacementCost: 7 },
  // Cork Biopharma
  { id: "a-cb-1", lineId: "cb-bio-1", siteId: "cork-biopharma", siteName: "Cork Biopharma", lineName: "Large-Scale Bioreactor", assetType: "Bioreactor", capacityValue: 8, capacityUnit: "batches/qtr", utilization: 72, ageYears: 8, expectedLifespan: 20, obsolescenceRisk: "Low", annualMaintenanceCost: 2.2, replacementCost: 50 },
  { id: "a-cb-2", lineId: "cb-ds-1", siteId: "cork-biopharma", siteName: "Cork Biopharma", lineName: "Chromatography Suite", assetType: "Chromatography", capacityValue: 6, capacityUnit: "batches/qtr", utilization: 65, ageYears: 9, expectedLifespan: 18, obsolescenceRisk: "Medium", annualMaintenanceCost: 1.6, replacementCost: 35 },
  // Hyderabad Centre
  { id: "a-hc-1", lineId: "hc-osd-1", siteId: "hyderabad-centre", siteName: "Hyderabad Centre", lineName: "High-Volume OSD A", assetType: "Tablet Press", capacityValue: 150000, capacityUnit: "tabs/hr", utilization: 89, ageYears: 11, expectedLifespan: 15, obsolescenceRisk: "High", annualMaintenanceCost: 1.6, replacementCost: 20 },
  { id: "a-hc-2", lineId: "hc-osd-2", siteId: "hyderabad-centre", siteName: "Hyderabad Centre", lineName: "High-Volume OSD B", assetType: "Tablet Press", capacityValue: 130000, capacityUnit: "tabs/hr", utilization: 85, ageYears: 9, expectedLifespan: 15, obsolescenceRisk: "Medium", annualMaintenanceCost: 1.2, replacementCost: 18 },
  { id: "a-hc-3", lineId: "hc-pkg-1", siteId: "hyderabad-centre", siteName: "Hyderabad Centre", lineName: "Packaging Complex", assetType: "Blister Pack", capacityValue: 250, capacityUnit: "packs/min", utilization: 82, ageYears: 6, expectedLifespan: 12, obsolescenceRisk: "Medium", annualMaintenanceCost: 0.4, replacementCost: 6 },
  // Basel Flagship
  { id: "a-bf-1", lineId: "bf-bio-1", siteId: "basel-flagship", siteName: "Basel Flagship", lineName: "Flagship Bioreactor", assetType: "Bioreactor", capacityValue: 10, capacityUnit: "batches/qtr", utilization: 68, ageYears: 6, expectedLifespan: 20, obsolescenceRisk: "Low", annualMaintenanceCost: 2.5, replacementCost: 55 },
  { id: "a-bf-2", lineId: "bf-sf-1", siteId: "basel-flagship", siteName: "Basel Flagship", lineName: "Sterile Fill-Finish", assetType: "Vial Filler", capacityValue: 400, capacityUnit: "vials/min", utilization: 74, ageYears: 4, expectedLifespan: 15, obsolescenceRisk: "Low", annualMaintenanceCost: 1.2, replacementCost: 25 },
  { id: "a-bf-3", lineId: "bf-osd-1", siteId: "basel-flagship", siteName: "Basel Flagship", lineName: "Precision OSD", assetType: "Tablet Press", capacityValue: 70000, capacityUnit: "tabs/hr", utilization: 70, ageYears: 7, expectedLifespan: 15, obsolescenceRisk: "Low", annualMaintenanceCost: 1.0, replacementCost: 16 },
  // Carolina Plant (obsolescence scenario)
  { id: "a-cp-1", lineId: "cp-osd-1", siteId: "carolina-plant", siteName: "Carolina Plant", lineName: "OSD Line Alpha", assetType: "Tablet Press", capacityValue: 95000, capacityUnit: "tabs/hr", utilization: 82, ageYears: 11, expectedLifespan: 15, obsolescenceRisk: "High", annualMaintenanceCost: 1.8, replacementCost: 19 },
  { id: "a-cp-2", lineId: "cp-pkg-1", siteId: "carolina-plant", siteName: "Carolina Plant", lineName: "Coating & Packaging", assetType: "Coater", capacityValue: 160, capacityUnit: "packs/min", utilization: 75, ageYears: 13, expectedLifespan: 15, obsolescenceRisk: "High", annualMaintenanceCost: 2.1, replacementCost: 15 },
  // Additional assets for CapEx cliff scenario
  { id: "a-ls-3", lineId: "ls-osd-1", siteId: "lakeshore", siteName: "Lakeshore", lineName: "Solid Dosage Line 1", assetType: "Autoclave", capacityValue: 100000, capacityUnit: "tabs/hr", utilization: 80, ageYears: 12, expectedLifespan: 15, obsolescenceRisk: "High", annualMaintenanceCost: 0.9, replacementCost: 12 },
  { id: "a-nb-3", lineId: "nb-bio-1", siteId: "nordic-bioworks", siteName: "Nordic Bioworks", lineName: "Bioreactor Suite 1", assetType: "CIP System", capacityValue: 4, capacityUnit: "batches/qtr", utilization: 70, ageYears: 13, expectedLifespan: 16, obsolescenceRisk: "High", annualMaintenanceCost: 0.7, replacementCost: 10 },
  { id: "a-cb-3", lineId: "cb-bio-1", siteId: "cork-biopharma", siteName: "Cork Biopharma", lineName: "Large-Scale Bioreactor", assetType: "WFI System", capacityValue: 8, capacityUnit: "batches/qtr", utilization: 69, ageYears: 14, expectedLifespan: 17, obsolescenceRisk: "High", annualMaintenanceCost: 0.8, replacementCost: 11 },
];

// ============================================================
// WORKFORCE (80 records: 8 functions x 10 sites)
// ============================================================

function generateWorkforce(
  siteId: string, siteName: string, totalHC: number,
  region: "North America" | "Europe" | "Asia Pacific"
): WorkforceEntry[] {
  const costMap = {
    "North America": { Manufacturing: 85, QA: 95, QC: 90, MSAT: 110, Engineering: 105, HR: 80, IT: 100, Finance: 95 },
    "Europe": { Manufacturing: 90, QA: 100, QC: 95, MSAT: 115, Engineering: 110, HR: 85, IT: 105, Finance: 100 },
    "Asia Pacific": { Manufacturing: 45, QA: 50, QC: 48, MSAT: 55, Engineering: 52, HR: 40, IT: 50, Finance: 48 },
  };
  const pcts: Record<string, number> = {
    Manufacturing: 0.35, QA: 0.14, QC: 0.13, MSAT: 0.06,
    Engineering: 0.10, HR: 0.04, IT: 0.04, Finance: 0.04,
  };
  // Small variance per site
  const seed = siteId.length;
  const functions = Object.keys(pcts) as Array<keyof typeof pcts>;
  let allocated = 0;
  return functions.map((fn, i) => {
    const variance = ((seed * (i + 1) * 7) % 5 - 2) / 100;
    const pct = pcts[fn] + variance;
    const hc = i === functions.length - 1 ? totalHC - allocated : Math.round(totalHC * pct);
    allocated += hc;
    const cost = costMap[region][fn as keyof (typeof costMap)["North America"]];
    return {
      siteId, siteName,
      function: fn as WorkforceEntry["function"],
      headcount: hc,
      avgCostPerFTE: cost,
      totalCost: Math.round(hc * cost / 10) / 100,
    };
  });
}

export const workforce: WorkforceEntry[] = [
  ...generateWorkforce("maple-creek", "Maple Creek", 620, "North America"),
  ...generateWorkforce("rhine-valley", "Rhine Valley", 480, "Europe"),
  ...generateWorkforce("sakura-pharma", "Sakura Pharma", 350, "Asia Pacific"),
  ...generateWorkforce("nordic-bioworks", "Nordic Bioworks", 290, "Europe"),
  ...generateWorkforce("lakeshore", "Lakeshore", 410, "North America"),
  ...generateWorkforce("singapore-hub", "Singapore Hub", 520, "Asia Pacific"),
  ...generateWorkforce("cork-biopharma", "Cork Biopharma", 380, "Europe"),
  ...generateWorkforce("hyderabad-centre", "Hyderabad Centre", 680, "Asia Pacific"),
  ...generateWorkforce("basel-flagship", "Basel Flagship", 720, "Europe"),
  ...generateWorkforce("carolina-plant", "Carolina Plant", 310, "North America"),
];

// ============================================================
// OPEX BREAKDOWN (10 records)
// ============================================================

function makeOpex(siteId: string, siteName: string, total: number, isBiologics: boolean): OpexBreakdown {
  const pcts = isBiologics
    ? { peopleCost: 0.30, depreciation: 0.18, materialCost: 0.28, otherDirect: 0.14, crossCharges: 0.10 }
    : { peopleCost: 0.22, depreciation: 0.12, materialCost: 0.42, otherDirect: 0.14, crossCharges: 0.10 };
  return {
    siteId, siteName, year: 2026,
    peopleCost: Math.round(total * pcts.peopleCost * 10) / 10,
    depreciation: Math.round(total * pcts.depreciation * 10) / 10,
    materialCost: Math.round(total * pcts.materialCost * 10) / 10,
    otherDirect: Math.round(total * pcts.otherDirect * 10) / 10,
    crossCharges: Math.round(total * pcts.crossCharges * 10) / 10,
    total,
  };
}

export const opexBreakdowns: OpexBreakdown[] = [
  makeOpex("maple-creek", "Maple Creek", 135, false),
  makeOpex("rhine-valley", "Rhine Valley", 165, true),
  makeOpex("sakura-pharma", "Sakura Pharma", 95, false),
  makeOpex("nordic-bioworks", "Nordic Bioworks", 110, true),
  makeOpex("lakeshore", "Lakeshore", 105, false),
  makeOpex("singapore-hub", "Singapore Hub", 130, false),
  makeOpex("cork-biopharma", "Cork Biopharma", 125, true),
  makeOpex("hyderabad-centre", "Hyderabad Centre", 65, false),
  makeOpex("basel-flagship", "Basel Flagship", 220, true),
  makeOpex("carolina-plant", "Carolina Plant", 98, false),
];

// ============================================================
// CAPEX ENTRIES (~$531M total over baseline period)
// ============================================================

export const capexEntries: CapexEntry[] = [
  { siteId: "maple-creek", siteName: "Maple Creek", year: 2026, projectName: "OSD Line B Modernization", amount: 22, category: "Replacement" },
  { siteId: "maple-creek", siteName: "Maple Creek", year: 2027, projectName: "Packaging Expansion", amount: 18, category: "Expansion" },
  { siteId: "rhine-valley", siteName: "Rhine Valley", year: 2026, projectName: "Bioreactor Scale-Up", amount: 65, category: "Expansion" },
  { siteId: "rhine-valley", siteName: "Rhine Valley", year: 2028, projectName: "Clean Room Upgrade", amount: 30, category: "Regulatory" },
  { siteId: "sakura-pharma", siteName: "Sakura Pharma", year: 2026, projectName: "Injectable Capacity Boost", amount: 35, category: "Expansion" },
  { siteId: "sakura-pharma", siteName: "Sakura Pharma", year: 2027, projectName: "OSD Line Refurbishment", amount: 12, category: "Maintenance" },
  { siteId: "nordic-bioworks", siteName: "Nordic Bioworks", year: 2027, projectName: "New Purification Suite", amount: 42, category: "Expansion" },
  { siteId: "nordic-bioworks", siteName: "Nordic Bioworks", year: 2029, projectName: "CIP System Replacement", amount: 10, category: "Replacement" },
  { siteId: "lakeshore", siteName: "Lakeshore", year: 2026, projectName: "Tablet Press Upgrade", amount: 20, category: "Replacement" },
  { siteId: "lakeshore", siteName: "Lakeshore", year: 2028, projectName: "Autoclave Replacement", amount: 12, category: "Replacement" },
  { siteId: "singapore-hub", siteName: "Singapore Hub", year: 2026, projectName: "Biologics Suite B Build", amount: 55, category: "Expansion" },
  { siteId: "singapore-hub", siteName: "Singapore Hub", year: 2027, projectName: "Quality Lab Expansion", amount: 15, category: "Regulatory" },
  { siteId: "cork-biopharma", siteName: "Cork Biopharma", year: 2026, projectName: "WFI System Overhaul", amount: 11, category: "Replacement" },
  { siteId: "cork-biopharma", siteName: "Cork Biopharma", year: 2028, projectName: "Upstream Expansion", amount: 48, category: "Expansion" },
  { siteId: "hyderabad-centre", siteName: "Hyderabad Centre", year: 2026, projectName: "High-Vol Line C", amount: 28, category: "Expansion" },
  { siteId: "hyderabad-centre", siteName: "Hyderabad Centre", year: 2027, projectName: "Packaging Automation", amount: 8, category: "Maintenance" },
  { siteId: "basel-flagship", siteName: "Basel Flagship", year: 2026, projectName: "Sterile Fill Line 2", amount: 72, category: "Expansion" },
  { siteId: "basel-flagship", siteName: "Basel Flagship", year: 2028, projectName: "ERP & MES Integration", amount: 15, category: "Regulatory" },
  { siteId: "carolina-plant", siteName: "Carolina Plant", year: 2027, projectName: "Tablet Press Replacement", amount: 19, category: "Replacement" },
  { siteId: "carolina-plant", siteName: "Carolina Plant", year: 2028, projectName: "Coater Replacement", amount: 15, category: "Replacement" },
];

// ============================================================
// PRODUCT QUALIFICATIONS
// ============================================================

export const qualifications: SiteProductQualification[] = [
  // Oncology Oral - multiple sites
  { siteId: "maple-creek", siteName: "Maple Creek", productFamily: "Oncology Oral", modality: "Small Molecule", lineId: "mc-osd-a", isOnlySource: false, backupSiteIds: ["lakeshore", "hyderabad-centre"] },
  { siteId: "lakeshore", siteName: "Lakeshore", productFamily: "Oncology Oral", modality: "Small Molecule", lineId: "ls-osd-1", isOnlySource: false, backupSiteIds: ["maple-creek", "hyderabad-centre"] },
  { siteId: "hyderabad-centre", siteName: "Hyderabad Centre", productFamily: "Oncology Oral", modality: "Small Molecule", lineId: "hc-osd-1", isOnlySource: false, backupSiteIds: ["maple-creek", "lakeshore"] },
  // Immunology Biologics - Rhine Valley is sole downstream processor
  { siteId: "rhine-valley", siteName: "Rhine Valley", productFamily: "Immunology Biologics", modality: "Biologics", lineId: "rv-ds-1", isOnlySource: true, backupSiteIds: [] },
  { siteId: "cork-biopharma", siteName: "Cork Biopharma", productFamily: "Immunology Biologics", modality: "Biologics", lineId: "cb-bio-1", isOnlySource: false, backupSiteIds: ["rhine-valley"] },
  // Cardio Oral
  { siteId: "sakura-pharma", siteName: "Sakura Pharma", productFamily: "Cardio Oral", modality: "Small Molecule", lineId: "sp-osd-1", isOnlySource: false, backupSiteIds: ["singapore-hub"] },
  { siteId: "singapore-hub", siteName: "Singapore Hub", productFamily: "Cardio Oral", modality: "Small Molecule", lineId: "sh-osd-1", isOnlySource: false, backupSiteIds: ["sakura-pharma"] },
  // Rare Disease Injectable - single source
  { siteId: "sakura-pharma", siteName: "Sakura Pharma", productFamily: "Rare Disease Injectable", modality: "Biologics", lineId: "sp-inj-1", isOnlySource: true, backupSiteIds: [] },
  // Vaccines
  { siteId: "singapore-hub", siteName: "Singapore Hub", productFamily: "Vaccines", modality: "Biologics", lineId: "sh-bio-1", isOnlySource: false, backupSiteIds: ["nordic-bioworks"] },
  { siteId: "nordic-bioworks", siteName: "Nordic Bioworks", productFamily: "Vaccines", modality: "Biologics", lineId: "nb-bio-1", isOnlySource: false, backupSiteIds: ["singapore-hub"] },
  // Biosimilars
  { siteId: "cork-biopharma", siteName: "Cork Biopharma", productFamily: "Biosimilars", modality: "Biologics", lineId: "cb-bio-1", isOnlySource: false, backupSiteIds: ["basel-flagship"] },
  { siteId: "basel-flagship", siteName: "Basel Flagship", productFamily: "Biosimilars", modality: "Biologics", lineId: "bf-bio-1", isOnlySource: false, backupSiteIds: ["cork-biopharma"] },
  // Generics Oral
  { siteId: "hyderabad-centre", siteName: "Hyderabad Centre", productFamily: "Generics Oral", modality: "Small Molecule", lineId: "hc-osd-2", isOnlySource: false, backupSiteIds: ["carolina-plant"] },
  { siteId: "carolina-plant", siteName: "Carolina Plant", productFamily: "Generics Oral", modality: "Small Molecule", lineId: "cp-osd-1", isOnlySource: false, backupSiteIds: ["hyderabad-centre"] },
  // Specialty Biologics - Basel only (single source)
  { siteId: "basel-flagship", siteName: "Basel Flagship", productFamily: "Specialty Biologics", modality: "Biologics", lineId: "bf-sf-1", isOnlySource: true, backupSiteIds: [] },
  // Respiratory Oral
  { siteId: "maple-creek", siteName: "Maple Creek", productFamily: "Respiratory Oral", modality: "Small Molecule", lineId: "mc-osd-b", isOnlySource: false, backupSiteIds: ["lakeshore"] },
  { siteId: "lakeshore", siteName: "Lakeshore", productFamily: "Respiratory Oral", modality: "Small Molecule", lineId: "ls-osd-1", isOnlySource: false, backupSiteIds: ["maple-creek"] },
];

// ============================================================
// RISK ALERTS (pre-computed from data patterns)
// ============================================================

export const riskAlerts: RiskAlert[] = [
  {
    id: "risk-1",
    severity: "Critical",
    title: "OSD Line Obsolescence at Carolina Plant",
    description: "Capsule filler (11 yrs) and coater (13 yrs) exceed replacement thresholds. Risk of unplanned downtime.",
    targetScreen: "/assets",
    targetFilter: { site: "carolina-plant" },
    dimension: "obsolescence",
  },
  {
    id: "risk-2",
    severity: "Critical",
    title: "Single-Source Biologics Dependency",
    description: "Rhine Valley is sole source for downstream processing. Any disruption halts 40% of biologics supply.",
    targetScreen: "/dependencies",
    targetFilter: { site: "rhine-valley" },
    dimension: "single_source",
  },
  {
    id: "risk-3",
    severity: "Warning",
    title: "QC Testing Hub Concentration",
    description: "Basel handles QC testing for 4 other sites. Capacity utilization at 88% limits surge capability.",
    targetScreen: "/fact-base",
    targetFilter: { site: "basel-flagship" },
    dimension: "geographic_concentration",
  },
  {
    id: "risk-4",
    severity: "Warning",
    title: "Hyderabad OTIF Below Target",
    description: "OTIF at 89% vs 93% target. Root cause: raw material delays and shift scheduling gaps.",
    targetScreen: "/performance",
    targetFilter: { site: "hyderabad-centre" },
    dimension: "otif_performance",
  },
  {
    id: "risk-5",
    severity: "Warning",
    title: "CapEx Amortization Cliff in Y3",
    description: "5 assets across 3 sites reach end of amortization in Year 3, creating a replacement decision cluster.",
    targetScreen: "/assets",
    dimension: "capex_cliff",
  },
];

// ============================================================
// COMBINED SEED DATA EXPORT
// ============================================================

export const seedData = {
  sites,
  sitePerformance,
  productionLines,
  assets,
  workforce,
  opexBreakdowns,
  capexEntries,
  qualifications,
  riskAlerts,
};
