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

      {scenarios.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No scenarios created yet. Go to What-If Studio to create scenarios.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="workflow">
          <TabsList>
            <TabsTrigger value="workflow">Workflow Board</TabsTrigger>
            <TabsTrigger value="manage">Manage Scenarios</TabsTrigger>
          </TabsList>

          {/* Workflow Board Tab */}
          <TabsContent value="workflow">
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
          </TabsContent>

          {/* Manage Scenarios Tab */}
          <TabsContent value="manage">
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
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
