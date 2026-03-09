// ============================================================
// ENUMS
// ============================================================

export type Region = "North America" | "Europe" | "Asia Pacific";

export type Modality = "Small Molecule" | "Biologics";

export type SiteStatus = "Active" | "Planned" | "Divesting" | "Decommissioned";

export type FunctionType =
  | "Manufacturing"
  | "QA"
  | "QC"
  | "MSAT"
  | "Engineering"
  | "HR"
  | "IT"
  | "Finance";

export type AssetType =
  | "Tablet Press"
  | "Coater"
  | "Blister Pack"
  | "Bioreactor"
  | "Chromatography"
  | "Vial Filler"
  | "Lyophilizer"
  | "Autoclave"
  | "WFI System"
  | "CIP System";

export type ObsolescenceRisk = "Low" | "Medium" | "High";

export type ScenarioType = "AddLine" | "RemoveLine" | "DivestSite" | "CDMOShift";

export type ScenarioStatus = "Draft" | "Under Review" | "Approved" | "Implementing" | "Archived";

export type RiskSeverity = "Critical" | "Warning" | "Low";

// ============================================================
// CORE ENTITIES
// ============================================================

export interface Site {
  id: string;
  name: string;
  region: Region;
  country: string;
  status: SiteStatus;
  modalities: Modality[];
  lineCount: number;
  latitude: number;
  longitude: number;
}

export interface SitePerformance {
  siteId: string;
  utilization: number;
  otif: number;
  oe: number;
  rft: number;
}

export interface ProductionLine {
  id: string;
  siteId: string;
  name: string;
  modality: Modality;
  lineType: string;
  capacityValue: number;
  capacityUnit: string;
  utilization: number;
  status: "Active" | "Idle" | "Planned" | "Decommissioning";
  commissionYear: number;
}

export interface Asset {
  id: string;
  lineId: string;
  siteId: string;
  siteName: string;
  lineName: string;
  assetType: AssetType;
  capacityValue: number;
  capacityUnit: string;
  utilization: number;
  ageYears: number;
  expectedLifespan: number;
  obsolescenceRisk: ObsolescenceRisk;
  annualMaintenanceCost: number;
  replacementCost: number;
}

export interface WorkforceEntry {
  siteId: string;
  siteName: string;
  function: FunctionType;
  headcount: number;
  avgCostPerFTE: number;
  totalCost: number;
}

export interface OpexBreakdown {
  siteId: string;
  siteName: string;
  year: number;
  peopleCost: number;
  depreciation: number;
  materialCost: number;
  otherDirect: number;
  crossCharges: number;
  total: number;
}

export interface CapexEntry {
  siteId: string;
  siteName: string;
  year: number;
  projectName: string;
  amount: number;
  category: string;
}

// ============================================================
// RISK SYSTEM
// ============================================================

export interface RiskAlert {
  id: string;
  severity: RiskSeverity;
  title: string;
  description: string;
  targetScreen: string;
  targetFilter?: Record<string, string>;
  dimension: RiskDimension;
}

export type RiskDimension =
  | "single_source"
  | "obsolescence"
  | "geographic_concentration"
  | "otif_performance"
  | "capex_cliff"
  | "regulatory";

export interface RiskScore {
  siteId: string;
  singleSource: number;
  obsolescence: number;
  geographicConcentration: number;
  otifPerformance: number;
  capexCliff: number;
  regulatory: number;
  composite: number;
}

// ============================================================
// SCENARIO SYSTEM
// ============================================================

export interface Scenario {
  id: string;
  name: string;
  type: ScenarioType;
  description: string;
  status: ScenarioStatus;
  createdAt: string;
  parameters: ScenarioParameters;
}

export interface ScenarioParameters {
  targetSiteIds: string[];
  targetModality?: Modality;
  productFamily?: string;
  capexInvestment?: number;
  rampUpMonths?: number;
  targetUtilization?: number;
  additionalFTEs?: number;
  newLineType?: string;
  targetLineIds?: string[];
  decommissionCost?: number;
  productTransferCostPerProduct?: number;
  severanceIncluded?: boolean;
  timelineMonths?: number;
  estimatedSaleProceeds?: number;
  restructuringCharges?: number;
  totalProductTransferCost?: number;
  cdmoCostPerBatch?: number;
  volumeToTransferPct?: number;
  techTransferCost?: number;
  managementOverheadPct?: number;
}

export interface ScenarioYearlyImpact {
  year: number;
  utilizationDelta: number;
  opexDelta: number;
  capexDelta: number;
  headcountDelta: number;
  cumulativeNetCashFlow: number;
  projectedUtilization: number;
  projectedOpex: number;
  projectedCapex: number;
  projectedHeadcount: number;
}

export interface ScenarioImpact {
  scenarioId: string;
  yearlyImpacts: ScenarioYearlyImpact[];
  summaryDeltas: {
    utilizationDelta: number;
    opexDelta: number;
    capexDelta: number;
    headcountDelta: number;
    riskFlags: number;
  };
  npv: number;
  paybackYears: number;
  irr: number;
  bottlenecks: BottleneckAlert[];
  radarScores: RadarScores;
}

export interface BottleneckAlert {
  type: "capacity" | "single_source" | "capex_cliff" | "workforce";
  severity: RiskSeverity;
  title: string;
  description: string;
}

export interface RadarScores {
  costEfficiency: number;
  utilization: number;
  risk: number;
  resilience: number;
  flexibility: number;
}

// ============================================================
// DEPENDENCY SYSTEM
// ============================================================

export interface SiteProductQualification {
  siteId: string;
  siteName: string;
  productFamily: string;
  modality: Modality;
  lineId: string;
  isOnlySource: boolean;
  backupSiteIds: string[];
}

// ============================================================
// UI / FILTER TYPES
// ============================================================

export interface GlobalFilters {
  scenario: string;
  timeRange: "5Y" | "10Y";
  regions: Region[];
  siteIds: string[];
  products: string[];
  modalities: Modality[];
  functions: FunctionType[];
}

// ============================================================
// AGGREGATE TYPES
// ============================================================

export interface NetworkSummary {
  totalOpex: number;
  totalCapex: number;
  avgUtilization: number;
  avgOtif: number;
  totalHeadcount: number;
  siteCount: number;
  riskAlerts: RiskAlert[];
}
