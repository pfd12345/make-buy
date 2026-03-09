"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  className?: string;
}

export function KPICard({ title, value, unit, delta, deltaLabel, className }: KPICardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
        </div>
        {delta !== undefined && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {delta > 0 ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : delta < 0 ? (
              <TrendingDown className="h-3 w-3 text-red-500" />
            ) : (
              <Minus className="h-3 w-3 text-muted-foreground" />
            )}
            <span
              className={cn(
                delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"
              )}
            >
              {delta > 0 ? "+" : ""}{delta}% {deltaLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
