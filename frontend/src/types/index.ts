// ============== PRODUCTS =================

export type ProductCategory =
| 'camisetas-rugby'
| 'camisetas-hockey'
| 'shorts-rugby'
| 'polleras-hockey'
| 'medias-rugby'
| 'medias-hockey'
| 'pantalones'
| 'shorts'
| 'buzos'
| 'gorras'
| 'camperas'
| 'camperon'
| 'bolsos'
| 'gorros'
| 'otros';

export interface VariantSize {
  size: string;
  quantity: number;
}

export interface ProductVariant {
  color: string;
  sizes: VariantSize[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  baseColor?: string;
  variants: ProductVariant[];
  tags: string[];
  price: number;
  discountPrice?: number;
  images: string[];
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
  customer: CustomerInfo;
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

export interface ApiSuccess {
  message: string;
  [key: string]: any;
}

// ======== CART Types (Solo frontend) ==========
export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}
