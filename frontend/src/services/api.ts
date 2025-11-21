import { productsService } from "./productService";
import type { Product } from "../types";

/**
 * Obtener todos los productos activos (público)
 * Usa GET /api/products
 */
export async function getProducts(): Promise<Product[]> {
  return productsService.getProducts();
}

/**
 * Obtener un producto por ID (público)
 * Usa GET /api/products/:id
 */
export async function getProductById(id: string): Promise<Product> {
  return productsService.getProductById(id);
}