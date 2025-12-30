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
  // El backend puede devolver 'customer' o 'customerInfo'
  const customerInfo = (order.customerInfo || (order as any).customer) || {
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
        maxW={{ base: "100%", md: "800px" }}
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
          p={{ base: 4, md: 6 }}
          borderBottom="1px solid"
          borderColor="gray.200"
          flexWrap="wrap"
          gap={2}
        >
          <VStack align="start" gap={1}>
            <Heading size={{ base: "md", md: "lg" }} color="text.primary">
              Pedido #{orderNumber}
            </Heading>
            <Badge
              colorPalette={getStatusColor(status)}
              borderRadius="md"
              fontSize={{ base: "xs", md: "sm" }}
            >
              {getStatusLabel(status)}
            </Badge>
          </VStack>
          <IconButton
            aria-label="Cerrar"
            variant="ghost"
            onClick={onClose}
            size={{ base: "sm", md: "md" }}
          >
            <FiX />
          </IconButton>
        </Flex>

        {/* Contenido */}
        <VStack gap={{ base: 4, md: 6 }} align="stretch" p={{ base: 4, md: 6 }}>
          {/* Información del Cliente */}
          <Box>
            <Heading size={{ base: "sm", md: "md" }} color="text.primary" mb={4}>
              Información del Cliente
            </Heading>
            <VStack align="start" gap={2} bg="gray.50" p={{ base: 3, md: 4 }} borderRadius="md">
              <HStack gap={4} flexWrap="wrap">
                <Text fontWeight="semibold" minW={{ base: "60px", md: "80px" }} fontSize={{ base: "sm", md: "md" }}>
                  Nombre:
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }}>{customerInfo.name}</Text>
              </HStack>
              <HStack gap={4} flexWrap="wrap">
                <Text fontWeight="semibold" minW={{ base: "60px", md: "80px" }} fontSize={{ base: "sm", md: "md" }}>
                  Email:
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} wordBreak="break-word">{customerInfo.email}</Text>
              </HStack>
              <HStack gap={4} flexWrap="wrap">
                <Text fontWeight="semibold" minW={{ base: "60px", md: "80px" }} fontSize={{ base: "sm", md: "md" }}>
                  Teléfono:
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }}>{customerInfo.phone}</Text>
              </HStack>
            </VStack>
          </Box>

          <Separator />

          {/* Productos */}
          <Box>
            <Heading size={{ base: "sm", md: "md" }} color="text.primary" mb={4}>
              Productos ({itemsArray.length})
            </Heading>
            <VStack gap={3} align="stretch">
              {itemsArray.map((item, index) => (
                <Box
                  key={index}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={{ base: 3, md: 4 }}
                >
                  <VStack align="start" gap={2}>
                    <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }}>
                      {item.productName || "Producto sin nombre"}
                    </Text>
                    <VStack align="stretch" gap={2} width="100%">
                      <HStack gap={4} flexWrap="wrap">
                        <HStack gap={2}>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
                            Talla:
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold">
                            {item.size || "N/A"}
                          </Text>
                        </HStack>
                        <HStack gap={2}>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
                            Color:
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold">
                            {item.color || "N/A"}
                          </Text>
                        </HStack>
                        <HStack gap={2}>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
                            Cantidad:
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold">
                            {item.quantity || 0}
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack gap={2} justify="space-between" flexWrap="wrap">
                        <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
                          Precio unitario:
                        </Text>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold">
                          ${(item.price || 0).toLocaleString("es-AR")}
                        </Text>
                      </HStack>
                      <HStack gap={2} width="100%" justify="space-between" pt={2} borderTop="1px solid" borderColor="gray.200">
                        <Text fontSize={{ base: "sm", md: "md" }} color="text.muted" fontWeight="semibold">
                          Subtotal:
                        </Text>
                        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="brand.700">
                          ${((item.price || 0) * (item.quantity || 0)).toLocaleString("es-AR")}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Box>

          <Separator />

          {/* Resumen de Pago */}
          <Box>
            <Heading size={{ base: "sm", md: "md" }} color="text.primary" mb={4}>
              Resumen de Pago
            </Heading>
            <VStack align="stretch" gap={3} bg="gray.50" p={{ base: 3, md: 4 }} borderRadius="md">
              <HStack justify="space-between" flexWrap="wrap">
                <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>Método de Pago:</Text>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  {paymentMethod === "cash" ? "Efectivo" : "Mercado Pago"}
                </Text>
              </HStack>
              <HStack justify="space-between" flexWrap="wrap">
                <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>Total:</Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="brand.700">
                  ${total.toLocaleString("es-AR")}
                </Text>
              </HStack>
              <Separator />
              <HStack justify="space-between" flexWrap="wrap">
                <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
                  Fecha de creación:
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }}>{formatDate(createdAt)}</Text>
              </HStack>
              {order.status === "pending-payment" && (
                <HStack justify="space-between" flexWrap="wrap">
                  <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted">
                    Vence el:
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="red.500" fontWeight="semibold">
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