import type { ApiError, ApiSuccess } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

//FUNCION HELPER PARA OBTENER EL TOKEN DEL LOCALSTORAGE
const getAuthToken = (): string | null => { 
  return localStorage.getItem("auth_token");
};