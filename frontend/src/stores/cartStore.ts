import { create } from "zustand";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item: CartItem) =>
    set((state: CartState) => {
      const existing = state.items.find((i: CartItem) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i: CartItem) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (productId: string) =>
    set((state: CartState) => ({
      items: state.items.filter((i: CartItem) => i.productId !== productId),
    })),
  clear: () => set({ items: [] }),
}));

