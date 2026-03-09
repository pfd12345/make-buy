"use client";

import dynamic from "next/dynamic";

export const SiteUtilizationChart = dynamic(
  () => import("./site-utilization-chart").then((m) => m.SiteUtilizationChart),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded bg-muted" /> }
);

export const StackedBarChart = dynamic(
  () => import("./stacked-bar-chart").then((m) => m.StackedBarChart),
  { ssr: false, loading: () => <div className="h-[350px] animate-pulse rounded bg-muted" /> }
);

export const SimpleAreaChart = dynamic(
  () => import("./area-chart").then((m) => m.SimpleAreaChart),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse rounded bg-muted" /> }
);

export const RadarChartComponent = dynamic(
  () => import("./radar-chart").then((m) => m.RadarChartComponent),
  { ssr: false, loading: () => <div className="h-[350px] animate-pulse rounded bg-muted" /> }
);
