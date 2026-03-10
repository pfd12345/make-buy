"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MethodologyContent() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Methodology & Explanation"
        description="Purpose of each screen and the calculations behind the analysis"
      />

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
  );
}
