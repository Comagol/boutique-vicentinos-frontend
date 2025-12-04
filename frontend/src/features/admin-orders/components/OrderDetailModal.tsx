import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  IconButton,
  Separator,
  Flex,
} from "@chakra-ui/react";
import type { Order, OrderStatus } from "../../../types";
import { FiX } from "react-icons/fi";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
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

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  // Validaciones defensivas
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
  const expiresAt = order.expiresAt || new Date().toISOString();

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      onClick={onClose}
    >
      <Box
        bg="white"
        borderRadius="lg"
        maxW="800px"
        width="100%"
        maxH="90vh"
        overflowY="auto"
        shadow="xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          p={6}
          borderBottom="1px solid"
          borderColor="gray.200"
        >
          <VStack align="start" gap={1}>
            <Heading size="lg" color="text.primary">
              Pedido #{orderNumber}
            </Heading>
            <Badge
              colorPalette={getStatusColor(status)}
              borderRadius="md"
            >
              {getStatusLabel(status)}
            </Badge>
          </VStack>
          <IconButton
            aria-label="Cerrar"
            variant="ghost"
            onClick={onClose}
          >
            <FiX />
          </IconButton>
        </Flex>

        {/* Contenido */}
        <VStack gap={6} align="stretch" p={6}>
          {/* Información del Cliente */}
          <Box>
            <Heading size="md" color="text.primary" mb={4}>
              Información del Cliente
            </Heading>
            <VStack align="start" gap={2} bg="gray.50" p={4} borderRadius="md">
              <HStack gap={4}>
                <Text fontWeight="semibold" minW="80px">
                  Nombre:
                </Text>
                <Text>{customerInfo.name}</Text>
              </HStack>
              <HStack gap={4}>
                <Text fontWeight="semibold" minW="80px">
                  Email:
                </Text>
                <Text>{customerInfo.email}</Text>
              </HStack>
              <HStack gap={4}>
                <Text fontWeight="semibold" minW="80px">
                  Teléfono:
                </Text>
                <Text>{customerInfo.phone}</Text>
              </HStack>
            </VStack>
          </Box>

          <Separator />

          {/* Productos */}
          <Box>
            <Heading size="md" color="text.primary" mb={4}>
              Productos ({itemsArray.length})
            </Heading>
            <VStack gap={3} align="stretch">
              {itemsArray.map((item, index) => (
                <Box
                  key={index}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                >
                  <VStack align="start" gap={2}>
                    <Text fontWeight="semibold" fontSize="lg">
                      {item.productName || "Producto sin nombre"}
                    </Text>
                    <HStack gap={4} flexWrap="wrap">
                      <HStack gap={2}>
                        <Text fontSize="sm" color="text.muted">
                          Talla:
                        </Text>
                        <Text fontSize="sm" fontWeight="semibold">
                          {item.size || "N/A"}
                        </Text>
                      </HStack>
                      <HStack gap={2}>
                        <Text fontSize="sm" color="text.muted">
                          Color:
                        </Text>
                        <Text fontSize="sm" fontWeight="semibold">
                          {item.color || "N/A"}
                        </Text>
                      </HStack>
                      <HStack gap={2}>
                        <Text fontSize="sm" color="text.muted">
                          Cantidad:
                        </Text>
                        <Text fontSize="sm" fontWeight="semibold">
                          {item.quantity || 0}
                        </Text>
                      </HStack>
                      <HStack gap={2} ml="auto">
                        <Text fontSize="sm" color="text.muted">
                          Precio unitario:
                        </Text>
                        <Text fontSize="sm" fontWeight="semibold">
                          ${(item.price || 0).toLocaleString("es-AR")}
                        </Text>
                      </HStack>
                      <HStack gap={2} width="100%" justify="flex-end" pt={2} borderTop="1px solid" borderColor="gray.200">
                        <Text fontSize="sm" color="text.muted">
                          Subtotal:
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color="brand.700">
                          ${((item.price || 0) * (item.quantity || 0)).toLocaleString("es-AR")}
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Box>

          <Separator />

          {/* Resumen de Pago */}
          <Box>
            <Heading size="md" color="text.primary" mb={4}>
              Resumen de Pago
            </Heading>
            <VStack align="stretch" gap={3} bg="gray.50" p={4} borderRadius="md">
              <HStack justify="space-between">
                <Text fontWeight="semibold">Método de Pago:</Text>
                <Text>
                  {paymentMethod === "cash" ? "Efectivo" : "Mercado Pago"}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="semibold">Total:</Text>
                <Text fontSize="xl" fontWeight="bold" color="brand.700">
                  ${total.toLocaleString("es-AR")}
                </Text>
              </HStack>
              <Separator />
              <HStack justify="space-between">
                <Text fontSize="sm" color="text.muted">
                  Fecha de creación:
                </Text>
                <Text fontSize="sm">{formatDate(createdAt)}</Text>
              </HStack>
              {order.status === "pending-payment" && (
                <HStack justify="space-between">
                  <Text fontSize="sm" color="text.muted">
                    Vence el:
                  </Text>
                  <Text fontSize="sm" color="red.500" fontWeight="semibold">
                    {formatDate(expiresAt)}
                  </Text>
                </HStack>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}