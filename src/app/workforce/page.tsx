"use client";

import { useMemo } from "react";
import { useBaselineStore } from "@/stores/baseline-store";
import { PageHeader } from "@/components/layout/page-header";
import { StackedBarChart } from "@/components/charts/stacked-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FUNCTION_COLORS, ALL_FUNCTIONS, OPEX_COLORS, OPEX_LABELS } from "@/lib/constants";
import type { FunctionType } from "@/types";

export default function WorkforcePage() {
  const workforce = useBaselineStore((s) => s.workforce);
  const sites = useBaselineStore((s) => s.sites);
  const opex = useBaselineStore((s) => s.opex);

  // Heatmap data: sites x functions
  const heatmapData = useMemo(() => {
    return sites.map((site) => {
      const siteWf = workforce.filter((w) => w.siteId === site.id);
      const row: Record<string, number | string> = { site: site.name };
      for (const fn of ALL_FUNCTIONS) {
        const entry = siteWf.find((w) => w.function === fn);
        row[fn] = entry?.headcount ?? 0;
      }
      return row;
    });
  }, [sites, workforce]);

  const maxHC = useMemo(() => Math.max(...workforce.map((w) => w.headcount)), [workforce]);

  const costPerFTEData = useMemo(() => {
    return sites.map((site) => {
      const siteWf = workforce.filter((w) => w.siteId === site.id);
      const totalHC = siteWf.reduce((s, w) => s + w.headcount, 0);
      const totalCost = siteWf.reduce((s, w) => s + w.headcount * w.avgCostPerFTE, 0);
      return { name: site.name, costPerFTE: totalHC > 0 ? Math.round(totalCost / totalHC) : 0 };
    });
  }, [sites, workforce]);

  const opexChartData = useMemo(() => {
    return opex.map((o) => ({
      name: o.siteName,
      peopleCost: o.peopleCost,
      depreciation: o.depreciation,
      materialCost: o.materialCost,
      otherDirect: o.otherDirect,
      crossCharges: o.crossCharges,
    }));
  }, [opex]);

  function heatColor(value: number) {
    const intensity = Math.round((value / maxHC) * 100);
    return `rgba(59, 130, 246, ${Math.max(0.1, intensity / 100)})`;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Workforce & OPEX" description="Headcount distribution and operating cost analysis" />

      <Card>
        <CardHeader><CardTitle className="text-base">Workforce Heatmap (FTE by Site & Function)</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left font-medium text-muted-foreground">Site</th>
                {ALL_FUNCTIONS.map((fn) => (
                  <th key={fn} className="p-2 text-center font-medium text-muted-foreground">{fn}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.site as string}>
                  <td className="p-2 font-medium">{row.site}</td>
                  {ALL_FUNCTIONS.map((fn) => {
                    const val = row[fn] as number;
                    return (
                      <td
                        key={fn}
                        className="p-2 text-center font-mono"
                        style={{ backgroundColor: heatColor(val) }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Average Cost per FTE by Site ($K)</CardTitle></CardHeader>
          <CardContent>
            <StackedBarChart
              data={costPerFTEData}
              xKey="name"
              categories={["costPerFTE"]}
              colors={{ costPerFTE: "#8b5cf6" }}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">OPEX Breakdown by Site</CardTitle></CardHeader>
          <CardContent>
            <StackedBarChart
              data={opexChartData}
              xKey="name"
              categories={["peopleCost", "depreciation", "materialCost", "otherDirect", "crossCharges"]}
              colors={OPEX_COLORS}
              labels={OPEX_LABELS}
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
