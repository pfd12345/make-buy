"use client";

import dynamic from "next/dynamic";

const AppSidebar = dynamic(
  () => import("@/components/layout/app-sidebar").then((m) => m.AppSidebar),
  {
    ssr: false,
    loading: () => <div className="w-56 shrink-0 border-r bg-sidebar h-screen" />,
  }
);

export function DynamicSidebar() {
  return <AppSidebar />;
}
