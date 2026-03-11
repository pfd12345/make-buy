"use client";

import { useState, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { useScenarioStore } from "@/stores/scenario-store";
import { useBaselineStore } from "@/stores/baseline-store";
import { useScenarioHydration } from "@/hooks/use-store-hydration";
import { computeScenarioImpact } from "@/lib/calculations/scenario-engine";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import type { Scenario, ScenarioStatus } from "@/types";

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

/* ------------------------------------------------------------------ */
/*  Scenario Detail Dialog                                             */
/* ------------------------------------------------------------------ */

function ScenarioDetailDialog({
  scenario,
  onClose,
}: {
  scenario: Scenario | null;
  onClose: () => void;
}) {
  const baseline = useBaselineStore(useShallow((s) => ({
    sites: s.sites, performance: s.performance, lines: s.lines,
    assets: s.assets, workforce: s.workforce, opex: s.opex,
    capex: s.capex, qualifications: s.qualifications,
  })));
  const setActiveScenario = useScenarioStore((s) => s.setActiveScenario);

  const impact = useMemo(() => {
    if (!scenario) return null;
    try {
      return computeScenarioImpact(scenario, baseline);
    } catch {
      return null;
    }
  }, [scenario, baseline]);

  if (!scenario) return null;

  const p = scenario.parameters;
  const siteNames = p.targetSiteIds
    .map((id) => baseline.sites.find((s) => s.id === id)?.name ?? id)
    .join(", ");
  const lineNames = p.targetLineIds
    ?.map((id) => baseline.lines.find((l) => l.id === id)?.name ?? id)
    .join(", ");

  return (
    <Dialog open={!!scenario} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{scenario.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="secondary">{scenario.type}</Badge>
              <Badge variant="secondary" className={STATUS_COLORS[scenario.status]}>{scenario.status}</Badge>
              <span className="text-xs text-muted-foreground">
                Created {new Date(scenario.createdAt).toLocaleDateString()}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        {scenario.description && (
          <p className="text-sm text-muted-foreground">{scenario.description}</p>
        )}

        <Separator />

        {/* Target Scope */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Target Scope</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            <DetailRow label="Sites" value={siteNames} />
            {lineNames && <DetailRow label="Lines" value={lineNames} />}
            {p.targetModality && <DetailRow label="Modality" value={p.targetModality} />}
            {p.productFamily && <DetailRow label="Product Family" value={p.productFamily} />}
          </div>
        </div>

        <Separator />

        {/* Parameters */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Parameters</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {scenario.type === "AddLine" && (
              <>
                {p.capexInvestment != null && <DetailRow label="CapEx Investment" value={`$${p.capexInvestment}M`} />}
                {p.additionalFTEs != null && <DetailRow label="Additional FTEs" value={String(p.additionalFTEs)} />}
                {p.rampUpMonths != null && <DetailRow label="Ramp-Up" value={`${p.rampUpMonths} months`} />}
                {p.newLineType && <DetailRow label="Line Type" value={p.newLineType} />}
                {p.targetUtilization != null && <DetailRow label="Target Utilization" value={`${p.targetUtilization}%`} />}
              </>
            )}
            {scenario.type === "RemoveLine" && (
              <>
                {p.decommissionCost != null && <DetailRow label="Decommission Cost" value={`$${p.decommissionCost}M`} />}
                {p.productTransferCostPerProduct != null && <DetailRow label="Transfer Cost/Product" value={`$${p.productTransferCostPerProduct}M`} />}
                {p.severanceIncluded != null && <DetailRow label="Severance Included" value={p.severanceIncluded ? "Yes" : "No"} />}
              </>
            )}
            {scenario.type === "DivestSite" && (
              <>
                {p.restructuringCharges != null && <DetailRow label="Restructuring Charges" value={`$${p.restructuringCharges}M`} />}
                {p.estimatedSaleProceeds != null && <DetailRow label="Sale Proceeds" value={`$${p.estimatedSaleProceeds}M`} />}
                {p.totalProductTransferCost != null && <DetailRow label="Product Transfer Cost" value={`$${p.totalProductTransferCost}M`} />}
                {p.timelineMonths != null && <DetailRow label="Timeline" value={`${p.timelineMonths} months`} />}
              </>
            )}
            {scenario.type === "CDMOShift" && (
              <>
                {p.volumeToTransferPct != null && <DetailRow label="Volume to Transfer" value={`${p.volumeToTransferPct}%`} />}
                {p.cdmoCostPerBatch != null && <DetailRow label="CDMO Cost/Batch" value={`$${p.cdmoCostPerBatch}K`} />}
                {p.techTransferCost != null && <DetailRow label="Tech Transfer Cost" value={`$${p.techTransferCost}M`} />}
                {p.managementOverheadPct != null && <DetailRow label="Mgmt Overhead" value={`${p.managementOverheadPct}%`} />}
              </>
            )}
          </div>
        </div>

        {/* Impact Preview */}
        {impact && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Impact Preview</h4>
              <div className="grid grid-cols-4 gap-3">
                <MiniKPI label="NPV" value={`$${impact.npv.toFixed(1)}M`} />
                <MiniKPI label="IRR" value={`${(impact.irr * 100).toFixed(1)}%`} />
                <MiniKPI label="Payback" value={`${impact.paybackYears}yr`} />
                <MiniKPI
                  label="FTE Change"
                  value={`${impact.summaryDeltas.headcountDelta >= 0 ? "+" : ""}${impact.summaryDeltas.headcountDelta}`}
                />
              </div>
              {impact.bottlenecks.length > 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  {impact.bottlenecks.length} bottleneck alert{impact.bottlenecks.length > 1 ? "s" : ""} detected
                </p>
              )}
            </div>
          </>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button size="sm" asChild onClick={() => setActiveScenario(scenario.id)}>
            <Link href="/impact">View Full Impact</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function MiniKPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-2 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function CollaborationContent() {
  useScenarioHydration();
  const scenarios = useScenarioStore((s) => s.scenarios);
  const updateStatus = useScenarioStore((s) => s.updateScenarioStatus);
  const deleteScenario = useScenarioStore((s) => s.deleteScenario);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

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
                        <Card key={scenario.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedScenario(scenario)}>
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
                            <div className="flex gap-1 flex-wrap" onClick={(e) => e.stopPropagation()}>
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
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs"
                              onClick={() => setSelectedScenario(scenario)}
                            >
                              View
                            </Button>
                            {confirmDeleteId === scenario.id ? (
                              <>
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
                              </>
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

      </Tabs>

      {/* Scenario Detail Dialog */}
      <ScenarioDetailDialog
        scenario={selectedScenario}
        onClose={() => setSelectedScenario(null)}
      />
    </div>
  );
}
