"use client";

import { useBaselineStore } from "@/stores/baseline-store";
import { PageHeader } from "@/components/layout/page-header";
import { KPICard } from "@/components/charts/kpi-card";
import { SiteUtilizationChart } from "@/components/charts/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OverviewContent() {
  const summary = useBaselineStore((s) => s.getNetworkSummary());
  const sites = useBaselineStore((s) => s.sites);
  const performance = useBaselineStore((s) => s.performance);
  const riskAlerts = useBaselineStore((s) => s.riskAlerts);

  const utilData = sites.map((site) => {
    const perf = performance.find((p) => p.siteId === site.id);
    return { name: site.name, utilization: perf?.utilization ?? 0 };
  }).sort((a, b) => b.utilization - a.utilization);

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
