import type { ApiError, ApiSuccess } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

//FUNCION HELPER PARA OBTENER EL TOKEN DEL LOCALSTORAGE
const getAuthToken = (): string | null => { 
  return localStorage.getItem("auth_token");
};

//FUNCION HELPER PARA GUARDAR EL TOKEN
export const saveAuthToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

//FUNCION HELPER PARA ELIMINAR EL TOKEN
export const removeAuthToken = (): void => {
  localStorage.removeItem("auth_token");
};

// Función base para hacer requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiSuccess<T>> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Si hay token, agregarlo al header
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Si hay FormData, remover Content-Type para que el navegador lo maneje
  if (options.body instanceof FormData) {
    delete (headers as any)["Content-Type"];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Manejar errores de la API
      const error: ApiError = {
        error: data.error || "Error desconocido",
        message: data.message || "Ha ocurrido un error",
      };
      throw error;
    }

    return data;
  } catch (error) {
    // Manejar errores de red u otros
    if (error instanceof TypeError) {
      throw {
        error: "NetworkError",
        message: "Error de conexión con el servidor",
      } as ApiError;
    }
    throw error;
  }
}

// Métodos HTTP helper
export const apiClient = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "GET" }),
  
  post: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  put: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};