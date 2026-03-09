"use client";

import { useMemo } from "react";
import { useBaselineStore } from "@/stores/baseline-store";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/tables/data-table";
import { SimpleAreaChart } from "@/components/charts/area-chart";
import { StackedBarChart } from "@/components/charts/stacked-bar-chart";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { Asset } from "@/types";

export default function AssetLifecyclePage() {
  const assets = useBaselineStore((s) => s.assets);
  const capex = useBaselineStore((s) => s.capex);

  const ageDistribution = useMemo(() => {
    const buckets = [
      { label: "0-5 yrs", min: 0, max: 5 },
      { label: "5-10 yrs", min: 5, max: 10 },
      { label: "10-15 yrs", min: 10, max: 15 },
      { label: "15+ yrs", min: 15, max: 100 },
    ];
    return buckets.map((b) => ({
      name: b.label,
      count: assets.filter((a) => a.ageYears >= b.min && a.ageYears < b.max).length,
    }));
  }, [assets]);

  const capexTimeline = useMemo(() => {
    const years = [...new Set(capex.map((c) => c.year))].sort();
    return years.map((year) => ({
      year: `${year}`,
      amount: capex.filter((c) => c.year === year).reduce((s, c) => s + c.amount, 0),
    }));
  }, [capex]);

  const columns: ColumnDef<Asset, unknown>[] = [
    { accessorKey: "siteName", header: ({ column }) => <SortableHeader column={column} label="Site" /> },
    { accessorKey: "lineName", header: "Line" },
    { accessorKey: "assetType", header: "Type" },
    { accessorKey: "ageYears", header: ({ column }) => <SortableHeader column={column} label="Age (yrs)" /> },
    { accessorKey: "expectedLifespan", header: "Expected Life" },
    {
      id: "remainingLife",
      header: "Remaining",
      cell: ({ row }) => {
        const rem = row.original.expectedLifespan - row.original.ageYears;
        return `${rem} yrs`;
      },
    },
    {
      accessorKey: "obsolescenceRisk",
      header: "Risk",
      cell: ({ getValue }) => {
        const v = getValue() as string;
        return (
          <Badge
            variant={v === "High" ? "destructive" : "secondary"}
            className={v === "Medium" ? "bg-amber-100 text-amber-800" : ""}
          >
            {v}
          </Badge>
        );
      },
    },
    { accessorKey: "annualMaintenanceCost", header: "Maint. ($M)", cell: ({ getValue }) => `$${getValue()}M` },
    { accessorKey: "replacementCost", header: "Replace ($M)", cell: ({ getValue }) => `$${getValue()}M` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Asset Lifecycle" description="Equipment age, replacement planning, and CapEx timeline" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Age Distribution</CardTitle></CardHeader>
          <CardContent>
            <StackedBarChart
              data={ageDistribution}
              xKey="name"
              categories={["count"]}
              colors={{ count: "#3b82f6" }}
              height={250}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">CapEx Timeline</CardTitle></CardHeader>
          <CardContent>
            <SimpleAreaChart data={capexTimeline} xKey="year" yKey="amount" height={250} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Asset Inventory</CardTitle></CardHeader>
        <CardContent>
          <DataTable data={assets} columns={columns} searchKey="siteName" searchPlaceholder="Search sites..." />
        </CardContent>
      </Card>
    </div>
  );
}
