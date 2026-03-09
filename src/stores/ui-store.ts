"use client";

import { create } from "zustand";

interface UIState {
  sidebarCollapsed: boolean;
  csvUploadOpen: boolean;
  toggleSidebar: () => void;
  setCsvUploadOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  csvUploadOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCsvUploadOpen: (open: boolean) => set({ csvUploadOpen: open }),
}));
