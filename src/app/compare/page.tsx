"use client";

import dynamic from "next/dynamic";

const CompareContent = dynamic(() => import("./compare-content"), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-56 rounded bg-muted" />
      <div className="h-4 w-80 rounded bg-muted" />
      <div className="h-40 rounded-lg bg-muted" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-lg bg-muted" />
        <div className="h-80 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function ComparePage() {
  return <CompareContent />;
}
