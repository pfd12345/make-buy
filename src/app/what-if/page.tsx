"use client";

import dynamic from "next/dynamic";

const WhatIfContent = dynamic(() => import("./what-if-content"), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="h-4 w-80 rounded bg-muted" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-96 rounded-lg bg-muted" />
        <div className="h-96 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function WhatIfPage() {
  return <WhatIfContent />;
}
