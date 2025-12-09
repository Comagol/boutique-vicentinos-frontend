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
      console.log("Creando orden con:", { customerInfo, items, paymentMethod }); // Debug
      
      // Crear pedido en el backend
      const response = await ordersService.createOrder(
        customerInfo,
        items,
        paymentMethod
      );

      console.log("Respuesta completa del backend:", response); // Debug

      const { order, paymentUrl } = response;

      console.log("Order extraída:", order); // Debug
      console.log("PaymentUrl extraída:", paymentUrl); // Debug

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
      } else if (paymentMethod === "mercadopago") {
        // Mercado Pago: redirigir a la URL de pago
        if (!paymentUrl) {
          // Si no hay paymentUrl, algo salió mal
          console.error("No se recibió paymentUrl en la respuesta:", response);
          throw new Error("No se recibió URL de pago de Mercado Pago. Por favor, contacta con soporte.");
        }

        if (!order || !order.orderNumber) {
          console.error("No se recibió order u orderNumber en la respuesta:", response);
          throw new Error("Error al crear la orden. Por favor, intenta nuevamente.");
        }

        // Guardar orderNumber en localStorage para consultas posteriores
        localStorage.setItem("lastOrderNumber", order.orderNumber);
        localStorage.setItem("lastOrderId", order.id);
        
        // Limpiar carrito antes de redirigir
        clear();
        
        console.log("Redirigiendo a Mercado Pago:", paymentUrl); // Debug
        
        toast.create({
          title: "Redirigiendo a Mercado Pago",
          description: "Serás redirigido para completar el pago",
          type: "info",
          duration: 2000,
        });

        // Redirigir inmediatamente (sin delay para evitar problemas)
        window.location.href = paymentUrl;
      }
    } catch (error) {
      // Log del error para debugging
      console.error("Error al crear orden:", error);
      
      // Mostrar error al usuario
      const errorMessage =
        (error as ApiError).message || 
        (error as Error)?.message || 
        "Error al procesar el pedido. Por favor, intenta nuevamente.";
      
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
                    : paymentMethod === "mercadopago"
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