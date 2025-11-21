import { apiClient, saveAuthToken, removeAuthToken } from "./apiClient";
import type { AdminUser } from "../types";

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

interface AuthResponse {
  message: string;
  admin: AdminUser;
  token: string;
}

export const authService = {
  // POST /api/auth/login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    // Guardar token automáticamente
    if (response.token) {
      saveAuthToken(response.token);
    }
    return response as AuthResponse;
  },

  // POST /api/auth/signup
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/signup", data);
    if (response.token) {
      saveAuthToken(response.token);
    }
    return response as AuthResponse;
  },

  // PUT /api/auth/change-password
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>("/auth/change-password", data);
  },

  // Helper para cerrar sesión
  logout: (): void => {
    removeAuthToken();
  },

  // Helper para verificar si hay sesión activa
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("auth_token");
  },
};