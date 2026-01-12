import { create } from "zustand";
import type { CartItem, Product } from "../types";

type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (product: Product, size: string, color: string, quantity?: number) => boolean;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => boolean;
  clear: () => void;
};

// ================= SELECTORES (Estado Derivado) =================
// Estos selectores son puros y optimizados para usarse en componentes

/**
 * Calcula el total de dinero en el carrito
 */
export const selectCartTotal = (state: CartState) =>
  state.items.reduce((total, item) => {
    const price = item.product.discountPrice || item.product.price;
    return total + price * item.quantity;
  }, 0);

/**
 * Cuenta la cantidad total de prendas (sumando unidades)
 */
export const selectCartCount = (state: CartState) =>
  state.items.reduce((count, item) => count + item.quantity, 0);

/**
 * Obtiene el stock disponible para una variante específica de un producto
 */
export const getAvailableStock = (product: Product, size: string, color?: string) => {
  const stockItem = product.stock.find(
    (s) => 
      s.size === size && 
      (color ? s.color === color : true)
  );
  return stockItem?.quantity || 0;
};

// ================= STORE =================

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isDrawerOpen: false,
  setDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),

  // Agregar item al carrito con validación de stock
  addItem: (product: Product, size: string, color: string, quantity: number = 1) => {
    const { items } = get();
    
    // 1. Buscar si ya existe en el carrito
    const existingIndex = items.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.size === size &&
        item.color === color
    );

    const currentQtyInCart = existingIndex !== -1 ? items[existingIndex].quantity : 0;
    const newTotalQty = currentQtyInCart + quantity;

    // 2. Validar contra el stock real del producto
    const stockDisponible = getAvailableStock(product, size, color);

    if (newTotalQty > stockDisponible) {
      return false; // No hay stock suficiente
    }

    // 3. Actualizar estado
    let newItems;
    if (existingIndex !== -1) {
      newItems = [...items];
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newTotalQty,
      };
    } else {
      newItems = [...items, { product, size, color, quantity }];
    }

    set({ items: newItems, isDrawerOpen: true });
    return true;
  },

  // Remover item específico
  removeItem: (productId: string, size: string, color: string) =>
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size &&
            item.color === color
          )
      ),
    })),

  // Actualizar cantidad con validación de stock
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => {
    const { items } = get();
    
    if (quantity <= 0) {
      set({
        items: items.filter(
          (item) =>
            !(item.product.id === productId && item.size === size && item.color === color)
        ),
      });
      return true;
    }

    // 1. Encontrar el producto
    const itemIndex = items.findIndex(
      (item) => item.product.id === productId && item.size === size && item.color === color
    );

    if (itemIndex === -1) return false;

    // 2. Validar stock
    const product = items[itemIndex].product;
    const stockDisponible = getAvailableStock(product, size, color);

    if (quantity > stockDisponible) {
      return false; // No hay suficiente stock para subir
    }

    // 3. Actualizar
    const newItems = [...items];
    newItems[itemIndex] = { ...newItems[itemIndex], quantity };
    
    set({ items: newItems });
    return true;
  },

  // Limpiar carrito
  clear: () => set({ items: [] }),
}));
