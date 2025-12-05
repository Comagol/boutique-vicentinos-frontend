import type { ApiError, ApiSuccess } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3030/api";

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
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Intentar parsear la respuesta
    let data;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        throw {
          error: `HTTP ${response.status}`,
          message: `Error al parsear respuesta del servidor: ${text.substring(0, 200)}`,
        } as ApiError;
      }
    } else {
      // Si no es JSON, leer como texto
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      // Manejar errores de la API
      const error: ApiError = {
        error: data.error || `HTTP ${response.status}`,
        message: data.message || data.error || `Error ${response.status}: ${response.statusText}`,
      };
      throw error;
    }

    return data;
  } catch (error) {
    // Si ya es un ApiError, re-lanzarlo
    if (error && typeof error === "object" && "error" in error && "message" in error) {
      throw error;
    }
    
    // Manejar errores de red u otros
    if (error instanceof TypeError) {
      throw {
        error: "NetworkError",
        message: `No se pudo conectar al servidor en ${API_BASE_URL}. Verifica que el backend esté corriendo.`,
      } as ApiError;
    }
    
    // Error desconocido
    throw {
      error: "UnknownError",
      message: error instanceof Error ? error.message : "Ha ocurrido un error desconocido",
    } as ApiError;
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