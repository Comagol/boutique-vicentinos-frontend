import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  Heading,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";
import type { CartItem } from "../../../types";
import { toaster } from "../../../app/AppProvider";

interface CartSummaryProps {
  items: CartItem[];
  total: number;
}

export function CartSummary({ items, total }: CartSummaryProps) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const handleUpdateQuantity = (productId: string, size: string, color: string, newQty: number) => {
    const success = updateQuantity(productId, size, color, newQty);
    if (!success) {
      toaster.create({
        title: "Límite alcanzado",
        description: "No hay más stock disponible para este producto",
        type: "error",
      });
    }
  };

  return (
    <Box
      bg="white"
      borderRadius="md"
      p={6}
      shadow="sm"
      position="sticky"
      top="20px"
    >
      <VStack gap={4} align="stretch">
        <Heading size="md" color="text.primary">
          Resumen del Pedido
        </Heading>

        {/* Lista de items */}
        <VStack gap={3} align="stretch" maxH="400px" overflowY="auto">
          {items.map((item, index) => {
            const price = item.product.discountPrice || item.product.price;
            const itemTotal = price * item.quantity;

            return (
              <Box key={`${item.product.id}-${item.size}-${item.color}-${index}`}>
                <HStack gap={3} align="start">
                  <Image
                    src={item.product.images[0] || "/placeholder.jpg"}
                    alt={item.product.name}
                    width="80px"
                    height="80px"
                    objectFit="cover"
                    borderRadius="md"
                  />

                  <VStack align="start" gap={1} flex="1">
                    <Text fontWeight="semibold" fontSize="sm">
                      {item.product.name}
                    </Text>
                    <Text fontSize="xs" color="text.muted">
                      Talla: {item.size} | Color: {item.color}
                    </Text>
                    <HStack gap={2}>
                      <Text fontSize="sm" color="text.secondary">
                        Cantidad: {item.quantity}
                      </Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </HStack>
                    <Button
                      size="xs"
                      variant="ghost"
                      color="red.500"
                      onClick={() =>
                        removeItem(item.product.id, item.size, item.color)
                      }
                    >
                      Eliminar
                    </Button>
                  </VStack>

                  <Text fontWeight="bold" fontSize="sm">
                    ${itemTotal.toLocaleString("es-AR")}
                  </Text>
                </HStack>
              </Box>
            );
          })}
        </VStack>

        {/* Total */}
        <VStack gap={2} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold">
              Total:
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="brand.700">
              ${total.toLocaleString("es-AR")}
            </Text>
          </HStack>
        </VStack>

        <Link to="/" style={{ width: "100%" }}>
          <Button variant="outline" size="sm" width="100%">
            Continuar comprando
          </Button>
        </Link>
      </VStack>
    </Box>
  );
}