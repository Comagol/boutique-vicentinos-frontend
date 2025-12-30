import {
  Box,
  Text,
  Badge,
  HStack,
  VStack,
  Button,
  Icon,
} from "@chakra-ui/react";
import { ordersService } from "../../../services/ordersService";
import { toaster } from "../../../app/AppProvider";
import type { Order, OrderStatus } from "../../../types";
import {
  FiTruck,
  FiEye,
  FiDollarSign,
  FiXCircle,
} from "react-icons/fi";

interface OrderCardProps {
  order: Order;
  onRefresh: () => void;
  onViewDetails: (order: Order) => void;
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

export function OrderCard({ order, onRefresh, onViewDetails }: OrderCardProps) {
  const customerInfo = order.customer || {
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

  const handleConfirmCashPayment = async (order: Order) => {
    if (
      !confirm(
        `¿Confirmar el pago en efectivo para el pedido #${order.orderNumber}?\n\nEl estado cambiará a "Pago confirmado" y podrás marcarlo como entregado después.`
      )
    ) {
      return;
    }

    try {
      try {
        await ordersService.confirmCashPayment(order.id);
      } catch (cashError) {
        await ordersService.confirmPayment(order.id, "cash_payment");
      }
      
      toaster.create({
        title: "Pago confirmado",
        description: `El pago del pedido #${order.orderNumber} ha sido confirmado. El estado ahora es "Pago confirmado".`,
        type: "success",
        duration: 3000,
      });
      
      onRefresh();
    } catch (error) {
      const errorMessage = (error as any)?.message || "Error desconocido";
      toaster.create({
        title: "Error al confirmar pago",
        description: `No se pudo confirmar el pago: ${errorMessage}`,
        type: "error",
        duration: 4000,
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
      toaster.create({
        title: "Pedido marcado como entregado",
        description: `El pedido #${order.orderNumber} ha sido marcado como entregado`,
        type: "success",
        duration: 2000,
      });
      onRefresh();
    } catch (error) {
      toaster.create({
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
      toaster.create({
        title: "Pedido cancelado",
        description: `El pedido #${order.orderNumber} ha sido cancelado`,
        type: "success",
        duration: 2000,
      });
      onRefresh();
    } catch (error) {
      toaster.create({
        title: "Error al cancelar",
        description: "No se pudo cancelar el pedido. Intenta nuevamente.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="md"
      p={4}
      shadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack align="stretch" gap={3}>
        {/* Header con número de pedido y estado */}
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1}>
            <Text fontWeight="bold" fontSize="lg" color="brand.700">
              Pedido #{orderNumber}
            </Text>
            <Text fontSize="xs" color="text.muted">
              {formatDate(createdAt)}
            </Text>
          </VStack>
          <Badge
            colorPalette={getStatusColor(status)}
            borderRadius="md"
            fontSize="sm"
            px={2}
            py={1}
          >
            {getStatusLabel(status)}
          </Badge>
        </HStack>

        {/* Información del cliente */}
        <Box borderTop="1px solid" borderColor="gray.200" pt={3}>
          <VStack align="start" gap={1}>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
              {customerInfo.name}
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted" wordBreak="break-word">
              {customerInfo.email}
            </Text>
            {customerInfo.phone && (
              <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
                {customerInfo.phone}
              </Text>
            )}
          </VStack>
        </Box>

        {/* Resumen del pedido */}
        <HStack justify="space-between" flexWrap="wrap" gap={{ base: 2, md: 4 }}>
          <VStack align="start" gap={0}>
            <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
              Productos
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
              {itemsArray.length} producto{itemsArray.length !== 1 ? "s" : ""}
            </Text>
          </VStack>
          <VStack align="start" gap={0}>
            <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
              Total
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="brand.700">
              ${total.toLocaleString("es-AR")}
            </Text>
          </VStack>
          <VStack align="start" gap={0}>
            <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
              Método
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }}>
              {paymentMethod === "cash" ? "Efectivo" : "Mercado Pago"}
            </Text>
          </VStack>
        </HStack>

        {/* Acciones */}
        <HStack gap={2} flexWrap="wrap" pt={2} borderTop="1px solid" borderColor="gray.200">
          <Button
            size={{ base: "sm", md: "md" }}
            variant="outline"
            onClick={() => onViewDetails(order)}
            flex={{ base: "1", md: "none" }}
            minW={{ base: "120px", md: "auto" }}
          >
            <Icon as={FiEye} mr={2} />
            Ver Detalles
          </Button>

          {status === "pending-payment" && paymentMethod === "cash" && (
            <Button
              size={{ base: "sm", md: "md" }}
              variant="outline"
              color="green.500"
              onClick={() => handleConfirmCashPayment(order)}
              flex={{ base: "1", md: "none" }}
              minW={{ base: "120px", md: "auto" }}
            >
              <Icon as={FiDollarSign} mr={2} />
              Confirmar Pago
            </Button>
          )}

          {status === "payment-confirmed" && (
            <Button
              size={{ base: "sm", md: "md" }}
              variant="outline"
              color="blue.500"
              onClick={() => handleMarkAsDelivered(order)}
              flex={{ base: "1", md: "none" }}
              minW={{ base: "120px", md: "auto" }}
            >
              <Icon as={FiTruck} mr={2} />
              Marcar Entregado
            </Button>
          )}

          {status !== "delivered" &&
            status !== "manually-canceled" &&
            status !== "cancelled-by-time" && (
              <Button
                size={{ base: "sm", md: "md" }}
                variant="outline"
                color="red.500"
                onClick={() => handleCancelOrder(order)}
                flex={{ base: "1", md: "none" }}
                minW={{ base: "120px", md: "auto" }}
              >
                <Icon as={FiXCircle} mr={2} />
                Cancelar
              </Button>
            )}
        </HStack>
      </VStack>
    </Box>
  );
}

