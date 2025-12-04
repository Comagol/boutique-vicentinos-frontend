import {
  Box,
  Text,
  Badge,
  HStack,
  IconButton,
  VStack
} from "@chakra-ui/react";
import { ordersService } from "../../../services/ordersService";
import { createToaster } from "@chakra-ui/react";
import type { Order, OrderStatus } from "../../../types";
import {
  FiTruck,
  FiEye,
  FiDollarSign,
  FiXCircle,
} from "react-icons/fi";

const toast = createToaster({ placement: "top-end" });

interface OrderTableProps {
  orders: Order[];
  onRefresh: () => void;
}

// Función helper para obtener el color del badge según el estado
const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "pending-payment":
      return "yellow";
    case "payment-confirmed":
      return "blue";
    case "delivered":
      return "green";
    case "manually-canceled":
    case "cancelled-by-time":
      return "red";
    default:
      return "gray";
  }
};

// Función helper para traducir el estado al español
const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case "pending-payment":
      return "Pendiente de pago";
    case "payment-confirmed":
      return "Pago confirmado";
    case "delivered":
      return "Entregado";
    case "manually-canceled":
      return "Cancelado manualmente";
    case "cancelled-by-time":
      return "Cancelado por tiempo";
    default:
      return status;
  }
};

// Función helper para formatear fecha
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function OrderTable({ orders, onRefresh }: OrderTableProps) {
  const handleConfirmCashPayment = async (order: Order) => {
    if (
      !confirm(
        `¿Confirmar el pago en efectivo para el pedido #${order.orderNumber}?`
      )
    ) {
      return;
    }

    try {
      // Para pagos en efectivo, no necesitamos paymentId
      // El backend debería aceptar esto, si no, ajustaremos después
      await ordersService.confirmPayment(order.id, "");
      
      toast.create({
        title: "Pago confirmado",
        description: `El pago del pedido #${order.orderNumber} ha sido confirmado`,
        type: "success",
        duration: 2000,
      });
      onRefresh();
    } catch (error) {
      toast.create({
        title: "Error al confirmar pago",
        description: "No se pudo confirmar el pago. Intenta nuevamente.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleMarkAsDelivered = async (order: Order) => {
    if (
      !confirm(
        `¿Marcar el pedido #${order.orderNumber} como entregado?`
      )
    ) {
      return;
    }

    try {
      await ordersService.markAsDelivered(order.id);
      toast.create({
        title: "Pedido marcado como entregado",
        description: `El pedido #${order.orderNumber} ha sido marcado como entregado`,
        type: "success",
        duration: 2000,
      });
      onRefresh();
    } catch (error) {
      toast.create({
        title: "Error",
        description: "No se pudo marcar como entregado. Intenta nuevamente.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleCancelOrder = async (order: Order) => {
    if (
      !confirm(
        `¿Estás seguro de cancelar el pedido #${order.orderNumber}? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      await ordersService.cancelOrder(order.id);
      toast.create({
        title: "Pedido cancelado",
        description: `El pedido #${order.orderNumber} ha sido cancelado`,
        type: "success",
        duration: 2000,
      });
      onRefresh();
    } catch (error) {
      toast.create({
        title: "Error al cancelar",
        description: "No se pudo cancelar el pedido. Intenta nuevamente.",
        type: "error",
        duration: 3000,
      });
    }
  };

  if (orders.length === 0) {
    return (
      <Box bg="white" borderRadius="md" p={8} textAlign="center">
        <Text color="text.muted">No hay pedidos disponibles</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="md" overflow="hidden" shadow="sm">
      <Box overflowX="auto">
        <Box as="table" width="100%" borderCollapse="collapse">
          <Box as="thead" bg="gray.50">
            <Box as="tr">
              <Box
                as="th"
                px={4}
                py={3}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                color="text.primary"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Número
              </Box>
              <Box
                as="th"
                px={4}
                py={3}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                color="text.primary"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Cliente
              </Box>
              <Box
                as="th"
                px={4}
                py={3}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                color="text.primary"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Items
              </Box>
              <Box
                as="th"
                px={4}
                py={3}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                color="text.primary"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Total
              </Box>
              <Box
                as="th"
                px={4}
                py={3}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                color="text.primary"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Método de Pago
              </Box>
              <Box
                as="th"
                px={4}
                py={3}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                color="text.primary"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Estado
              </Box>
              <Box
                as="th"
                px={4}
                py={3}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                color="text.primary"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Fecha
              </Box>
              <Box
                as="th"
                px={4}
                py={3}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                color="text.primary"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                Acciones
              </Box>
            </Box>
          </Box>
          <Box as="tbody">
            {orders.map((order) => {
              // Validaciones defensivas para evitar errores
              const customerInfo = order.customerInfo || {
                name: "N/A",
                email: "N/A",
                phone: "N/A",
              };
              const itemsArray = Array.isArray(order.items) ? order.items : [];
              const orderNumber = order.orderNumber || "N/A";
              const total = typeof order.total === "number" ? order.total : 0;
              const paymentMethod = order.paymentMethod || "N/A";
              const status = order.status || "pending-payment";
              const createdAt = order.createdAt || new Date().toISOString();

              return (
                <Box
                  as="tr"
                  key={order.id}
                  _hover={{ bg: "gray.50" }}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                >
                  <Box as="td" px={4} py={3}>
                    <Text fontWeight="semibold" color="brand.700">
                      #{orderNumber}
                    </Text>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="semibold">{customerInfo.name}</Text>
                      <Text fontSize="xs" color="text.muted">
                        {customerInfo.email}
                      </Text>
                      <Text fontSize="xs" color="text.muted">
                        {customerInfo.phone}
                      </Text>
                    </VStack>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <Text fontSize="sm">
                      {itemsArray.length} producto{itemsArray.length !== 1 ? "s" : ""}
                    </Text>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <Text fontWeight="semibold">
                      ${total.toLocaleString("es-AR")}
                    </Text>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <Text fontSize="sm" color="text.secondary">
                      {paymentMethod === "cash" ? "Efectivo" : "Mercado Pago"}
                    </Text>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <Badge
                      colorPalette={getStatusColor(status)}
                      borderRadius="md"
                    >
                      {getStatusLabel(status)}
                    </Badge>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <Text fontSize="sm" color="text.muted">
                      {formatDate(createdAt)}
                    </Text>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <HStack gap={2}>
                      {/* Ver detalles (pendiente) */}
                      <IconButton
                        aria-label="Ver detalles"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // TODO: Abrir modal de detalles
                        }}
                      >
                        <FiEye />
                      </IconButton>

                      {/* Confirmar pago en efectivo (solo si está pendiente y es efectivo) */}
                      {status === "pending-payment" &&
                        paymentMethod === "cash" && (
                          <IconButton
                            aria-label="Confirmar pago"
                            size="sm"
                            variant="ghost"
                            color="green.500"
                            onClick={() => handleConfirmCashPayment(order)}
                          >
                            <FiDollarSign />
                          </IconButton>
                        )}

                      {/* Marcar como entregado (solo si el pago está confirmado) */}
                      {status === "payment-confirmed" && (
                        <IconButton
                          aria-label="Marcar como entregado"
                          size="sm"
                          variant="ghost"
                          color="blue.500"
                          onClick={() => handleMarkAsDelivered(order)}
                        >
                          <FiTruck />
                        </IconButton>
                      )}

                      {/* Cancelar (solo si no está cancelado ni entregado) */}
                      {status !== "delivered" &&
                        status !== "manually-canceled" &&
                        status !== "cancelled-by-time" && (
                          <IconButton
                            aria-label="Cancelar pedido"
                            size="sm"
                            variant="ghost"
                            color="red.500"
                            onClick={() => handleCancelOrder(order)}
                          >
                            <FiXCircle />
                          </IconButton>
                        )}
                    </HStack>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}