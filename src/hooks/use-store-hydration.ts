"use client";

import { useEffect, useState } from "react";
import { useScenarioStore } from "@/stores/scenario-store";

export function useScenarioHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    useScenarioStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
