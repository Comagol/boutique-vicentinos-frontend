// ============== PRODUCTS =================

export type ProductCategory =
| "camisetas-rugby"
| "camisetas-hockey"
| "shorts-rugby"
| "polleras-hockey"
| "medias-hockey"
| "medias-rugby"
| "pantalones"
| "shorts"
| "buzos"
| "gorras"
| "camperas"
| "camperon"
| "bolsos"
| "gorros"
| "otros";

export type SizeType = "adulto" | "infantil";

export interface ProductSize {
  size: string;
  type: SizeType;
}

export interface StockInfo {
  size: string;
  color?: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  baseColor?: string;
  tags: string[];
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: ProductSize[];
  colorts: string[];
  stock: StockInfo[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// =========== ORDER TYPES ============
export type OrderStatus = 
| "pending-payment"
| "payment-confirmed"
| "manually-canceled"
| "cancelled-by-time"
| "delivered"

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  reservedStock: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  paymentMethod: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

// ========== admin types ===========
export type AdminRole = "admin";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  isActive: boolean;
}