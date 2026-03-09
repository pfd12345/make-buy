export const THRESHOLDS = {
  utilization: { critical: 50, warning: 70, good: 85 },
  otif: { critical: 90, warning: 95, good: 98 },
  oe: { critical: 55, warning: 65, good: 75 },
  obsolescence: { medium: 70, high: 85 },
} as const;

export const FUNCTION_COLORS: Record<string, string> = {
  Manufacturing: "#3b82f6",
  QA: "#10b981",
  QC: "#f59e0b",
  MSAT: "#8b5cf6",
  Engineering: "#ef4444",
  HR: "#06b6d4",
  IT: "#22c55e",
  Finance: "#f97316",
};

export const OPEX_COLORS: Record<string, string> = {
  peopleCost: "#3b82f6",
  depreciation: "#a855f7",
  materialCost: "#f59e0b",
  otherDirect: "#10b981",
  crossCharges: "#ef4444",
};

export const HOTSPOT_COLORS = {
  critical: "#ef4444",
  warning: "#f59e0b",
  good: "#22c55e",
} as const;

export const RISK_WEIGHTS = {
  single_source: 0.25,
  obsolescence: 0.20,
  geographic_concentration: 0.15,
  otif_performance: 0.15,
  capex_cliff: 0.15,
  regulatory: 0.10,
} as const;

export const SCENARIO_DEFAULTS = {
  AddLine: {
    capexInvestment: 75,
    rampUpMonths: 30,
    targetUtilization: 80,
    additionalFTEs: 25,
  },
  RemoveLine: {
    decommissionCost: 5,
    productTransferCostPerProduct: 3,
    timelineMonths: 18,
  },
  DivestSite: {
    restructuringCharges: 20,
  },
  CDMOShift: {
    cdmoCostPerBatch: 150,
    volumeToTransferPct: 100,
    techTransferCost: 4,
    managementOverheadPct: 10,
  },
} as const;

export const DISCOUNT_RATE = 0.08;

export const NAV_ITEMS = [
  { label: "Executive Overview", href: "/", icon: "LayoutDashboard", section: "UNDERSTAND" },
  { label: "Network Fact Base", href: "/fact-base", icon: "Database", section: "UNDERSTAND" },
  { label: "Performance Baseline", href: "/performance", icon: "Activity", section: "UNDERSTAND" },
  { label: "Asset Lifecycle", href: "/assets", icon: "Cog", section: "UNDERSTAND" },
  { label: "What-If Studio", href: "/what-if", icon: "FlaskConical", section: "EXPLORE" },
  { label: "Compare Scenarios", href: "/compare", icon: "GitCompare", section: "EXPLORE" },
  { label: "Impact Summary", href: "/impact", icon: "FileBarChart", section: "EXPLORE" },
  { label: "Workforce & Opex", href: "/workforce", icon: "Users", section: "ACT" },
  { label: "Dependencies", href: "/dependencies", icon: "Network", section: "ACT" },
  { label: "Collaboration", href: "/collaboration", icon: "MessageSquare", section: "ACT" },
] as const;

export const OPEX_LABELS: Record<string, string> = {
  peopleCost: "People Cost",
  depreciation: "Depreciation",
  materialCost: "Material Cost",
  otherDirect: "Other Direct",
  crossCharges: "Cross-charges",
};

export const ALL_FUNCTIONS = [
  "Manufacturing", "QA", "QC", "MSAT", "Engineering", "HR", "IT", "Finance",
] as const;
