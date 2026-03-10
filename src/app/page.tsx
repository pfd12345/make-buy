"use client";

import dynamic from "next/dynamic";

const OverviewContent = dynamic(() => import("./overview-content"), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded bg-muted" />
      <div className="h-4 w-96 rounded bg-muted" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-lg bg-muted" />
        <div className="h-80 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  return <OverviewContent />;
}
