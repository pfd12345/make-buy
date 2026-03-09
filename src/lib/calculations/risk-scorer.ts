import type { Site, Asset, SitePerformance, SiteProductQualification, CapexEntry, RiskAlert, RiskScore } from "@/types";
import { RISK_WEIGHTS } from "@/lib/constants";

export function computeRiskScores(
  sites: Site[],
  assets: Asset[],
  performance: SitePerformance[],
  qualifications: SiteProductQualification[],
  capex: CapexEntry[]
): RiskScore[] {
  return sites.map((site) => {
    const siteAssets = assets.filter((a) => a.siteId === site.id);
    const sitePerf = performance.find((p) => p.siteId === site.id);
    const siteQuals = qualifications.filter((q) => q.siteId === site.id);

    // Single source score
    const singleSourceCount = siteQuals.filter((q) => q.isOnlySource).length;
    const singleSource = Math.min(5, singleSourceCount * 2 + 1);

    // Obsolescence score
    const highObsCount = siteAssets.filter((a) => a.obsolescenceRisk === "High").length;
    const medObsCount = siteAssets.filter((a) => a.obsolescenceRisk === "Medium").length;
    const obsolescence = Math.min(5, highObsCount * 2 + medObsCount * 0.5 + 1);

    // Geographic concentration
    const siteModalities = site.modalities;
    let geoScore = 1;
    for (const mod of siteModalities) {
      const modSites = sites.filter((s) => s.modalities.includes(mod));
      if (modSites.length <= 2) geoScore = Math.max(geoScore, 3);
      if (modSites.length <= 1) geoScore = 5;
    }

    // OTIF performance
    const otif = sitePerf?.otif ?? 95;
    const otifScore = otif < 90 ? 5 : otif < 93 ? 3 : otif < 95 ? 2 : 1;

    // CapEx cliff
    const siteCapex = capex.filter((c) => c.siteId === site.id);
    const y3Capex = siteCapex.filter((c) => c.year >= 2028 && c.year <= 2029);
    const capexCliff = y3Capex.length >= 2 ? 4 : y3Capex.length === 1 ? 2 : 1;

    // Regulatory
    const regulatory = site.modalities.includes("Biologics") ? 2 : 1;

    const composite =
      singleSource * RISK_WEIGHTS.single_source +
      obsolescence * RISK_WEIGHTS.obsolescence +
      geoScore * RISK_WEIGHTS.geographic_concentration +
      otifScore * RISK_WEIGHTS.otif_performance +
      capexCliff * RISK_WEIGHTS.capex_cliff +
      regulatory * RISK_WEIGHTS.regulatory;

    return {
      siteId: site.id,
      singleSource,
      obsolescence,
      geographicConcentration: geoScore,
      otifPerformance: otifScore,
      capexCliff,
      regulatory,
      composite: Math.round(composite * 10) / 10,
    };
  });
}

export function computeRiskAlerts(
  sites: Site[],
  assets: Asset[],
  performance: SitePerformance[],
  qualifications: SiteProductQualification[],
  capex: CapexEntry[]
): RiskAlert[] {
  const alerts: RiskAlert[] = [];

  // Single-source check
  const singleSourceQuals = qualifications.filter((q) => q.isOnlySource);
  for (const qual of singleSourceQuals) {
    const severity = qual.modality === "Biologics" ? "Critical" as const : "Warning" as const;
    alerts.push({
      id: `risk-ss-${qual.siteId}-${qual.productFamily}`,
      severity,
      title: `Single-Source: ${qual.productFamily}`,
      description: `${qual.siteName} is the only qualified source for ${qual.productFamily}.`,
      targetScreen: "/dependencies",
      targetFilter: { site: qual.siteId },
      dimension: "single_source",
    });
  }

  // Obsolescence check
  const siteAssetGroups = new Map<string, Asset[]>();
  for (const asset of assets) {
    if (asset.ageYears / asset.expectedLifespan > 0.75) {
      const list = siteAssetGroups.get(asset.siteId) || [];
      list.push(asset);
      siteAssetGroups.set(asset.siteId, list);
    }
  }
  for (const [siteId, siteAssets] of siteAssetGroups) {
    const site = sites.find((s) => s.id === siteId);
    if (siteAssets.length >= 2) {
      alerts.push({
        id: `risk-obs-${siteId}`,
        severity: "Critical",
        title: `Asset Obsolescence at ${site?.name}`,
        description: `${siteAssets.length} assets at ${site?.name} are approaching end of life.`,
        targetScreen: "/assets",
        targetFilter: { site: siteId },
        dimension: "obsolescence",
      });
    }
  }

  // OTIF check
  for (const perf of performance) {
    if (perf.otif < 93) {
      const site = sites.find((s) => s.id === perf.siteId);
      alerts.push({
        id: `risk-otif-${perf.siteId}`,
        severity: perf.otif < 90 ? "Critical" : "Warning",
        title: `${site?.name} OTIF Below Target`,
        description: `OTIF at ${perf.otif}% vs 93% target.`,
        targetScreen: "/performance",
        targetFilter: { site: perf.siteId },
        dimension: "otif_performance",
      });
    }
  }

  return alerts;
}
