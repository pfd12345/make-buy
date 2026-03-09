"use client";

import { useMemo } from "react";
import { useBaselineStore } from "@/stores/baseline-store";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StackedBarChart } from "@/components/charts/stacked-bar-chart";
import { DataTable, SortableHeader } from "@/components/tables/data-table";
import { FUNCTION_COLORS, OPEX_COLORS, OPEX_LABELS } from "@/lib/constants";
import type { ColumnDef } from "@tanstack/react-table";
import type { WorkforceEntry, OpexBreakdown } from "@/types";

export default function FactBasePage() {
  const workforce = useBaselineStore((s) => s.workforce);
  const opex = useBaselineStore((s) => s.opex);
  const sites = useBaselineStore((s) => s.sites);

  const wfChartData = useMemo(() => {
    return sites.map((site) => {
      const siteWf = workforce.filter((w) => w.siteId === site.id);
      const entry: Record<string, unknown> = { name: site.name };
      for (const w of siteWf) {
        entry[w.function] = w.headcount;
      }
      return entry;
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

  const wfColumns: ColumnDef<WorkforceEntry, unknown>[] = [
    { accessorKey: "siteName", header: ({ column }) => <SortableHeader column={column} label="Site" /> },
    { accessorKey: "function", header: "Function" },
    { accessorKey: "headcount", header: ({ column }) => <SortableHeader column={column} label="Headcount" /> },
    { accessorKey: "avgCostPerFTE", header: "Avg Cost/FTE ($K)", cell: ({ getValue }) => `$${getValue()}K` },
    { accessorKey: "totalCost", header: "Total Cost ($M)", cell: ({ getValue }) => `$${getValue()}M` },
  ];

  const opexColumns: ColumnDef<OpexBreakdown, unknown>[] = [
    { accessorKey: "siteName", header: ({ column }) => <SortableHeader column={column} label="Site" /> },
    { accessorKey: "peopleCost", header: "People ($M)" },
    { accessorKey: "depreciation", header: "Depreciation ($M)" },
    { accessorKey: "materialCost", header: "Material ($M)" },
    { accessorKey: "otherDirect", header: "Other Direct ($M)" },
    { accessorKey: "crossCharges", header: "Cross-charges ($M)" },
    { accessorKey: "total", header: ({ column }) => <SortableHeader column={column} label="Total ($M)" /> },
  ];

  const wfFunctions = ["Manufacturing", "QA", "QC", "MSAT", "Engineering", "HR", "IT", "Finance"];
  const opexCategories = ["peopleCost", "depreciation", "materialCost", "otherDirect", "crossCharges"];

  return (
    <div className="space-y-6">
      <PageHeader title="Network Fact Base" description="Workforce and financial baseline data" />

      <Tabs defaultValue="workforce">
        <TabsList>
          <TabsTrigger value="workforce">Workforce</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="workforce" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">FTE by Site & Function</CardTitle></CardHeader>
            <CardContent>
              <StackedBarChart
                data={wfChartData}
                xKey="name"
                categories={wfFunctions}
                colors={FUNCTION_COLORS}
              />
            </CardContent>
          </Card>
          <DataTable data={workforce} columns={wfColumns} searchKey="siteName" searchPlaceholder="Search sites..." />
        </TabsContent>

        <TabsContent value="financials" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">OPEX Breakdown by Site</CardTitle></CardHeader>
            <CardContent>
              <StackedBarChart
                data={opexChartData}
                xKey="name"
                categories={opexCategories}
                colors={OPEX_COLORS}
                labels={OPEX_LABELS}
              />
            </CardContent>
          </Card>
          <DataTable data={opex} columns={opexColumns} searchKey="siteName" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
