"use client";

import { useState } from "react";
import { useScenarioStore } from "@/stores/scenario-store";
import { useScenarioHydration } from "@/hooks/use-store-hydration";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import type { ScenarioStatus } from "@/types";

const WORKFLOW_COLUMNS: { status: ScenarioStatus; label: string }[] = [
  { status: "Draft", label: "Draft" },
  { status: "Under Review", label: "Under Review" },
  { status: "Approved", label: "Approved" },
];

const ALL_STATUSES: ScenarioStatus[] = [
  "Draft", "Under Review", "Approved", "Implementing", "Archived",
];

const STATUS_COLORS: Record<ScenarioStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Implementing: "bg-purple-100 text-purple-700",
  Archived: "bg-orange-100 text-orange-700",
};

export default function CollaborationContent() {
  useScenarioHydration();
  const scenarios = useScenarioStore((s) => s.scenarios);
  const updateStatus = useScenarioStore((s) => s.updateScenarioStatus);
  const deleteScenario = useScenarioStore((s) => s.deleteScenario);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(scenarios, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "netplan-scenarios.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (scenarios.length === 0) return;
    const headers = ["id", "name", "type", "status", "createdAt"];
    const rows = scenarios.map((s) => headers.map((h) => String(s[h as keyof typeof s])).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "netplan-scenarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    deleteScenario(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Collaboration" description="Track scenario status, manage workflows, and export data">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportJSON}>Export JSON</Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>Export CSV</Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="workflow">
        <TabsList>
          <TabsTrigger value="workflow">Workflow Board</TabsTrigger>
          <TabsTrigger value="manage">Manage Scenarios</TabsTrigger>
          <TabsTrigger value="methodology">Methodology & Explanation</TabsTrigger>
        </TabsList>

        {/* Workflow Board Tab */}
        <TabsContent value="workflow">
          {scenarios.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No scenarios created yet. Go to What-If Studio to create scenarios.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {WORKFLOW_COLUMNS.map((col) => {
                const colScenarios = scenarios.filter((s) => s.status === col.status);
                return (
                  <div key={col.status} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{col.label}</h3>
                      <Badge variant="secondary">{colScenarios.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {colScenarios.map((scenario) => (
                        <Card key={scenario.id}>
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium">{scenario.name}</p>
                                <p className="text-xs text-muted-foreground">{scenario.type}</p>
                              </div>
                              <Badge variant="secondary" className="text-[10px]">
                                {scenario.parameters.targetSiteIds.length} site(s)
                              </Badge>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {col.status === "Draft" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 text-xs"
                                  onClick={() => updateStatus(scenario.id, "Under Review")}
                                >
                                  Submit for Review
                                </Button>
                              )}
                              {col.status === "Under Review" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 text-xs"
                                    onClick={() => updateStatus(scenario.id, "Approved")}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 text-xs"
                                    onClick={() => updateStatus(scenario.id, "Draft")}
                                  >
                                    Return to Draft
                                  </Button>
                                </>
                              )}
                              {col.status === "Approved" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 text-xs"
                                  onClick={() => updateStatus(scenario.id, "Implementing")}
                                >
                                  Start Implementation
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {colScenarios.length === 0 && (
                        <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
                          No scenarios
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Manage Scenarios Tab */}
        <TabsContent value="manage">
          {scenarios.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No scenarios created yet. Go to What-If Studio to create scenarios.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All Scenarios ({scenarios.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sites</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarios.map((scenario) => (
                      <TableRow key={scenario.id}>
                        <TableCell className="font-medium">{scenario.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{scenario.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={scenario.status}
                            onValueChange={(v) => updateStatus(scenario.id, v as ScenarioStatus)}
                          >
                            <SelectTrigger className="h-7 w-36 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ALL_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_COLORS[s]}`}>
                                    {s}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {scenario.parameters.targetSiteIds.length} site(s)
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(scenario.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {confirmDeleteId === scenario.id ? (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-xs text-muted-foreground mr-1">Confirm?</span>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-6 text-xs"
                                onClick={() => handleDelete(scenario.id)}
                              >
                                Yes, Delete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setConfirmDeleteId(scenario.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Methodology & Explanation Tab */}
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
      </Tabs>
    </div>
  );
}
