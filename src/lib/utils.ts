import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, compact = true): string {
  if (compact && Math.abs(value) >= 1) {
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}B`;
    return `${sign}$${Math.round(abs)}M`;
  }
  if (compact && Math.abs(value) < 1) {
    return `$${(value * 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(1)}M`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatDelta(value: number, format: "currency" | "percent" | "number" = "number"): string {
  const sign = value > 0 ? "+" : "";
  switch (format) {
    case "currency":
      return `${sign}$${Math.round(value)}M`;
    case "percent":
      return `${sign}${Math.round(value)}%`;
    default:
      return `${sign}${Math.round(value)}`;
  }
}

export function getThresholdColor(value: number, thresholds: { critical: number; warning: number; good: number }, inverted = false): string {
  if (inverted) {
    if (value >= thresholds.good) return "text-red-600";
    if (value >= thresholds.warning) return "text-amber-600";
    return "text-green-600";
  }
  if (value < thresholds.critical) return "text-red-600";
  if (value < thresholds.warning) return "text-amber-600";
  return "text-green-600";
}

export function getThresholdBg(value: number, thresholds: { critical: number; warning: number; good: number }): string {
  if (value < thresholds.critical) return "bg-red-100 text-red-800";
  if (value < thresholds.warning) return "bg-amber-100 text-amber-800";
  return "bg-green-100 text-green-800";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
