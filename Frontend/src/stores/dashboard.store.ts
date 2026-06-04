import { create } from "zustand";
import { Dashboard, DashboardStats } from "@/types";

interface DashboardState {
  dashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;

  setDashboards: (dashboards: Dashboard[]) => void;
  setCurrentDashboard: (dashboard: Dashboard | null) => void;
  setStats: (stats: DashboardStats) => void;
  addDashboard: (dashboard: Dashboard) => void;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => void;
  removeDashboard: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboards: [],
  currentDashboard: null,
  stats: null,
  isLoading: false,
  error: null,

  setDashboards: (dashboards) => set({ dashboards }),
  setCurrentDashboard: (currentDashboard) => set({ currentDashboard }),
  setStats: (stats) => set({ stats }),

  addDashboard: (dashboard) =>
    set((state) => ({ dashboards: [dashboard, ...state.dashboards] })),

  updateDashboard: (id, updates) =>
    set((state) => ({
      dashboards: state.dashboards.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
      currentDashboard:
        state.currentDashboard?.id === id
          ? { ...state.currentDashboard, ...updates }
          : state.currentDashboard,
    })),

  removeDashboard: (id) =>
    set((state) => ({
      dashboards: state.dashboards.filter((d) => d.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
