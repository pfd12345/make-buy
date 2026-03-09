"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  Site, SitePerformance, ProductionLine, Asset,
  WorkforceEntry, OpexBreakdown, CapexEntry,
  SiteProductQualification, RiskAlert, NetworkSummary,
} from "@/types";
import { seedData } from "@/data/seed";

interface BaselineState {
  sites: Site[];
  performance: SitePerformance[];
  lines: ProductionLine[];
  assets: Asset[];
  workforce: WorkforceEntry[];
  opex: OpexBreakdown[];
  capex: CapexEntry[];
  qualifications: SiteProductQualification[];
  riskAlerts: RiskAlert[];
  isCustomDataLoaded: boolean;

  loadCSVData: (dataType: string, records: unknown[]) => void;
  resetToSeed: () => void;
  getNetworkSummary: () => NetworkSummary;
  getSiteById: (id: string) => Site | undefined;
  getWorkforceBySite: (siteId: string) => WorkforceEntry[];
  getOpexBySite: (siteId: string) => OpexBreakdown | undefined;
  getAssetsBySite: (siteId: string) => Asset[];
  getLinesBySite: (siteId: string) => ProductionLine[];
}

export const useBaselineStore = create<BaselineState>()(
  immer((set, get) => ({
    // Initialize eagerly with seed data so it's available on first render
    sites: seedData.sites,
    performance: seedData.sitePerformance,
    lines: seedData.productionLines,
    assets: seedData.assets,
    workforce: seedData.workforce,
    opex: seedData.opexBreakdowns,
    capex: seedData.capexEntries,
    qualifications: seedData.qualifications,
    riskAlerts: seedData.riskAlerts,
    isCustomDataLoaded: false,

    loadCSVData: (dataType: string, records: unknown[]) => {
      set((state) => {
        switch (dataType) {
          case "sites":
            state.sites = records as Site[];
            break;
          case "assets":
            state.assets = records as Asset[];
            break;
          case "workforce":
            state.workforce = records as WorkforceEntry[];
            break;
          case "opex":
            state.opex = records as OpexBreakdown[];
            break;
          case "capex":
            state.capex = records as CapexEntry[];
            break;
        }
        state.isCustomDataLoaded = true;
      });
    },

    resetToSeed: () => {
      set((state) => {
        state.sites = seedData.sites;
        state.performance = seedData.sitePerformance;
        state.lines = seedData.productionLines;
        state.assets = seedData.assets;
        state.workforce = seedData.workforce;
        state.opex = seedData.opexBreakdowns;
        state.capex = seedData.capexEntries;
        state.qualifications = seedData.qualifications;
        state.riskAlerts = seedData.riskAlerts;
        state.isCustomDataLoaded = false;
      });
    },

    getNetworkSummary: () => {
      const { sites, performance, opex, capex, workforce, riskAlerts } = get();
      const totalOpex = opex.reduce((sum, o) => sum + o.total, 0);
      const totalCapex = capex.filter((c) => c.year === 2026).reduce((sum, c) => sum + c.amount, 0);
      const totalHeadcount = workforce.reduce((sum, w) => sum + w.headcount, 0);

      let weightedUtil = 0;
      let weightedOtif = 0;
      let totalWeight = 0;
      for (const perf of performance) {
        const siteHC = workforce.filter((w) => w.siteId === perf.siteId).reduce((s, w) => s + w.headcount, 0);
        weightedUtil += perf.utilization * siteHC;
        weightedOtif += perf.otif * siteHC;
        totalWeight += siteHC;
      }

      return {
        totalOpex: Math.round(totalOpex),
        totalCapex: Math.round(totalCapex),
        avgUtilization: totalWeight > 0 ? Math.round(weightedUtil / totalWeight) : 0,
        avgOtif: totalWeight > 0 ? Math.round(weightedOtif / totalWeight) : 0,
        totalHeadcount,
        siteCount: sites.length,
        riskAlerts,
      };
    },

    getSiteById: (id: string) => get().sites.find((s) => s.id === id),
    getWorkforceBySite: (siteId: string) => get().workforce.filter((w) => w.siteId === siteId),
    getOpexBySite: (siteId: string) => get().opex.find((o) => o.siteId === siteId),
    getAssetsBySite: (siteId: string) => get().assets.filter((a) => a.siteId === siteId),
    getLinesBySite: (siteId: string) => get().lines.filter((l) => l.siteId === siteId),
  }))
);
