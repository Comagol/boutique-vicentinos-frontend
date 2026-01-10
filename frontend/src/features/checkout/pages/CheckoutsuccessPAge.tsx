import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Icon,
} from "@chakra-ui/react";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { FaCheckCircle, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

interface CheckoutSuccessState {
  orderNumber?: string;
  paymentMethod?: string;
  orderId?: string;
}

export function CheckoutSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const state = location.state as CheckoutSuccessState | null;

  // Obtener orderNumber de diferentes fuentes:
  // 1. Del state (navegación interna)
  // 2. Del localStorage (retorno de Mercado Pago)
  // 3. De los parámetros de la URL (si Mercado Pago los pasa)
  const orderNumberFromState = state?.orderNumber;
  const orderNumberFromStorage = localStorage.getItem("lastOrderNumber");
  const orderNumberFromUrl = searchParams.get("orderNumber");
  
  const orderNumber = orderNumberFromState || orderNumberFromUrl || orderNumberFromStorage;
  const paymentMethod = state?.paymentMethod || "mercadopago"; // Si viene de Mercado Pago, asumimos que es mercadopago

  // Si no hay orderNumber en ningún lugar, redirigir al catálogo
  useEffect(() => {
    if (!orderNumber) {
      navigate("/");
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) {
    return null;
  }

  return (
    <Box py={12} bg="bg.surface" minH="calc(100vh - 200px)">
      <Container maxW="800px">
        <VStack gap={8} align="center">
          {/* Icono de éxito */}
          <Icon
            as={FaCheckCircle}
            boxSize={20}
            color="green.500"
          />

          {/* Título */}
          <VStack gap={2} align="center">
            <Heading size="xl" color="text.primary" textAlign="center">
              ¡Pedido Confirmado!
            </Heading>
            <Text fontSize="lg" color="text.secondary" textAlign="center">
              Tu pedido ha sido creado exitosamente
            </Text>
          </VStack>

          {/* Información del pedido */}
          <Box
            bg="white"
            borderRadius="md"
            p={8}
            shadow="md"
            width="100%"
          >
            <VStack gap={6} align="stretch">
              <VStack gap={2} align="center">
                <Text fontSize="sm" color="text.muted" fontWeight="semibold">
                  Número de Pedido
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="brand.700">
                  #{orderNumber}
                </Text>
              </VStack>

              <Box borderTop="1px solid" borderColor="gray.200" />

              <HStack justify="center" gap={2}>
                <Icon
                  as={
                    paymentMethod === "cash"
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
                    {paymentMethod === "cash"
                      ? "Efectivo (pagas al recibir)"
                      : "Mercado Pago"}
                  </Text>
                </VStack>
              </HStack>

              {paymentMethod === "cash" && (
                <>
                  <Box borderTop="1px solid" borderColor="gray.200" />
                  <VStack gap={2} align="center">
                    <Text fontSize="sm" color="text.muted" textAlign="center">
                      Recibirás un email con los detalles de tu pedido.
                      El stock ha sido reservado y estará disponible para
                      retiro/entrega.
                    </Text>
                  </VStack>
                </>
              )}

              {paymentMethod === "mercadopago" && (
                <>
                  <Box borderTop="1px solid" borderColor="gray.200" />
                  <VStack gap={2} align="center">
                    <Text fontSize="sm" color="text.muted" textAlign="center">
                      Tu pago está siendo procesado. Recibirás un email de
                      confirmación cuando el pago sea aprobado.
                    </Text>
                  </VStack>
                </>
              )}
            </VStack>
          </Box>

          {/* Botones de acción */}
          <VStack gap={4} width="100%" maxW="400px">
            <Link to="/">
            <Button
              size="lg"
              width="100%"
            >
              Continuar Comprando
            </Button>
            </Link>

            <Link to={`/orders/${orderNumber}`}>
            <Button
              size="lg"
              width="100%"
            >
              Ver Detalles del Pedido
            </Button>
            </Link>
          </VStack>

          {/* Información adicional */}
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