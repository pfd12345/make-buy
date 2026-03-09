"use client";

import { useMemo } from "react";
import { useBaselineStore } from "@/stores/baseline-store";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { THRESHOLDS } from "@/lib/constants";

interface SitePerformanceRow {
  siteName: string;
  region: string;
  utilization: number;
  otif: number;
  oe: number;
  rft: number;
  lineCount: number;
}

export default function PerformancePage() {
  const sites = useBaselineStore((s) => s.sites);
  const performance = useBaselineStore((s) => s.performance);

  const rows = useMemo<SitePerformanceRow[]>(() =>
    sites.map((site) => {
      const perf = performance.find((p) => p.siteId === site.id);
      return {
        siteName: site.name,
        region: site.region,
        utilization: perf?.utilization ?? 0,
        otif: perf?.otif ?? 0,
        oe: perf?.oe ?? 0,
        rft: perf?.rft ?? 0,
        lineCount: site.lineCount,
      };
    }),
    [sites, performance]
  );

  const perfBadge = (val: number, thresholds: { critical: number; warning: number }) => {
    if (val < thresholds.critical) return <Badge variant="destructive">{val}%</Badge>;
    if (val < thresholds.warning) return <Badge className="bg-amber-100 text-amber-800">{val}%</Badge>;
    return <Badge className="bg-emerald-100 text-emerald-800">{val}%</Badge>;
  };

  const columns: ColumnDef<SitePerformanceRow, unknown>[] = [
    { accessorKey: "siteName", header: ({ column }) => <SortableHeader column={column} label="Site" /> },
    { accessorKey: "region", header: "Region" },
    { accessorKey: "lineCount", header: "Lines" },
    {
      accessorKey: "utilization",
      header: ({ column }) => <SortableHeader column={column} label="Utilization" />,
      cell: ({ getValue }) => perfBadge(getValue() as number, THRESHOLDS.utilization),
    },
    {
      accessorKey: "otif",
      header: ({ column }) => <SortableHeader column={column} label="OTIF" />,
      cell: ({ getValue }) => perfBadge(getValue() as number, THRESHOLDS.otif),
    },
    {
      accessorKey: "oe",
      header: ({ column }) => <SortableHeader column={column} label="OE" />,
      cell: ({ getValue }) => perfBadge(getValue() as number, THRESHOLDS.oe),
    },
    { accessorKey: "rft", header: "RFT %", cell: ({ getValue }) => `${getValue()}%` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Performance Baseline" description="Site-level performance KPIs and production metrics" />

      <Card>
        <CardHeader><CardTitle className="text-base">Site Performance Summary</CardTitle></CardHeader>
        <CardContent>
          <DataTable data={rows} columns={columns} searchKey="siteName" searchPlaceholder="Search sites..." />
        </CardContent>
      </Card>
    </div>
  );
}
