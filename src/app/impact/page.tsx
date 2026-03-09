"use client";

import { useMemo } from "react";
import { useScenarioStore } from "@/stores/scenario-store";
import { useBaselineStore } from "@/stores/baseline-store";
import { computeScenarioImpact } from "@/lib/calculations/scenario-engine";
import { PageHeader } from "@/components/layout/page-header";
import { KPICard } from "@/components/charts/kpi-card";
import { SimpleAreaChart } from "@/components/charts/area-chart";
import { DataTable, SortableHeader } from "@/components/tables/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { ScenarioYearlyImpact } from "@/types";

export default function ImpactPage() {
  const scenarios = useScenarioStore((s) => s.scenarios);
  const activeId = useScenarioStore((s) => s.activeScenarioId);
  const setActive = useScenarioStore((s) => s.setActiveScenario);
  const baseline = useBaselineStore((s) => ({
    sites: s.sites, performance: s.performance, lines: s.lines,
    assets: s.assets, workforce: s.workforce, opex: s.opex,
    capex: s.capex, qualifications: s.qualifications,
  }));

  const activeScenario = scenarios.find((s) => s.id === activeId);
  const impact = useMemo(() => {
    if (!activeScenario) return null;
    return computeScenarioImpact(activeScenario, baseline);
  }, [activeScenario, baseline]);

  const yearColumns: ColumnDef<ScenarioYearlyImpact, unknown>[] = [
    { accessorKey: "year", header: "Year" },
    { accessorKey: "projectedUtilization", header: "Utilization %" },
    { accessorKey: "opexDelta", header: ({ column }) => <SortableHeader column={column} label="OPEX Delta ($M)" /> },
    { accessorKey: "capexDelta", header: "CapEx ($M)" },
    { accessorKey: "headcountDelta", header: "FTE Delta" },
    { accessorKey: "cumulativeNetCashFlow", header: ({ column }) => <SortableHeader column={column} label="Cum. Cash Flow ($M)" /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Impact Summary" description="Detailed financial and operational impact of the active scenario">
        <Select value={activeId ?? ""} onValueChange={(v) => setActive(v)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select scenario" />
          </SelectTrigger>
          <SelectContent>
            {scenarios.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      {!impact ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {scenarios.length === 0
              ? "No scenarios created yet. Go to What-If Studio to create one."
              : "Select a scenario above to view its impact summary."
            }
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KPICard title="NPV" value={`$${impact.npv}M`} />
            <KPICard title="IRR" value={`${impact.irr}%`} />
            <KPICard title="Payback" value={`${impact.paybackYears} yrs`} />
            <KPICard title="FTE Change" value={impact.summaryDeltas.headcountDelta} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Cumulative Cash Flow</CardTitle></CardHeader>
              <CardContent>
                <SimpleAreaChart
                  data={impact.yearlyImpacts.map((y) => ({
                    year: `Y${y.year}`,
                    value: y.cumulativeNetCashFlow,
                  }))}
                  xKey="year"
                  yKey="value"
                  showZeroLine
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Bottleneck Alerts</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {impact.bottlenecks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No bottlenecks detected.</p>
                ) : (
                  impact.bottlenecks.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 rounded border p-3">
                      <Badge variant={b.severity === "Critical" ? "destructive" : "secondary"}>{b.severity}</Badge>
                      <div>
                        <p className="text-sm font-medium">{b.title}</p>
                        <p className="text-xs text-muted-foreground">{b.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Year-by-Year Projections</CardTitle></CardHeader>
            <CardContent>
              <DataTable data={impact.yearlyImpacts} columns={yearColumns} pageSize={10} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
