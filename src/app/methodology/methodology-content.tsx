"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";

/* ------------------------------------------------------------------ */
/*  SVG: Entity-Relationship Diagram                                   */
/* ------------------------------------------------------------------ */
function ERDiagram() {
  const entities = [
    { id: "site", label: "Site", x: 340, y: 20, w: 120, h: 40, color: "#3b82f6" },
    { id: "line", label: "ProductionLine", x: 120, y: 120, w: 140, h: 40, color: "#8b5cf6" },
    { id: "asset", label: "Asset", x: 120, y: 220, w: 120, h: 40, color: "#8b5cf6" },
    { id: "perf", label: "SitePerformance", x: 540, y: 120, w: 150, h: 40, color: "#10b981" },
    { id: "wf", label: "WorkforceEntry", x: 540, y: 200, w: 150, h: 40, color: "#f59e0b" },
    { id: "opex", label: "OpexBreakdown", x: 540, y: 280, w: 150, h: 40, color: "#f59e0b" },
    { id: "capex", label: "CapexEntry", x: 340, y: 280, w: 120, h: 40, color: "#f59e0b" },
    { id: "qual", label: "SiteProductQual", x: 120, y: 320, w: 150, h: 40, color: "#ef4444" },
    { id: "scenario", label: "Scenario", x: 340, y: 400, w: 120, h: 40, color: "#6366f1" },
  ];

  const relations: { from: string; to: string; label: string; fx: number; fy: number; tx: number; ty: number }[] = [
    { from: "site", to: "line", label: "1:M", fx: 340, fy: 40, tx: 260, ty: 120 },
    { from: "line", to: "asset", label: "1:M", fx: 190, fy: 160, tx: 190, ty: 220 },
    { from: "site", to: "perf", label: "1:1", fx: 460, fy: 40, tx: 540, ty: 140 },
    { from: "site", to: "wf", label: "1:M", fx: 460, fy: 50, tx: 540, ty: 220 },
    { from: "site", to: "opex", label: "1:1", fx: 460, fy: 55, tx: 540, ty: 300 },
    { from: "site", to: "capex", label: "1:M", fx: 400, fy: 60, tx: 400, ty: 280 },
    { from: "site", to: "qual", label: "M:M", fx: 340, fy: 55, tx: 270, ty: 340 },
    { from: "scenario", to: "site", label: "refs", fx: 400, fy: 400, tx: 400, ty: 60 },
  ];

  return (
    <svg viewBox="0 0 750 460" className="w-full max-w-3xl mx-auto" role="img" aria-label="Entity relationship diagram">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" className="fill-muted-foreground" />
        </marker>
      </defs>
      {relations.map((r, i) => (
        <g key={i}>
          <line x1={r.fx} y1={r.fy} x2={r.tx} y2={r.ty} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
          <text x={(r.fx + r.tx) / 2 + 6} y={(r.fy + r.ty) / 2 - 4} className="fill-muted-foreground" fontSize={10} fontFamily="monospace">{r.label}</text>
        </g>
      ))}
      {entities.map((e) => (
        <g key={e.id}>
          <rect x={e.x} y={e.y} width={e.w} height={e.h} rx={6} fill={e.color} fillOpacity={0.15} stroke={e.color} strokeWidth={1.5} />
          <text x={e.x + e.w / 2} y={e.y + e.h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={e.color}>{e.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG: Calculation Pipeline Flow                                     */
/* ------------------------------------------------------------------ */
function CalcPipelineDiagram() {
  return (
    <svg viewBox="0 0 780 340" className="w-full max-w-3xl mx-auto" role="img" aria-label="Calculation pipeline diagram">
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" className="fill-muted-foreground" />
        </marker>
      </defs>

      {/* Input boxes */}
      <rect x={20} y={30} width={130} height={36} rx={6} className="fill-blue-500/15 stroke-blue-500" strokeWidth={1.5} />
      <text x={85} y={52} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-blue-500">Baseline Data</text>

      <rect x={20} y={90} width={130} height={36} rx={6} className="fill-indigo-500/15 stroke-indigo-500" strokeWidth={1.5} />
      <text x={85} y={112} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-indigo-500">Scenario Params</text>

      {/* Arrow to engine */}
      <line x1={150} y1={48} x2={220} y2={100} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow2)" />
      <line x1={150} y1={108} x2={220} y2={108} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow2)" />

      {/* Scenario Engine */}
      <rect x={225} y={80} width={160} height={50} rx={8} className="fill-purple-500/15 stroke-purple-500" strokeWidth={2} />
      <text x={305} y={100} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-purple-500">scenario-engine</text>
      <text x={305} y={118} textAnchor="middle" fontSize={9} className="fill-muted-foreground">orchestrates 10-yr projection</text>

      {/* Arrows to sub-calculators */}
      <line x1={385} y1={90} x2={450} y2={50} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow2)" />
      <line x1={385} y1={105} x2={450} y2={120} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow2)" />
      <line x1={385} y1={120} x2={450} y2={190} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow2)" />

      {/* Sub-calculators */}
      <rect x={455} y={25} width={170} height={44} rx={6} className="fill-amber-500/15 stroke-amber-500" strokeWidth={1.5} />
      <text x={540} y={44} textAnchor="middle" fontSize={10} fontWeight={600} className="fill-amber-500">financial-projector</text>
      <text x={540} y={58} textAnchor="middle" fontSize={9} className="fill-muted-foreground">NPV, IRR, Payback</text>

      <rect x={455} y={95} width={170} height={44} rx={6} className="fill-emerald-500/15 stroke-emerald-500" strokeWidth={1.5} />
      <text x={540} y={114} textAnchor="middle" fontSize={10} fontWeight={600} className="fill-emerald-500">workforce-calculator</text>
      <text x={540} y={128} textAnchor="middle" fontSize={9} className="fill-muted-foreground">FTE delta, cost/FTE</text>

      <rect x={455} y={165} width={170} height={44} rx={6} className="fill-rose-500/15 stroke-rose-500" strokeWidth={1.5} />
      <text x={540} y={184} textAnchor="middle" fontSize={10} fontWeight={600} className="fill-rose-500">risk-scorer</text>
      <text x={540} y={198} textAnchor="middle" fontSize={9} className="fill-muted-foreground">6-dim weighted score</text>

      {/* Arrows to output */}
      <line x1={625} y1={47} x2={670} y2={100} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow2)" />
      <line x1={625} y1={117} x2={670} y2={110} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow2)" />
      <line x1={625} y1={187} x2={670} y2={120} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow2)" />

      {/* Output */}
      <rect x={675} y={80} width={95} height={60} rx={8} className="fill-green-500/15 stroke-green-500" strokeWidth={2} />
      <text x={722} y={100} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-green-500">Scenario</text>
      <text x={722} y={114} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-green-500">Impact</text>
      <text x={722} y={130} textAnchor="middle" fontSize={8} className="fill-muted-foreground">+ radar scores</text>

      {/* KPI aggregator (separate path) */}
      <rect x={225} y={180} width={160} height={44} rx={6} className="fill-teal-500/15 stroke-teal-500" strokeWidth={1.5} />
      <text x={305} y={199} textAnchor="middle" fontSize={10} fontWeight={600} className="fill-teal-500">kpi-aggregator</text>
      <text x={305} y={213} textAnchor="middle" fontSize={9} className="fill-muted-foreground">weighted avgs, totals</text>

      <line x1={150} y1={55} x2={225} y2={195} className="stroke-muted-foreground" strokeWidth={1.5} markerEnd="url(#arrow2)" strokeDasharray="4 3" />

      {/* Constants box */}
      <rect x={20} y={260} width={740} height={65} rx={8} className="fill-muted/50 stroke-border" strokeWidth={1} />
      <text x={40} y={282} fontSize={10} fontWeight={700} className="fill-foreground">Key Constants:</text>
      <text x={40} y={300} fontSize={10} className="fill-muted-foreground">DISCOUNT_RATE = 8%  |  RISK_WEIGHTS: single-source 25%, obsolescence 20%, geographic 15%, OTIF 15%, capex-cliff 15%, regulatory 10%</text>
      <text x={40} y={315} fontSize={10} className="fill-muted-foreground">THRESHOLDS: utilization (crit &lt;60%, warn &lt;75%)  |  OTIF (crit &lt;90%, warn &lt;95%)  |  OE (crit &lt;70%, warn &lt;80%)</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Entity field reference data                                        */
/* ------------------------------------------------------------------ */
const ENTITY_FIELDS: { entity: string; color: string; fields: string }[] = [
  { entity: "Site", color: "bg-blue-100 text-blue-700", fields: "id, name, region, country, status, modalities[], lineCount, lat, lng" },
  { entity: "ProductionLine", color: "bg-purple-100 text-purple-700", fields: "id, siteId → Site, modality, lineType, capacity, utilization%, commissionYear" },
  { entity: "Asset", color: "bg-purple-100 text-purple-700", fields: "id, lineId → Line, siteId → Site, assetType, age, lifespan, obsolescenceRisk, maintenanceCost, replacementCost" },
  { entity: "SitePerformance", color: "bg-emerald-100 text-emerald-700", fields: "siteId → Site, utilization%, otif%, oe%, rft%" },
  { entity: "WorkforceEntry", color: "bg-amber-100 text-amber-700", fields: "siteId → Site, function (8 types), headcount, avgCostPerFTE, totalCost" },
  { entity: "OpexBreakdown", color: "bg-amber-100 text-amber-700", fields: "siteId → Site, year, peopleCost, depreciation, materialCost, otherDirect, crossCharges, total" },
  { entity: "CapexEntry", color: "bg-amber-100 text-amber-700", fields: "siteId → Site, year, projectName, amount, category" },
  { entity: "SiteProductQualification", color: "bg-red-100 text-red-700", fields: "siteId → Site, productFamily, modality, isOnlySource, backupSiteIds[]" },
  { entity: "Scenario", color: "bg-indigo-100 text-indigo-700", fields: "id, name, type (4 types), status (5 states), parameters{}, createdAt" },
  { entity: "ScenarioImpact (computed)", color: "bg-indigo-100 text-indigo-700", fields: "npv, irr, paybackYears, yearlyImpacts[10], bottlenecks[], radarScores{}" },
];

/* ------------------------------------------------------------------ */
/*  Page data map reference data                                       */
/* ------------------------------------------------------------------ */
const PAGE_DATA_MAP: {
  page: string;
  route: string;
  sources: string;
  calculations: string;
  keyMetrics: string;
  interactive: boolean;
}[] = [
  { page: "Executive Overview", route: "/", sources: "sites, performance, opex, capex, workforce, riskAlerts", calculations: "Weighted avg utilization & OTIF (by headcount), sum totals, Y1 capex filter", keyMetrics: "Site count, Avg Util %, Avg OTIF %, Headcount, OPEX, CapEx", interactive: false },
  { page: "Network Fact Base", route: "/fact-base", sources: "workforce, opex, sites", calculations: "Group by site × function matrix, OPEX category aggregation", keyMetrics: "FTE by function stacked bar, OPEX breakdown stacked bar", interactive: false },
  { page: "Performance Baseline", route: "/performance", sources: "sites, performance", calculations: "Threshold-based badge coloring (critical/warning/good)", keyMetrics: "Util %, OTIF %, OE %, RFT % per site", interactive: false },
  { page: "Asset Lifecycle", route: "/assets", sources: "assets, capex", calculations: "Age distribution bucketing (0-5/5-10/10-15/15+), remaining life = lifespan − age", keyMetrics: "Age distribution chart, CapEx timeline, asset inventory table", interactive: false },
  { page: "What-If Studio", route: "/what-if", sources: "sites, lines, performance, assets, workforce, opex, capex, qualifications", calculations: "Full computeScenarioImpact(): 10-yr cash flows → NPV, IRR, payback, FTE, bottlenecks", keyMetrics: "NPV, IRR, Payback, FTE Impact, cash flow chart", interactive: true },
  { page: "Compare Scenarios", route: "/compare", sources: "scenarios (store), full baseline", calculations: "computeScenarioImpact() × N, radar score extraction", keyMetrics: "NPV, IRR, Payback, FTE, OPEX delta, radar chart (5 axes)", interactive: true },
  { page: "Impact Summary", route: "/impact", sources: "scenarios (store), full baseline", calculations: "computeScenarioImpact() for active scenario, yearly breakdown", keyMetrics: "NPV, IRR, Payback, FTE, cumulative cash flow chart, year-by-year table", interactive: true },
  { page: "Workforce & OPEX", route: "/workforce", sources: "workforce, sites, opex", calculations: "Heatmap intensity by headcount, cost/FTE = totalCost / headcount", keyMetrics: "Workforce heatmap, cost/FTE bar chart, OPEX stacked bar", interactive: false },
  { page: "Dependencies", route: "/dependencies", sources: "qualifications, sites", calculations: "Single-source filter (isOnlySource), capability matrix, disruption sim", keyMetrics: "Single-source table, capability matrix, disruption status", interactive: true },
  { page: "Collaboration", route: "/collaboration", sources: "scenarios (store)", calculations: "Group by status for Kanban, JSON/CSV export", keyMetrics: "Kanban board (3 columns), management table", interactive: true },
  { page: "Methodology", route: "/methodology", sources: "None (static)", calculations: "None", keyMetrics: "Documentation only", interactive: false },
];

/* ------------------------------------------------------------------ */
/*  Scenario type formula data                                         */
/* ------------------------------------------------------------------ */
const SCENARIO_FORMULAS: { type: string; capex: string; opex: string; utilization: string }[] = [
  { type: "AddLine", capex: "Upfront investment (configurable)", opex: "FTE costs + 2% capex amort − 18% revenue lift", utilization: "Ramps over configurable months" },
  { type: "RemoveLine", capex: "Decommission + transfer costs", opex: "FTE savings (15% per line removed)", utilization: "−3.5 pp per line removed" },
  { type: "DivestSite", capex: "Restructuring − sale proceeds", opex: "Y1: 30% saving, Y2+: 85% saving", utilization: "Drops to 0 by Year 2" },
  { type: "CDMOShift", capex: "Tech transfer cost", opex: "CDMO quarterly cost − 40% internal saving", utilization: "Ramp 30% → 80% → 100% over 3 years" },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function MethodologyContent() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Methodology & Data Model"
        description="Purpose of each screen, calculations behind the analysis, and underlying data architecture"
      />

      <Tabs defaultValue="methodology">
        <TabsList>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
          <TabsTrigger value="data-model">Data Model</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/*  Tab 1: Methodology (existing content, unchanged)            */}
        {/* ============================================================ */}
        <TabsContent value="methodology">
          <div className="space-y-6">
            {/* Application Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application Overview</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  NetPlan is a pharmaceutical network capacity planning tool that helps manufacturing leaders evaluate make-vs-buy decisions, model network changes, and assess operational risk across a multi-site manufacturing network.
                </p>
                <p>
                  The application is organised into three sections: <strong className="text-foreground">Understand</strong> (baseline data and diagnostics), <strong className="text-foreground">Explore</strong> (scenario modelling and comparison), and <strong className="text-foreground">Act</strong> (operational detail and governance).
                </p>
              </CardContent>
            </Card>

            {/* Understand Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Understand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Executive Overview</h4>
                    <p className="text-sm text-muted-foreground">
                      Aggregates network-wide KPIs including site count, average utilization, OTIF performance, total headcount, OPEX, and Year-1 CapEx. Risk alerts are computed by evaluating single-source dependencies, asset obsolescence ratios, and OTIF thresholds against configurable targets.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Network Fact Base</h4>
                    <p className="text-sm text-muted-foreground">
                      Displays the foundational dataset of all manufacturing sites, their regions, modalities, and production line counts. This is the source-of-truth master data layer that feeds all downstream calculations.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Performance Baseline</h4>
                    <p className="text-sm text-muted-foreground">
                      Shows site-level utilization, OTIF (On-Time In-Full), and OE (Operational Efficiency) metrics. Utilization is computed as actual output divided by rated capacity; OTIF measures delivery reliability against scheduled demand.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Asset Lifecycle</h4>
                    <p className="text-sm text-muted-foreground">
                      Tracks equipment age against expected lifespan to flag obsolescence risk. Assets where age exceeds 75% of expected lifespan are flagged, with risk categorised as Low, Medium, or High based on the age-to-lifespan ratio.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Explore Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Explore</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">What-If Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Models four scenario types: Add Line (new capacity investment), Remove Line (decommission underperformers), Divest Site (full site closure), and CDMO Shift (outsource to contract manufacturer). Each scenario computes a 10-year cash flow projection to derive NPV, IRR, and payback period.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Compare Scenarios</h4>
                    <p className="text-sm text-muted-foreground">
                      Enables side-by-side comparison of up to 4 scenarios across financial metrics (NPV, IRR, Payback, FTE change, OPEX delta) and a radar chart scoring five dimensions: Cost Efficiency, Utilization, Risk, Resilience, and Flexibility.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Impact Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides a deep-dive into a single scenario with year-by-year projections of utilization, OPEX delta, CapEx spend, FTE changes, and cumulative net cash flow. Bottleneck alerts flag capacity constraints or risk thresholds breached by the scenario.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Act Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Act</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Workforce & OPEX</h4>
                    <p className="text-sm text-muted-foreground">
                      Breaks down headcount by function (Manufacturing, QA, QC, MSAT, Engineering, etc.) and site-level OPEX into five cost categories: People Cost, Depreciation, Material Cost, Other Direct, and Cross-charges.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Dependencies</h4>
                    <p className="text-sm text-muted-foreground">
                      Maps product-to-site qualification dependencies to identify single-source risks. Products qualified at only one site are flagged as critical vulnerabilities, with biologics single-source classified as Critical severity.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Collaboration</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides workflow governance with a Kanban board (Draft, Under Review, Approved) and a management table for changing scenario status, deleting scenarios, and exporting data as JSON or CSV.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Methodology */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Calculation Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Net Present Value (NPV)</h4>
                    <p className="text-sm text-muted-foreground">
                      Computed as the sum of discounted future cash flows minus the initial investment, using an 8% discount rate. Each year&apos;s net cash flow is discounted by (1 + r)^t where t is the year index.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Internal Rate of Return (IRR)</h4>
                    <p className="text-sm text-muted-foreground">
                      Solved iteratively using Newton&apos;s method to find the discount rate at which NPV equals zero. The algorithm converges within 100 iterations starting from a 10% initial guess.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Payback Period</h4>
                    <p className="text-sm text-muted-foreground">
                      Determined as the first year in which cumulative net cash flow turns positive. If the investment does not pay back within the projection horizon, it is reported as beyond the horizon length.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Risk Scoring</h4>
                    <p className="text-sm text-muted-foreground">
                      A weighted composite score (1-5 scale) combining six dimensions: single-source dependency (25%), asset obsolescence (20%), geographic concentration (15%), OTIF performance (15%), CapEx cliff risk (15%), and regulatory complexity (10%).
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Radar Scores</h4>
                    <p className="text-sm text-muted-foreground">
                      Five-axis scores (1-5) derived from scenario outcomes: Cost Efficiency is based on NPV magnitude, Utilization on projected capacity usage, Risk inversely on payback length, Resilience on FTE impact stability, and Flexibility on the breadth of sites affected.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/*  Tab 2: Data Model                                           */}
        {/* ============================================================ */}
        <TabsContent value="data-model">
          <div className="space-y-6">

            {/* Section A: Entity Relationships */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Entity Relationship Diagram</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  All data is currently held in two client-side Zustand stores: <strong className="text-foreground">BaselineStore</strong> (eagerly loaded from seed data) and <strong className="text-foreground">ScenarioStore</strong> (persisted to localStorage). The diagram below shows the core entities and their relationships.
                </p>
                <ERDiagram />
              </CardContent>
            </Card>

            {/* Entity field reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Entity Field Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Entity</TableHead>
                      <TableHead>Key Fields</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ENTITY_FIELDS.map((e) => (
                      <TableRow key={e.entity}>
                        <TableCell>
                          <Badge variant="secondary" className={e.color}>{e.entity}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{e.fields}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Section B: Calculation Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Calculation Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Scenario impacts are computed on-the-fly (never persisted). The <strong className="text-foreground">scenario-engine</strong> orchestrates a 10-year projection by calling three sub-calculators, then assembles the final ScenarioImpact object with NPV, IRR, payback, radar scores, and bottleneck alerts.
                </p>
                <CalcPipelineDiagram />
              </CardContent>
            </Card>

            {/* Scenario type formulas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scenario Type Formulas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>CapEx Model</TableHead>
                      <TableHead>OpEx Model</TableHead>
                      <TableHead>Utilization Model</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SCENARIO_FORMULAS.map((s) => (
                      <TableRow key={s.type}>
                        <TableCell className="font-medium text-sm">{s.type}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{s.capex}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{s.opex}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{s.utilization}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Section C: Page Data Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Page Data Map</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Which data sources and calculations each page consumes. Pages marked <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px]">Interactive</Badge> allow user input that drives new computations.
                </p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-40">Page</TableHead>
                        <TableHead className="w-16">Route</TableHead>
                        <TableHead>Data Sources</TableHead>
                        <TableHead>Calculations</TableHead>
                        <TableHead>Key Metrics</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PAGE_DATA_MAP.map((p) => (
                        <TableRow key={p.route}>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium">{p.page}</span>
                              {p.interactive && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[9px] px-1">Interactive</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">{p.route}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.sources}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.calculations}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.keyMetrics}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
