import { create } from "zustand";
import { authService } from "@/services/auth.service";

interface User {
  id: string | number;
  email: string;
  username: string;
  full_name?: string;
  role: string;
  created_at?: string;
  organization?: any;
}

interface AuthState {
  user: User | null;
  currentOrg: any | null;
  isAuthenticated: boolean;
  setUser: (
    user: User | null
  ) => void;
  updateUser: (
    updates: Partial<User>
  ) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore =
  create<AuthState>(
    (set) => ({

      user: null,
      currentOrg: null,

      isAuthenticated:
        false,

      setUser: (user) =>
        set({
          user,
          currentOrg: user?.organization || null,
          isAuthenticated:
            !!user,
        }),

      updateUser: (updates) =>
        set((state) => {
          if (!state.user) return {};
          const updatedUser = { ...state.user, ...updates };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          return {
            user: updatedUser,
            currentOrg: updatedUser.organization || null,
          };
        }),

      logout: () => {
        authService.logout();
        set({
          user: null,
          currentOrg: null,
          isAuthenticated:
            false,
        });
      },

      initAuth: () => {
        const token =
          localStorage.getItem(
            "access_token"
          );
        const storedUser =
          authService
            .getStoredUser();
        if (
          token &&
          storedUser
        ) {
          set({
            user:
              storedUser,
            currentOrg:
              storedUser.organization || null,
            isAuthenticated:
              true,
          });
        }
      },
    })
);