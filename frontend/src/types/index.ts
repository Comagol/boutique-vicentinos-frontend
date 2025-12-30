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
  colors: string[];
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
| "delivered";

export type PaymentStatus = 
| "pending"
| "approved"
| "rejected"
| "cancelled";

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
  customer: CustomerInfo; // Nota: backend usa "customer" no "customerInfo"
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  paymentMethod: string;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
  paymentStatusDetail?: string;
  paymentDate?: string;
  preferenceId?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

// Respuesta del endpoint de estado de pago
export interface PaymentStatusResponse {
  orderId: string;
  orderStatus: OrderStatus;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
  paymentStatusDetail?: string;
  transactionAmount?: number;
  dateCreated?: string;
  dateApproved?: string;
}

// ========== User types ===========
export type UserRole = "admin" | "user";
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

export interface RegularUser {
  id: string;
  email: string;
  name: string;
  role: "user";
  createdAt: string;
  updatedAt: string;
}

// ========= Common response Types =====
export interface ApiError {
  error: string;
  message: string;
}

export interface ApiSuccess<T> {
  message: string;
  [key: string]: any;
}

// ======== CART Types (Solo frontend) ==========
// elcarrito no se envia asi al backend se transforma a OrderItem[]
export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}