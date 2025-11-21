import { apiClient } from "./apiClient";
import type { Product, ProductCategory, ProductSize, StockInfo } from "../types";

interface CreateProductInput {
  name: string;
  description: string;
  category: ProductCategory;
  baseColor?: string;
  tags: string[];
  price: number;
  discountPrice?: number;
  images: File[];
  sizes: ProductSize[];
  colors: string[];
  stock: StockInfo[];
}

interface ProductsResponse {
  message: string;
  products: Product[];
  count: number;
}

interface ProductResponse {
  message: string;
  product: Product;
}

export const productsService = {
  // GET /api/products (público - solo activos)
  getProducts: async (category?: ProductCategory): Promise<Product[]> => {
    const endpoint = category ? `/products?category=${category}` : "/products";
    const response = await apiClient.get<ProductsResponse>(endpoint);
    return response.products || [];
  },

  // GET /api/products/:id (público)
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ProductResponse>(`/products/${id}`);
    return response.product;
  },

  // GET /api/products/admin/all (admin - incluye desactivados)
  getAllProducts: async (category?: ProductCategory): Promise<Product[]> => {
    const endpoint = category
      ? `/products/admin/all?category=${category}`
      : "/products/admin/all";
    const response = await apiClient.get<ProductsResponse>(endpoint);
    return response.products || [];
  },

  // POST /api/products (admin - crear producto)
  createProduct: async (productData: CreateProductInput, images?: File[]): Promise<Product> => {
    const formData = new FormData();

    // Agregar campos del producto al FormData
    Object.entries(productData).forEach(([key, value]) => {
      if (key === "images") return; // Las imágenes se manejan aparte
      
      if (Array.isArray(value)) {
        // Para arrays, enviarlos como JSON string
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    // Agregar imágenes
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await apiClient.post<ProductResponse>("/products", formData);
    return response.product;
  },

  // PUT /api/products/:id (admin - actualizar producto)
  updateProduct: async (
    id: string,
    productData: Partial<CreateProductInput>,
    images?: File[]
  ): Promise<Product> => {
    const formData = new FormData();

    // Agregar campos actualizados
    Object.entries(productData).forEach(([key, value]) => {
      if (key === "images") return;
      
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Agregar nuevas imágenes si hay
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await apiClient.put<ProductResponse>(`/products/${id}`, formData);
    return response.product;
  },

  // DELETE /api/products/:id (admin - eliminar permanentemente)
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete<{ message: string }>(`/products/${id}`);
  },

  // POST /api/products/:id/activate (admin)
  activateProduct: async (id: string): Promise<void> => {
    await apiClient.post<{ message: string }>(`/products/${id}/activate`);
  },

  // POST /api/products/:id/deactivate (admin - soft delete)
  deactivateProduct: async (id: string): Promise<void> => {
    await apiClient.post<{ message: string }>(`/products/${id}/deactivate`);
  },
};