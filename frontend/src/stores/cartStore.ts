import { create } from "zustand";
import type { CartItem, Product } from "../types";

type CartState = {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clear: () => void;
  getTotal: () => number;
  getItemCount: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  // Agregar item al carrito
  addItem: (product: Product, size: string, color: string, quantity: number = 1) =>
    set((state: CartState) => {
      // Buscar si ya existe este item con misma talla y color
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color === color
      );

      if (existingIndex !== -1) {
        // Si existe, sumar la cantidad
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return { items: updatedItems };
      }

      // Si no existe, agregarlo
      return {
        items: [
          ...state.items,
          {
            product,
            size,
            color,
            quantity,
          },
        ],
      };
    }),

  // Remover item específico (por productId + size + color)
  removeItem: (productId: string, size: string, color: string) =>
    set((state: CartState) => ({
      items: state.items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size &&
            item.color === color
          )
      ),
    })),

  // Actualizar cantidad de un item específico
  updateQuantity: (productId: string, size: string, color: string, quantity: number) =>
    set((state: CartState) => {
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, eliminar el item
        return {
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.size === size &&
                item.color === color
              )
          ),
        };
      }

      // Actualizar la cantidad
      return {
        items: state.items.map((item) =>
          item.product.id === productId &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity }
            : item
        ),
      };
    }),

  // Limpiar todo el carrito
  clear: () => set({ items: [] }),

  // Calcular el total del carrito
  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  },

  // Contar total de items (sumando cantidades)
  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
}));