import { create } from "zustand";

type OrderStatus = "pending" | "paid" | "delivered" | "cancelled";

type AdminOrdersState = {
  filters: { status?: OrderStatus };
  setFilter: (filters: AdminOrdersState["filters"]) => void;
};

export const useAdminOrdersStore = create<AdminOrdersState>((set) => ({
  filters: {},
  setFilter: (filters) => set({ filters }),
}));

