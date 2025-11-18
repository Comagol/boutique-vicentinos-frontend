import type { Product } from "../types";

// URL base del backend (cuando lo tengas)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Función para obtener productos
export async function getProducts(): Promise<Product[]> {
  // Por ahora retornamos datos mock
  // TODO: Reemplazar con llamada real al backend
  return mockProducts;
}

// Datos mock temporales (los reemplazarás cuando tengas el backend)
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Camiseta Rugby Home",
    description: "Camiseta oficial del club",
    category: "camisetas-rugby",
    baseColor: "Azul",
    tags: ["rugby", "home"],
    price: 15000,
    discountPrice: 12000,
    images: ["https://via.placeholder.com/400"],
    sizes: [
      { size: "S", type: "adulto" },
      { size: "M", type: "adulto" },
      { size: "L", type: "adulto" },
    ],
    colors: ["Azul", "Blanco"],
    stock: [
      { size: "S", color: "Azul", quantity: 10 },
      { size: "M", color: "Azul", quantity: 15 },
      { size: "L", color: "Azul", quantity: 8 },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Shorts Hockey",
    description: "Shorts oficiales de hockey",
    category: "shorts-rugby",
    baseColor: "Negro",
    tags: ["hockey"],
    price: 8000,
    images: ["https://via.placeholder.com/400"],
    sizes: [
      { size: "S", type: "adulto" },
      { size: "M", type: "adulto" },
    ],
    colors: ["Negro"],
    stock: [
      { size: "S", color: "Negro", quantity: 5 },
      { size: "M", color: "Negro", quantity: 12 },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];