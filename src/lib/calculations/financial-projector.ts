import { DISCOUNT_RATE } from "@/lib/constants";

export function computeNPV(cashFlows: number[], discountRate: number = DISCOUNT_RATE): number {
  return cashFlows.reduce((npv, cf, i) => {
    return npv + cf / Math.pow(1 + discountRate, i + 1);
  }, 0);
}

export function computePaybackYears(cumulativeCashFlows: number[]): number {
  for (let i = 0; i < cumulativeCashFlows.length; i++) {
    if (cumulativeCashFlows[i] >= 0) return i + 1;
  }
  return cumulativeCashFlows.length + 1; // No payback within horizon
}

export function computeIRR(cashFlows: number[], initialInvestment: number, maxIterations = 100): number {
  // Newton's method for IRR
  let rate = 0.10; // initial guess
  for (let i = 0; i < maxIterations; i++) {
    let npv = -initialInvestment;
    let derivative = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const factor = Math.pow(1 + rate, t + 1);
      npv += cashFlows[t] / factor;
      derivative -= (t + 1) * cashFlows[t] / Math.pow(1 + rate, t + 2);
    }
    if (Math.abs(npv) < 0.001) break;
    if (derivative === 0) break;
    rate = rate - npv / derivative;
    if (rate < -0.99) rate = -0.5;
    if (rate > 10) rate = 1;
  }
  return Math.round(rate * 1000) / 10; // percentage with 1 decimal
}
