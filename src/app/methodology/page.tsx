"use client";

import dynamic from "next/dynamic";

const MethodologyContent = dynamic(() => import("./methodology-content"), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded bg-muted" />
      <div className="h-4 w-96 rounded bg-muted" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-48 rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export default function MethodologyPage() {
  return <MethodologyContent />;
}
