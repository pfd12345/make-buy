"use client";

import { useState, useMemo } from "react";
import { useBaselineStore } from "@/stores/baseline-store";
import { useScenarioStore } from "@/stores/scenario-store";
import { useScenarioHydration } from "@/hooks/use-store-hydration";
import { computeScenarioImpact } from "@/lib/calculations/scenario-engine";
import { PageHeader } from "@/components/layout/page-header";
import { KPICard } from "@/components/charts/kpi-card";
import { SimpleAreaChart } from "@/components/charts/area-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SCENARIO_DEFAULTS } from "@/lib/constants";
import type { Scenario, ScenarioType, ScenarioParameters } from "@/types";

const SCENARIO_TYPES: { value: ScenarioType; label: string; desc: string }[] = [
  { value: "AddLine", label: "Add Line", desc: "Invest in a new production line at an existing site" },
  { value: "RemoveLine", label: "Remove Line", desc: "Decommission underperforming production lines" },
  { value: "DivestSite", label: "Divest Site", desc: "Divest or close an entire manufacturing site" },
  { value: "CDMOShift", label: "CDMO Shift", desc: "Outsource volume to a contract manufacturer" },
];

export default function WhatIfPage() {
  useScenarioHydration();
  const sites = useBaselineStore((s) => s.sites);
  const lines = useBaselineStore((s) => s.lines);
  const baseline = useBaselineStore((s) => ({
    sites: s.sites, performance: s.performance, lines: s.lines,
    assets: s.assets, workforce: s.workforce, opex: s.opex,
    capex: s.capex, qualifications: s.qualifications,
  }));
  const addScenario = useScenarioStore((s) => s.addScenario);

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [type, setType] = useState<ScenarioType>("AddLine");
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [params, setParams] = useState<Partial<ScenarioParameters>>({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaults = SCENARIO_DEFAULTS[type] as any;

  const draftScenario: Scenario | null = useMemo(() => {
    if (!type || selectedSites.length === 0) return null;
    return {
      id: "draft",
      name: name || `New ${type}`,
      type,
      description: "",
      status: "Draft",
      createdAt: new Date().toISOString(),
      parameters: {
        targetSiteIds: selectedSites,
        targetLineIds: selectedLines,
        ...defaults,
        ...params,
      },
    };
  }, [type, selectedSites, selectedLines, name, params, defaults]);

  const impact = useMemo(() => {
    if (!draftScenario) return null;
    return computeScenarioImpact(draftScenario, baseline);
  }, [draftScenario, baseline]);

  const handleSave = () => {
    if (!draftScenario) return;
    const saved: Scenario = {
      ...draftScenario,
      id: `scenario-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    addScenario(saved);
    setStep(1);
    setName("");
    setSelectedSites([]);
    setSelectedLines([]);
    setParams({});
  };

  return (
    <div className="space-y-6">
      <PageHeader title="What-If Studio" description="Model network changes and preview impacts in real time" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Wizard Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Step indicators */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  step === s ? "bg-primary text-primary-foreground" : step > s ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
            <span className="ml-2 self-center text-sm text-muted-foreground">
              {step === 1 ? "Scenario Type" : step === 2 ? "Scope" : step === 3 ? "Parameters" : "Review & Save"}
            </span>
          </div>

          {/* Step 1: Type */}
          {step === 1 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Choose Scenario Type</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {SCENARIO_TYPES.map((st) => (
                  <button
                    key={st.value}
                    onClick={() => { setType(st.value); setStep(2); }}
                    className={`rounded-lg border p-4 text-left transition-colors hover:bg-accent ${
                      type === st.value ? "border-primary bg-accent" : ""
                    }`}
                  >
                    <div className="font-medium">{st.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{st.desc}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Scope */}
          {step === 2 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Select Target Site(s)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  {sites.map((site) => (
                    <button
                      key={site.id}
                      onClick={() => {
                        setSelectedSites((prev) =>
                          prev.includes(site.id) ? prev.filter((id) => id !== site.id) : [...prev, site.id]
                        );
                      }}
                      className={`rounded-md border p-3 text-left text-sm transition-colors hover:bg-accent ${
                        selectedSites.includes(site.id) ? "border-primary bg-accent" : ""
                      }`}
                    >
                      <span className="font-medium">{site.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{site.region}</span>
                    </button>
                  ))}
                </div>
                {(type === "RemoveLine") && selectedSites.length > 0 && (
                  <div>
                    <Label className="mb-2">Select Lines to Remove</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {lines.filter((l) => selectedSites.includes(l.siteId)).map((line) => (
                        <button
                          key={line.id}
                          onClick={() => {
                            setSelectedLines((prev) =>
                              prev.includes(line.id) ? prev.filter((id) => id !== line.id) : [...prev, line.id]
                            );
                          }}
                          className={`rounded-md border p-2 text-left text-xs transition-colors hover:bg-accent ${
                            selectedLines.includes(line.id) ? "border-primary bg-accent" : ""
                          }`}
                        >
                          {line.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Button onClick={() => setStep(3)} disabled={selectedSites.length === 0}>Next</Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Parameters */}
          {step === 3 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Configure Parameters</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Scenario Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={`New ${type}`} className="mt-1" />
                </div>
                {type === "AddLine" && (
                  <>
                    <div>
                      <Label>CapEx Investment ($M): {params.capexInvestment ?? defaults.capexInvestment}</Label>
                      <Slider
                        value={[params.capexInvestment ?? defaults.capexInvestment]}
                        min={10} max={200} step={5}
                        onValueChange={([v]) => setParams((p) => ({ ...p, capexInvestment: v }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Additional FTEs: {params.additionalFTEs ?? defaults.additionalFTEs}</Label>
                      <Slider
                        value={[params.additionalFTEs ?? defaults.additionalFTEs]}
                        min={5} max={100} step={5}
                        onValueChange={([v]) => setParams((p) => ({ ...p, additionalFTEs: v }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Ramp-Up (months): {params.rampUpMonths ?? defaults.rampUpMonths}</Label>
                      <Slider
                        value={[params.rampUpMonths ?? defaults.rampUpMonths]}
                        min={6} max={48} step={6}
                        onValueChange={([v]) => setParams((p) => ({ ...p, rampUpMonths: v }))}
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
                {type === "CDMOShift" && (
                  <>
                    <div>
                      <Label>Volume to Transfer (%): {params.volumeToTransferPct ?? defaults.volumeToTransferPct}</Label>
                      <Slider
                        value={[params.volumeToTransferPct ?? defaults.volumeToTransferPct]}
                        min={10} max={100} step={10}
                        onValueChange={([v]) => setParams((p) => ({ ...p, volumeToTransferPct: v }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>CDMO Cost/Batch ($K): {params.cdmoCostPerBatch ?? defaults.cdmoCostPerBatch}</Label>
                      <Slider
                        value={[params.cdmoCostPerBatch ?? defaults.cdmoCostPerBatch]}
                        min={50} max={500} step={25}
                        onValueChange={([v]) => setParams((p) => ({ ...p, cdmoCostPerBatch: v }))}
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
                {type === "DivestSite" && (
                  <>
                    <div>
                      <Label>Restructuring Charges ($M): {params.restructuringCharges ?? defaults.restructuringCharges}</Label>
                      <Slider
                        value={[params.restructuringCharges ?? defaults.restructuringCharges]}
                        min={5} max={100} step={5}
                        onValueChange={([v]) => setParams((p) => ({ ...p, restructuringCharges: v }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Estimated Sale Proceeds ($M)</Label>
                      <Input
                        type="number"
                        value={params.estimatedSaleProceeds ?? 0}
                        onChange={(e) => setParams((p) => ({ ...p, estimatedSaleProceeds: Number(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
                <Button onClick={() => setStep(4)}>Review</Button>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review */}
          {step === 4 && draftScenario && (
            <Card>
              <CardHeader><CardTitle className="text-base">Review & Save</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> {draftScenario.name}</div>
                  <div><span className="text-muted-foreground">Type:</span> <Badge variant="secondary">{draftScenario.type}</Badge></div>
                  <div><span className="text-muted-foreground">Sites:</span> {selectedSites.map((id) => sites.find((s) => s.id === id)?.name).join(", ")}</div>
                </div>
                {impact && impact.bottlenecks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Bottleneck Alerts:</p>
                    {impact.bottlenecks.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 rounded border p-2 text-xs">
                        <Badge variant={b.severity === "Critical" ? "destructive" : "secondary"}>{b.severity}</Badge>
                        <div>
                          <p className="font-medium">{b.title}</p>
                          <p className="text-muted-foreground">{b.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Scenario</Button>
                  <Button variant="outline" onClick={() => setStep(1)}>Start Over</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Impact Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Impact Preview</CardTitle></CardHeader>
            <CardContent>
              {impact ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <KPICard title="NPV" value={`$${impact.npv}M`} className="border-0 p-0 shadow-none" />
                    <KPICard title="Payback" value={`${impact.paybackYears}yr`} className="border-0 p-0 shadow-none" />
                    <KPICard title="IRR" value={`${impact.irr}%`} className="border-0 p-0 shadow-none" />
                    <KPICard title="FTE Impact" value={impact.summaryDeltas.headcountDelta} className="border-0 p-0 shadow-none" />
                  </div>
                  <SimpleAreaChart
                    data={impact.yearlyImpacts.map((y) => ({
                      year: `Y${y.year}`,
                      value: y.cumulativeNetCashFlow,
                    }))}
                    xKey="year"
                    yKey="value"
                    height={200}
                    showZeroLine
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a scenario type and site to see impact preview.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
