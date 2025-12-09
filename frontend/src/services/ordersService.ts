import { apiClient } from "./apiClient";
import type {
  Order,
  OrderItem,
  CustomerInfo,
  OrderStatus,
  CartItem,
  PaymentStatusResponse,
} from "../types";

interface OrdersResponse {
  message: string;
  orders: Order[];
  count: number;
}

interface OrderResponse {
  message: string;
  order: Order;
  paymentUrl?: string; // Para Mercado Pago
}

interface CreateOrderRequest {
  customer: CustomerInfo;
  items: OrderItem[];
  paymentMethod: string;
}

// Función helper para transformar CartItem[] a OrderItem[]
export const transformCartItemsToOrderItems = (
  cartItems: CartItem[]
): OrderItem[] => {
  return cartItems.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    price: item.product.discountPrice || item.product.price,
    reservedStock: false, // El backend lo manejará
  }));
};

export const ordersService = {
  // POST /api/orders (público - crear pedido)
  createOrder: async (
    customer: CustomerInfo,
    cartItems: CartItem[],
    paymentMethod: string
  ): Promise<OrderResponse> => {
    const items = transformCartItemsToOrderItems(cartItems);

    const request: CreateOrderRequest = {
      customer,
      items,
      paymentMethod,
    };

    return apiClient.post<OrderResponse>("/orders", request) as Promise<OrderResponse>;
  },

  // GET /api/orders/number/:orderNumber (público)
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await apiClient.get<OrderResponse>(
      `/orders/number/${orderNumber}`
    );
    return response.order;
  },

  // GET /api/orders/:orderId/payment-status (público)
  getPaymentStatus: async (orderId: string): Promise<PaymentStatusResponse> => {
    const response = await apiClient.get<PaymentStatusResponse>(
      `/orders/${orderId}/payment-status`
    );
    // The API returns PaymentStatusResponse directly (with message property)
    // We return it as PaymentStatusResponse since it contains all required fields
    return response as unknown as PaymentStatusResponse;
  },

  // POST /api/orders/cancel (público)
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.post<OrderResponse>("/orders/cancel", {
      orderId,
    });
    return response.order;
  },

  // POST /api/orders/confirm-payment (público)
  confirmPayment: async (
    orderId: string,
    paymentId: string
  ): Promise<Order> => {
    const response = await apiClient.post<OrderResponse>(
      "/orders/confirm-payment",
      {
        orderId,
        paymentId,
      }
    );
    return response.order;
  },

  // GET /api/orders (admin - todas las órdenes)
  getOrders: async (params?: {
    status?: OrderStatus;
    customerEmail?: string;
  }): Promise<Order[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.customerEmail)
      queryParams.append("customerEmail", params.customerEmail);

    const endpoint = queryParams.toString()
      ? `/orders?${queryParams.toString()}`
      : "/orders";

    const response = await apiClient.get<OrdersResponse>(endpoint);
    return response.orders || [];
  },

  // GET /api/orders/:id (admin)
  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<OrderResponse>(`/orders/${id}`);
    return response.order;
  },

  // POST /api/orders/confirm-cash-payment (admin - confirmar pago en efectivo)
  confirmCashPayment: async (orderId: string): Promise<Order> => {
    const response = await apiClient.post<OrderResponse>(
      "/orders/confirm-cash-payment",
      {
        orderId,
      }
    );
    return response.order;
  },

  // POST /api/orders/mark-delivered (admin)
  markAsDelivered: async (orderId: string): Promise<Order> => {
    const response = await apiClient.post<OrderResponse>(
      "/orders/mark-delivered",
      {
        orderId,
      }
    );
    return response.order;
  },

  // GET /api/orders/expiring-soon (admin)
  getExpiringSoon: async (hours?: number): Promise<Order[]> => {
    const endpoint = hours
      ? `/orders/expiring-soon?hours=${hours}`
      : "/orders/expiring-soon";
    const response = await apiClient.get<OrdersResponse>(endpoint);
    return response.orders || [];
  },
};