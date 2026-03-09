"use client";

import { useScenarioStore } from "@/stores/scenario-store";
import { useScenarioHydration } from "@/hooks/use-store-hydration";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScenarioStatus } from "@/types";

const COLUMNS: { status: ScenarioStatus; label: string }[] = [
  { status: "Draft", label: "Draft" },
  { status: "Under Review", label: "Under Review" },
  { status: "Approved", label: "Approved" },
];

export default function CollaborationPage() {
  useScenarioHydration();
  const scenarios = useScenarioStore((s) => s.scenarios);
  const updateStatus = useScenarioStore((s) => s.updateScenarioStatus);
  const deleteScenario = useScenarioStore((s) => s.deleteScenario);

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

  return (
    <div className="space-y-6">
      <PageHeader title="Collaboration" description="Track scenario status and export data">
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
        <div className="grid gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => {
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
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs"
                              onClick={() => updateStatus(scenario.id, "Approved")}
                            >
                              Approve
                            </Button>
                          )}
                          {col.status === "Draft" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs text-red-600 hover:text-red-700"
                              onClick={() => deleteScenario(scenario.id)}
                            >
                              Delete
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
    </div>
  );
}
