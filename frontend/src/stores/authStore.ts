import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "../types";
import { authService } from "../services/authService";

interface AuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        set({
          admin: response.admin,
          token: response.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        authService.logout();
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
        });
      },

      initialize: () => {
        const token = localStorage.getItem("auth_token");
        if (token && authService.isAuthenticated()) {
          set({
            token: token,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  ),
)