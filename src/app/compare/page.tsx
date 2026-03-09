"use client";

import { useState, useMemo } from "react";
import { useScenarioStore } from "@/stores/scenario-store";
import { useScenarioHydration } from "@/hooks/use-store-hydration";
import { useBaselineStore } from "@/stores/baseline-store";
import { computeScenarioImpact } from "@/lib/calculations/scenario-engine";
import { PageHeader } from "@/components/layout/page-header";
import { RadarChartComponent } from "@/components/charts/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";

const RADAR_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export default function ComparePage() {
  useScenarioHydration();
  const scenarios = useScenarioStore((s) => s.scenarios);
  const baseline = useBaselineStore((s) => ({
    sites: s.sites, performance: s.performance, lines: s.lines,
    assets: s.assets, workforce: s.workforce, opex: s.opex,
    capex: s.capex, qualifications: s.qualifications,
  }));

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleScenario = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const impacts = useMemo(() => {
    return selectedIds.map((id) => {
      const scenario = scenarios.find((s) => s.id === id);
      if (!scenario) return null;
      return { scenario, impact: computeScenarioImpact(scenario, baseline) };
    }).filter(Boolean) as { scenario: (typeof scenarios)[0]; impact: ReturnType<typeof computeScenarioImpact> }[];
  }, [selectedIds, scenarios, baseline]);

  const radarDatasets = impacts.map((item, i) => ({
    name: item.scenario.name,
    data: {
      "Cost Efficiency": item.impact.radarScores.costEfficiency,
      Utilization: item.impact.radarScores.utilization,
      Risk: item.impact.radarScores.risk,
      Resilience: item.impact.radarScores.resilience,
      Flexibility: item.impact.radarScores.flexibility,
    },
    color: RADAR_COLORS[i % RADAR_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Compare Scenarios" description="Side-by-side comparison of up to 4 scenarios" />

      {scenarios.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No scenarios created yet. Go to What-If Studio to create scenarios.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle className="text-base">Select Scenarios (max 4)</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {scenarios.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <Checkbox
                      id={s.id}
                      checked={selectedIds.includes(s.id)}
                      onCheckedChange={() => toggleScenario(s.id)}
                    />
                    <Label htmlFor={s.id} className="text-sm">{s.name} ({s.type})</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {impacts.length >= 2 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Comparison Table</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        {impacts.map((item) => (
                          <TableHead key={item.scenario.id}>{item.scenario.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">NPV ($M)</TableCell>
                        {impacts.map((item) => (
                          <TableCell key={item.scenario.id}>${item.impact.npv}M</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">IRR (%)</TableCell>
                        {impacts.map((item) => (
                          <TableCell key={item.scenario.id}>{item.impact.irr}%</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Payback (yrs)</TableCell>
                        {impacts.map((item) => (
                          <TableCell key={item.scenario.id}>{item.impact.paybackYears}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">FTE Change</TableCell>
                        {impacts.map((item) => (
                          <TableCell key={item.scenario.id}>{item.impact.summaryDeltas.headcountDelta}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">OPEX Delta ($M)</TableCell>
                        {impacts.map((item) => (
                          <TableCell key={item.scenario.id}>${item.impact.summaryDeltas.opexDelta}M</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Bottlenecks</TableCell>
                        {impacts.map((item) => (
                          <TableCell key={item.scenario.id}>{item.impact.bottlenecks.length}</TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Radar Comparison</CardTitle></CardHeader>
                <CardContent>
                  <RadarChartComponent
                    datasets={radarDatasets}
                    dimensions={["Cost Efficiency", "Utilization", "Risk", "Resilience", "Flexibility"]}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
