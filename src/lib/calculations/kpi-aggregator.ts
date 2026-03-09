import type { SitePerformance, WorkforceEntry, OpexBreakdown, CapexEntry } from "@/types";

export function aggregateUtilization(
  performance: SitePerformance[],
  workforce: WorkforceEntry[]
): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const perf of performance) {
    const siteHC = workforce
      .filter((w) => w.siteId === perf.siteId)
      .reduce((s, w) => s + w.headcount, 0);
    weightedSum += perf.utilization * siteHC;
    totalWeight += siteHC;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export function aggregateOtif(
  performance: SitePerformance[],
  workforce: WorkforceEntry[]
): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const perf of performance) {
    const siteHC = workforce
      .filter((w) => w.siteId === perf.siteId)
      .reduce((s, w) => s + w.headcount, 0);
    weightedSum += perf.otif * siteHC;
    totalWeight += siteHC;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export function totalOpex(opex: OpexBreakdown[]): number {
  return opex.reduce((sum, o) => sum + o.total, 0);
}

export function totalCapex(capex: CapexEntry[], year?: number): number {
  const filtered = year ? capex.filter((c) => c.year === year) : capex;
  return filtered.reduce((sum, c) => sum + c.amount, 0);
}

export function totalHeadcount(workforce: WorkforceEntry[]): number {
  return workforce.reduce((sum, w) => sum + w.headcount, 0);
}
