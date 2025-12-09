import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import { ordersService } from "../../../services/ordersService";
import { createToaster } from "@chakra-ui/react";
import type { Order, PaymentStatusResponse } from "../../../types";

const toast = createToaster({ placement: "top-end" });

export function OrderDetailPage() {
  const { orderId, orderNumber: orderNumberParam } = useParams<{ 
    orderId?: string; 
    orderNumber?: string;
  }>();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status"); // success, failure, pending

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  // Función para cargar los detalles de la orden
  const loadOrder = async () => {
    try {
      let orderData: Order;
      let orderNumberToUse: string | null = null;
      
      // Determinar qué número de orden usar
      if (orderNumberParam) {
        // Si tenemos orderNumber en la URL, usarlo directamente
        orderNumberToUse = orderNumberParam;
      } else {
        // Si no, intentar obtener desde localStorage
        orderNumberToUse = localStorage.getItem("lastOrderNumber");
      }
      
      if (!orderNumberToUse) {
        throw new Error("No se encontró información de la orden. Por favor, verifica el número de orden.");
      }

      // Obtener la orden por número (endpoint público)
      orderData = await ordersService.getOrderByNumber(orderNumberToUse);

      setOrder(orderData);
      setError(null);

      // Si el status es "pending", iniciar polling (necesitamos el orderId para el polling)
      if (status === "pending" && orderData.status === "pending-payment" && orderData.id) {
        startPolling(orderData.id);
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Error al cargar los detalles de la orden";
      setError(errorMessage);
      
      toast.create({
        title: "Error",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar el estado del pago (polling)
  const checkPaymentStatus = async (orderId: string) => {
    try {
      const statusData: PaymentStatusResponse =
        await ordersService.getPaymentStatus(orderId);

      if (statusData.paymentStatus === "approved") {
        // Pago aprobado, recargar la orden
        setPolling(false);
        await loadOrder();
        
        toast.create({
          title: "¡Pago confirmado!",
          description: "Tu pago ha sido aprobado exitosamente",
          type: "success",
          duration: 5000,
        });
      } else if (
        statusData.paymentStatus === "rejected" ||
        statusData.paymentStatus === "cancelled"
      ) {
        // Pago rechazado
        setPolling(false);
        await loadOrder();
        
        toast.create({
          title: "Pago rechazado",
          description: "El pago fue rechazado o cancelado",
          type: "error",
          duration: 5000,
        });
      }
      // Si sigue pendiente, el polling continuará
    } catch (err) {
      console.error("Error al verificar estado de pago:", err);
      // No detener el polling por errores de red temporales
    }
  };

  // Iniciar polling para verificar el estado del pago
  const startPolling = (orderId: string) => {
    if (polling) return; // Ya está haciendo polling

    setPolling(true);
    const maxAttempts = 30; // 30 intentos máximo (1 minuto)
    const interval = 2000; // 2 segundos entre intentos
    let attempts = 0;

    const pollInterval = setInterval(async () => {
      attempts++;
      await checkPaymentStatus(orderId);

      // Si llegamos al máximo de intentos, detener el polling
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setPolling(false);
        
        toast.create({
          title: "Pago pendiente",
          description:
            "El pago está pendiente de confirmación. Te notificaremos cuando se confirme.",
          type: "warning",
          duration: 5000,
        });
      }
    }, interval);
  };

  useEffect(() => {
    loadOrder();
  }, [orderId, orderNumberParam, status]);

  // Mostrar loading
  if (loading) {
    return (
      <Box py={12} bg="bg.surface" minH="calc(100vh - 200px)">
        <Container maxW="800px">
          <VStack gap={8} align="center" justify="center" minH="400px">
            <Spinner size="xl" color="brand.500" />
            <Text color="text.secondary">Cargando detalles de la orden...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Mostrar error
  if (error || !order) {
    return (
      <Box py={12} bg="bg.surface" minH="calc(100vh - 200px)">
        <Container maxW="800px">
          <VStack gap={8} align="center" justify="center" minH="400px">
            <Icon as={FaExclamationTriangle} boxSize={16} color="red.500" />
            <VStack gap={2} align="center">
              <Heading size="lg" color="text.primary">
                Error al cargar la orden
              </Heading>
              <Text color="text.secondary" textAlign="center">
                {error || "No se pudo cargar la información de la orden"}
              </Text>
            </VStack>
            <Link to="/">
              <Button size="lg">Volver al catálogo</Button>
            </Link>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Obtener información del cliente (manejar ambos casos: customer y customerInfo)
  const customer = (order as any).customer || (order as any).customerInfo || {
    name: "N/A",
    email: "N/A",
    phone: "N/A",
  };

  // Determinar el estado y el mensaje según el status de la URL y el estado de la orden
  const getStatusInfo = () => {
    if (status === "success" || order.status === "payment-confirmed") {
      return {
        icon: FaCheckCircle,
        color: "green.500",
        title: "¡Pago Confirmado!",
        description:
          "Tu pago ha sido procesado exitosamente. Recibirás un email de confirmación.",
        bgColor: "green.50",
        borderColor: "green.200",
      };
    } else if (status === "failure" || order.paymentStatus === "rejected") {
      return {
        icon: FaTimesCircle,
        color: "red.500",
        title: "Pago Rechazado",
        description:
          "El pago fue rechazado. Por favor, intenta nuevamente o contacta con soporte.",
        bgColor: "red.50",
        borderColor: "red.200",
      };
    } else if (
      status === "pending" ||
      order.paymentStatus === "pending" ||
      order.status === "pending-payment"
    ) {
      return {
        icon: FaClock,
        color: "yellow.500",
        title: "Pago Pendiente",
        description: polling
          ? "Verificando el estado de tu pago..."
          : "Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
        bgColor: "yellow.50",
        borderColor: "yellow.200",
      };
    } else {
      return {
        icon: FaCheckCircle,
        color: "blue.500",
        title: "Orden Creada",
        description: "Tu orden ha sido creada exitosamente.",
        bgColor: "blue.50",
        borderColor: "blue.200",
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Box py={12} bg="bg.surface" minH="calc(100vh - 200px)">
      <Container maxW="800px">
        <VStack gap={8} align="stretch">
          {/* Estado del pago */}
          <Box
            borderRadius="md"
            bg={statusInfo.bgColor}
            border="1px solid"
            borderColor={statusInfo.borderColor}
            p={6}
          >
            <HStack gap={4} align="start">
              <Icon as={StatusIcon} boxSize={6} color={statusInfo.color} mt={1} />
              <Box flex="1">
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  {statusInfo.title}
                </Text>
                <Text fontSize="sm" color="text.secondary">
                  {statusInfo.description}
                </Text>
                {polling && (
                  <HStack mt={3} gap={2}>
                    <Spinner size="sm" />
                    <Text fontSize="xs">Verificando estado del pago...</Text>
                  </HStack>
                )}
              </Box>
            </HStack>
          </Box>

          {/* Información de la orden */}
          <Box bg="white" borderRadius="md" p={8} shadow="md">
            <VStack gap={6} align="stretch">
              <VStack gap={2} align="center">
                <Text fontSize="sm" color="text.muted" fontWeight="semibold">
                  Número de Pedido
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="brand.700">
                  #{order.orderNumber}
                </Text>
              </VStack>

              <Box borderTop="1px solid" borderColor="gray.200" />

              {/* Información del cliente */}
              <VStack gap={4} align="stretch">
                <Heading size="sm" color="text.primary">
                  Información del Cliente
                </Heading>
                <VStack gap={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="text.muted">
                      Nombre:
                    </Text>
                    <Text fontWeight="semibold" color="text.primary">
                      {customer.name}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="text.muted">
                      Email:
                    </Text>
                    <Text fontWeight="semibold" color="text.primary">
                      {customer.email}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="text.muted">
                      Teléfono:
                    </Text>
                    <Text fontWeight="semibold" color="text.primary">
                      {customer.phone}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>

              <Box borderTop="1px solid" borderColor="gray.200" />

              {/* Método de pago */}
              <HStack justify="center" gap={2}>
                <Icon
                  as={
                    order.paymentMethod === "cash"
                      ? FaMoneyBillWave
                      : FaCreditCard
                  }
                  boxSize={6}
                  color="brand.500"
                />
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" color="text.muted">
                    Método de Pago
                  </Text>
                  <Text fontWeight="semibold" color="text.primary">
                    {order.paymentMethod === "cash"
                      ? "Efectivo (pagas al recibir)"
                      : "Mercado Pago"}
                  </Text>
                </VStack>
              </HStack>

              <Box borderTop="1px solid" borderColor="gray.200" />

              {/* Items de la orden */}
              <VStack gap={4} align="stretch">
                <Heading size="sm" color="text.primary">
                  Productos
                </Heading>
                <VStack gap={3} align="stretch">
                  {order.items.map((item, index) => (
                    <HStack
                      key={index}
                      justify="space-between"
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                    >
                      <VStack align="start" gap={1}>
                        <Text fontWeight="semibold" color="text.primary">
                          {item.productName}
                        </Text>
                        <Text fontSize="sm" color="text.muted">
                          Talla: {item.size} | Color: {item.color} | Cantidad:{" "}
                          {item.quantity}
                        </Text>
                      </VStack>
                      <Text fontWeight="bold" color="text.primary">
                        ${(item.price * item.quantity).toLocaleString()}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>

              <Box borderTop="1px solid" borderColor="gray.200" />

              {/* Total */}
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color="text.primary">
                  Total:
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="brand.700">
                  ${order.total.toLocaleString()}
                </Text>
              </HStack>

              {/* Información adicional de estado */}
              {order.paymentStatus && (
                <>
                  <Box borderTop="1px solid" borderColor="gray.200" />
                  <VStack gap={2} align="stretch">
                    <Text fontSize="sm" color="text.muted" fontWeight="semibold">
                      Estado del Pago:
                    </Text>
                    <Text fontWeight="semibold" color="text.primary">
                      {order.paymentStatus === "approved"
                        ? "Aprobado"
                        : order.paymentStatus === "pending"
                        ? "Pendiente"
                        : order.paymentStatus === "rejected"
                        ? "Rechazado"
                        : order.paymentStatus === "cancelled"
                        ? "Cancelado"
                        : order.paymentStatus}
                    </Text>
                  </VStack>
                </>
              )}

              {order.paymentDate && (
                <>
                  <Box borderTop="1px solid" borderColor="gray.200" />
                  <VStack gap={2} align="stretch">
                    <Text fontSize="sm" color="text.muted" fontWeight="semibold">
                      Fecha de Pago:
                    </Text>
                    <Text fontWeight="semibold" color="text.primary">
                      {new Date(order.paymentDate).toLocaleString("es-AR")}
                    </Text>
                  </VStack>
                </>
              )}
            </VStack>
          </Box>

          {/* Botones de acción */}
          <VStack gap={4} width="100%">
            <Link to="/" style={{ width: "100%" }}>
              <Button size="lg" width="100%">
                Continuar Comprando
              </Button>
            </Link>

            {order.orderNumber && (
              <Link to={`/orders/${order.orderNumber}`} style={{ width: "100%" }}>
                <Button size="lg" width="100%" variant="outline">
                  Ver Detalles del Pedido
                </Button>
              </Link>
            )}
          </VStack>

          {/* Información de contacto */}
          <Text fontSize="sm" color="text.muted" textAlign="center">
            Si tienes alguna pregunta sobre tu pedido, contáctanos en{" "}
            <Text as="span" fontWeight="semibold" color="brand.700">
              boutique@vicentinos.com
            </Text>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

