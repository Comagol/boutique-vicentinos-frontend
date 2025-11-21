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

