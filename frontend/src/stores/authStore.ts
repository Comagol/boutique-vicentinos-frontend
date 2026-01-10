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
  adminLogin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
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
        
        // El backend puede devolver 'user' o 'customer'
        const userData = (response as any).user || (response as any).customer || null;
        const adminData = response.admin || null;
        
        // Mapear 'customer' a 'user' para el tipo UserRole
        let role: UserRole = "user";
        if (response.role === "admin") {
          role = "admin";
        } else if ((response as any).role === "customer") {
          role = "user";
        }
        
        set({
          admin: adminData,
          user: userData,
          role: role,
          token: response.token,
          isAuthenticated: true,
        });
      },
      
      adminLogin: async (email: string, password: string) => {
        const response = await authService.adminLogin({ email, password });
        
        // El backend puede devolver 'user' o 'customer' (aunque para admin debería ser null)
        const userData = (response as any).user || (response as any).customer || null;
        const adminData = response.admin || null;
        
        // Para admin, el rol siempre será "admin"
        let role: UserRole = "admin";
        if (response.role === "admin") {
          role = "admin";
        }
        
        set({
          admin: adminData,
          user: userData,
          role: role,
          token: response.token,
          isAuthenticated: true,
        });
      },

      signup: async (name: string, email: string, password: string) => {
        const response = await authService.signup({ name, email, password });
        
        // El backend puede devolver 'user' o 'customer'
        const userData = (response as any).user || (response as any).customer || null;
        const adminData = response.admin || null;
        
        // Mapear 'customer' a 'user' para el tipo UserRole
        let role: UserRole = "user";
        if (response.role === "admin") {
          role = "admin";
        } else if ((response as any).role === "customer") {
          role = "user";
        }
        
        set({
          admin: adminData,
          user: userData,
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