"use client";

import { useMemo, useState } from "react";
import { useBaselineStore } from "@/stores/baseline-store";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, SortableHeader } from "@/components/tables/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { SiteProductQualification } from "@/types";

export default function DependenciesPage() {
  const sites = useBaselineStore((s) => s.sites);
  const qualifications = useBaselineStore((s) => s.qualifications);
  const [disruptedSite, setDisruptedSite] = useState<string>("");

  const singleSourceProducts = useMemo(
    () => qualifications.filter((q) => q.isOnlySource),
    [qualifications]
  );

  const productFamilies = useMemo(
    () => [...new Set(qualifications.map((q) => q.productFamily))],
    [qualifications]
  );

  // Capability matrix
  const matrixData = useMemo(() => {
    return sites.map((site) => {
      const row: Record<string, string> = { site: site.name };
      for (const pf of productFamilies) {
        const qual = qualifications.find((q) => q.siteId === site.id && q.productFamily === pf);
        row[pf] = qual ? (qual.isOnlySource ? "SOLE" : "YES") : "-";
      }
      return row;
    });
  }, [sites, productFamilies, qualifications]);

  // Disruption simulation
  const disruptionImpact = useMemo(() => {
    if (!disruptedSite) return [];
    const affected = qualifications.filter((q) => q.siteId === disruptedSite);
    return affected.map((q) => {
      const backups = q.backupSiteIds.length;
      return {
        product: q.productFamily,
        modality: q.modality,
        backupCount: backups,
        status: q.isOnlySource ? "CRITICAL" : backups > 1 ? "COVERED" : "AT RISK",
      };
    });
  }, [disruptedSite, qualifications]);

  const singleSourceColumns: ColumnDef<SiteProductQualification, unknown>[] = [
    { accessorKey: "productFamily", header: ({ column }) => <SortableHeader column={column} label="Product Family" /> },
    { accessorKey: "siteName", header: "Site" },
    { accessorKey: "modality", header: "Modality" },
    {
      id: "backups",
      header: "Backup Sites",
      cell: ({ row }) => row.original.backupSiteIds.length === 0
        ? <Badge variant="destructive">None</Badge>
        : row.original.backupSiteIds.map((id) => sites.find((s) => s.id === id)?.name).join(", "),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dependencies" description="Product-site qualification matrix and single-source risks" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Single-Source Products ({singleSourceProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={singleSourceProducts} columns={singleSourceColumns} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Capability Matrix</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left font-medium text-muted-foreground">Site</th>
                {productFamilies.map((pf) => (
                  <th key={pf} className="p-2 text-center font-medium text-muted-foreground whitespace-nowrap">{pf}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixData.map((row) => (
                <tr key={row.site}>
                  <td className="p-2 font-medium whitespace-nowrap">{row.site}</td>
                  {productFamilies.map((pf) => {
                    const val = row[pf];
                    return (
                      <td key={pf} className="p-2 text-center">
                        {val === "SOLE" ? (
                          <Badge variant="destructive" className="text-[10px]">SOLE</Badge>
                        ) : val === "YES" ? (
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">YES</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Disruption Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={disruptedSite} onValueChange={setDisruptedSite}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select site to take offline" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {disruptionImpact.length > 0 && (
            <div className="space-y-2">
              {disruptionImpact.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded border p-3 text-sm">
                  <Badge
                    variant={item.status === "CRITICAL" ? "destructive" : "secondary"}
                    className={item.status === "AT RISK" ? "bg-amber-100 text-amber-800" : item.status === "COVERED" ? "bg-emerald-100 text-emerald-800" : ""}
                  >
                    {item.status}
                  </Badge>
                  <span className="font-medium">{item.product}</span>
                  <span className="text-muted-foreground">({item.modality})</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.backupCount} backup site(s)
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
