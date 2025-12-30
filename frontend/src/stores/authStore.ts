import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser, RegularUser, UserRole } from "../types";
import { authService } from "../services/authService";

interface AuthState {
  admin: AdminUser | null;
  user: RegularUser | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        const role = response.role || (response.admin ? "admin" : "user");
        
        set({
          admin: response.admin || null,
          user: response.user || null,
          role: role,
          token: response.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        authService.logout();
        set({
          admin: null,
          user: null,
          role: null,
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

      isAdmin: () => {
        return get().role === "admin";
      },

      isUser: () => {
        return get().role === "user";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        admin: state.admin,
        user: state.user,
      }),
    }
  ),
)