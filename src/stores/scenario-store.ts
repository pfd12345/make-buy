"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import type { Scenario, ScenarioStatus } from "@/types";

interface ScenarioState {
  scenarios: Scenario[];
  activeScenarioId: string | null;

  addScenario: (scenario: Scenario) => void;
  updateScenario: (id: string, updates: Partial<Scenario>) => void;
  deleteScenario: (id: string) => void;
  setActiveScenario: (id: string | null) => void;
  updateScenarioStatus: (id: string, status: ScenarioStatus) => void;
  replaceAllScenarios: (scenarios: Scenario[]) => void;
  getScenarioById: (id: string) => Scenario | undefined;
  getActiveScenario: () => Scenario | undefined;
  getAllScenarios: () => Scenario[];
}

export const useScenarioStore = create<ScenarioState>()(
  persist(
    immer((set, get) => ({
      scenarios: [],
      activeScenarioId: null,

      addScenario: (scenario: Scenario) => {
        set((state) => {
          state.scenarios.push(scenario);
          state.activeScenarioId = scenario.id;
        });
      },

      updateScenario: (id: string, updates: Partial<Scenario>) => {
        set((state) => {
          const idx = state.scenarios.findIndex((s) => s.id === id);
          if (idx !== -1) {
            state.scenarios[idx] = { ...state.scenarios[idx], ...updates };
          }
        });
      },

      deleteScenario: (id: string) => {
        set((state) => {
          state.scenarios = state.scenarios.filter((s) => s.id !== id);
          if (state.activeScenarioId === id) {
            state.activeScenarioId = null;
          }
        });
      },

      setActiveScenario: (id: string | null) => {
        set((state) => {
          state.activeScenarioId = id;
        });
      },

      updateScenarioStatus: (id: string, status: ScenarioStatus) => {
        set((state) => {
          const scenario = state.scenarios.find((s) => s.id === id);
          if (scenario) scenario.status = status;
        });
      },

      replaceAllScenarios: (scenarios: Scenario[]) => {
        set((state) => {
          state.scenarios = scenarios;
          state.activeScenarioId = null;
        });
      },

      getScenarioById: (id: string) => get().scenarios.find((s) => s.id === id),
      getActiveScenario: () => {
        const { scenarios, activeScenarioId } = get();
        return activeScenarioId ? scenarios.find((s) => s.id === activeScenarioId) : undefined;
      },
      getAllScenarios: () => get().scenarios,
    })),
    {
      name: "netplan-scenarios",
      skipHydration: true,
    }
  )
);
