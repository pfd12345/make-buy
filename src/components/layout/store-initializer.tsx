"use client";

import { useEffect } from "react";
import { useBaselineStore } from "@/stores/baseline-store";

export function StoreInitializer() {
  const isInitialized = useBaselineStore((s) => s.isInitialized);
  const loadSeedData = useBaselineStore((s) => s.loadSeedData);

  useEffect(() => {
    if (!isInitialized) {
      loadSeedData();
    }
  }, [isInitialized, loadSeedData]);

  return null;
}
