import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Container, VStack, Text, Spinner } from "@chakra-ui/react";

/**
 * Página que maneja el retorno de Mercado Pago después del pago
 * Mercado Pago redirige aquí con parámetros como:
 * - status: success, failure, pending
 * - payment_id: ID del pago
 * - preference_id: ID de la preferencia
 * - collection_status: approved, pending, rejected, etc.
 */
export function MercadoPagoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Obtener parámetros de la URL
    const status = searchParams.get("status");
    const paymentId = searchParams.get("payment_id");
    const preferenceId = searchParams.get("preference_id");
    const collectionStatus = searchParams.get("collection_status");

    // Obtener orderNumber del localStorage (guardado antes de redirigir a Mercado Pago)
    const orderNumber = localStorage.getItem("lastOrderNumber");
    const orderId = localStorage.getItem("lastOrderId");

    console.log("Mercado Pago Callback:", {
      status,
      paymentId,
      preferenceId,
      collectionStatus,
      orderNumber,
      orderId,
    });

    // Si tenemos orderNumber, redirigir a la página de éxito
    if (orderNumber) {
      // Redirigir a la página de éxito con el orderNumber
      navigate("/checkout/success", {
        state: {
          orderNumber,
          paymentMethod: "mercadopago",
          orderId,
        },
        replace: true, // Reemplazar la entrada en el historial
      });
    } else {
      // Si no hay orderNumber, redirigir al inicio
      console.warn("No se encontró orderNumber en localStorage");
      navigate("/", { replace: true });
    }
  }, [navigate, searchParams]);

  // Mostrar un spinner mientras se procesa la redirección
  return (
    <Box py={12} bg="bg.surface" minH="calc(100vh - 200px)">
      <Container maxW="800px">
        <VStack gap={4} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="text.secondary" fontSize="lg">
            Procesando tu pago...
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
