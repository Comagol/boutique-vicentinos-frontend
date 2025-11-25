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

