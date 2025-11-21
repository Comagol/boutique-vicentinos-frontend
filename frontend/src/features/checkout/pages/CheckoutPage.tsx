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
import { ordersService } from "../../../services/ordersService";
import { createToaster } from "@chakra-ui/react";
import type { CustomerInfo, ApiError } from "../../../types";
import { CartSummary } from "../components/CartSummary";
import { CustomerForm } from "../components/CustomerForm";
import { PaymentOptions } from "../components/PaymentOptions";

const toast = createToaster({ placement: "top-end" });

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
      // Crear pedido en el backend
      const response = await ordersService.createOrder(
        customerInfo,
        items,
        paymentMethod
      );

      const { order, paymentUrl } = response;

      if (paymentMethod === "cash") {
        // Pedido en efectivo: limpiar carrito y redirigir a página de éxito
        clear();
        
        toast.create({
          title: "¡Pedido confirmado!",
          description: `Tu pedido #${order.orderNumber} ha sido creado exitosamente`,
          type: "success",
          duration: 3000,
        });

        navigate("/checkout/success", {
          state: {
            orderNumber: order.orderNumber,
            paymentMethod: "cash",
            orderId: order.id,
          },
        });
      } else if (paymentMethod === "mercado_pago") {
        // Mercado Pago: redirigir a la URL de pago
        if (paymentUrl) {
          // Limpiar carrito antes de redirigir
          clear();
          
          toast.create({
            title: "Redirigiendo a Mercado Pago",
            description: "Serás redirigido para completar el pago",
            type: "info",
            duration: 2000,
          });

          // Pequeño delay para que el usuario vea el mensaje
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 1500);
        } else {
          // Si no hay paymentUrl, algo salió mal
          throw new Error("No se recibió URL de pago de Mercado Pago");
        }
      }
    } catch (error) {
      console.error("Error al procesar pedido:", error);
      
      // Mostrar error al usuario
      const errorMessage =
        (error as ApiError).message || "Error al procesar el pedido. Por favor, intenta nuevamente.";
      
      toast.create({
        title: "Error al procesar pedido",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });
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