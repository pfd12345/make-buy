"use client";

import { useMemo } from "react";
import { useBaselineStore } from "@/stores/baseline-store";
import { PageHeader } from "@/components/layout/page-header";
import { KPICard } from "@/components/charts/kpi-card";
import { SiteUtilizationChart } from "@/components/charts/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OverviewContent() {
  const sites = useBaselineStore((s) => s.sites);
  const performance = useBaselineStore((s) => s.performance);
  const opex = useBaselineStore((s) => s.opex);
  const capex = useBaselineStore((s) => s.capex);
  const workforce = useBaselineStore((s) => s.workforce);
  const riskAlerts = useBaselineStore((s) => s.riskAlerts);

  const summary = useMemo(() => {
    const totalOpex = opex.reduce((sum, o) => sum + o.total, 0);
    const totalCapex = capex.filter((c) => c.year === 2026).reduce((sum, c) => sum + c.amount, 0);
    const totalHeadcount = workforce.reduce((sum, w) => sum + w.headcount, 0);

    let weightedUtil = 0;
    let weightedOtif = 0;
    let totalWeight = 0;
    for (const perf of performance) {
      const siteHC = workforce.filter((w) => w.siteId === perf.siteId).reduce((s, w) => s + w.headcount, 0);
      weightedUtil += perf.utilization * siteHC;
      weightedOtif += perf.otif * siteHC;
      totalWeight += siteHC;
    }

    return {
      totalOpex: Math.round(totalOpex),
      totalCapex: Math.round(totalCapex),
      avgUtilization: totalWeight > 0 ? Math.round(weightedUtil / totalWeight) : 0,
      avgOtif: totalWeight > 0 ? Math.round(weightedOtif / totalWeight) : 0,
      totalHeadcount,
      siteCount: sites.length,
    };
  }, [sites, performance, opex, capex, workforce]);

  const utilData = useMemo(() =>
    sites.map((site) => {
      const perf = performance.find((p) => p.siteId === site.id);
      return { name: site.name, utilization: perf?.utilization ?? 0 };
    }).sort((a, b) => b.utilization - a.utilization),
    [sites, performance]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Overview"
        description="Network-wide KPIs and risk hotspots"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KPICard title="Sites" value={summary.siteCount} />
        <KPICard title="Avg Utilization" value={`${summary.avgUtilization}%`} />
        <KPICard title="Avg OTIF" value={`${summary.avgOtif}%`} />
        <KPICard title="Headcount" value={String(summary.totalHeadcount)} />
        <KPICard title="Total OPEX" value={`$${summary.totalOpex}M`} />
        <KPICard title="Total CapEx (Y1)" value={`$${summary.totalCapex}M`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Site Utilization Hotspot</CardTitle>
          </CardHeader>
          <CardContent>
            <SiteUtilizationChart data={utilData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Alerts ({riskAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-md border p-3">
                <Badge
                  variant={alert.severity === "Critical" ? "destructive" : "secondary"}
                  className={cn(
                    "shrink-0",
                    alert.severity === "Warning" && "bg-amber-100 text-amber-800"
                  )}
                >
                  {alert.severity}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
