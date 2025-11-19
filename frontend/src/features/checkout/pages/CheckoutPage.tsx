import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";
import type { CustomerInfo } from "../../../types";
import { CartSummary } from "../components/CartSummary";
import { CustomerForm } from "../components/CustomerForm";
import { PaymentOptions } from "../components/PaymentOptions";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clear, getTotal } = useCartStore();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si el carrito está vacío, redirigir al catálogo
  if (items.length === 0) {
    navigate("/");
    return null;
  }

  const total = getTotal();

  const handleSubmit = async () => {
    if (!customerInfo || !paymentMethod) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === "cash") {
        // TODO: Llamar a API para crear pedido con paymentMethod: "cash"
        // await createOrder({ customerInfo, items, paymentMethod: "cash", status: "pending-payment" });
        
        // Por ahora simulamos
        console.log("Pedido creado en efectivo:", { customerInfo, items, paymentMethod });
        
        // Limpiar carrito y redirigir
        clear();
        navigate("/checkout/success", { state: { paymentMethod: "cash" } });
      } else if (paymentMethod === "mercado_pago") {
        // TODO: Redirigir a Mercado Pago o integrar MP
        // Por ahora simulamos
        console.log("Redirigiendo a Mercado Pago:", { customerInfo, items });
        
        // Aquí iría la integración con MP o redirección
        // window.location.href = mercadoPagoUrl;
      }
    } catch (error) {
      console.error("Error al procesar pedido:", error);
      // TODO: Mostrar toast de error
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = customerInfo && paymentMethod && !isSubmitting;

  return (
    <Box py={8} bg="bg.surface" minH="calc(100vh - 200px)">
      <Container maxW="1200px">
        <VStack gap={8} align="stretch">
          <Heading size="lg" color="text.primary">
            Checkout
          </Heading>

          <HStack
            gap={8}
            align="start"
            flexDirection={{ base: "column", lg: "row" }}
          >
            {/* Columna izquierda: Formulario */}
            <Box flex="1">
              <VStack gap={6} align="stretch">
                <CustomerForm
                  onCustomerChange={setCustomerInfo}
                  customerInfo={customerInfo}
                />

                <PaymentOptions
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                />

                <Button
                  size="lg"
                  width="100%"
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: "brand.700" }}
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  loading={isSubmitting}
                >
                  {paymentMethod === "cash"
                    ? "Confirmar Pedido"
                    : paymentMethod === "mercado_pago"
                    ? "Ir a Mercado Pago"
                    : "Continuar"}
                </Button>
              </VStack>
            </Box>

            {/* Columna derecha: Resumen */}
            <Box width={{ base: "100%", lg: "400px" }}>
              <CartSummary items={items} total={total} />
            </Box>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}