import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  VStack,
  HStack,
  Separator,
  Button,
  Drawer,
} from "@chakra-ui/react";
import { useCartStore } from "../stores/cartStore";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange({ open: false });
    navigate("/checkout");
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} size="md">
      <Drawer.Backdrop />
      <Drawer.Content bg="white" shadow="2xl">
        <Drawer.Header borderBottomWidth="1px" p={4}>
          <Flex justify="space-between" align="center">
            <HStack gap={2}>
              <FiShoppingBag />
              <Drawer.Title fontSize="xl" fontWeight="bold">
                Tu Carrito
              </Drawer.Title>
            </HStack>
            <Drawer.CloseTrigger position="static" />
          </Flex>
        </Drawer.Header>

        <Drawer.Body p={0}>
          {items.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="100%"
              p={8}
              textAlign="center"
            >
              <Box color="gray.300" mb={4}>
                <FiShoppingBag size={64} />
              </Box>
              <Text fontSize="lg" fontWeight="medium" color="gray.500">
                Tu carrito está vacío
              </Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                ¡Agrega algunos productos para comenzar tu compra!
              </Text>
            </Flex>
          ) : (
            <VStack gap={0} align="stretch">
              {items.map((item) => (
                <Box key={`${item.product.id}-${item.size}-${item.color}`}>
                  <Flex p={4} gap={4} align="center">
                    {/* Miniatura del producto */}
                    <Box
                      w="80px"
                      h="80px"
                      borderRadius="md"
                      overflow="hidden"
                      flexShrink={0}
                      bg="gray.50"
                    >
                      <Image
                        src={item.product.images[0] || "/placeholder-image.jpg"}
                        alt={item.product.name}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    </Box>

                    {/* Info del producto */}
                    <VStack align="start" gap={1} flex="1">
                      <Text fontWeight="semibold" fontSize="sm">
                        {item.product.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Talla: {item.size} | Color: {item.color}
                      </Text>
                      <Text fontWeight="bold" color="brand.600">
                        ${(item.product.discountPrice || item.product.price).toLocaleString("es-AR")}
                      </Text>

                      {/* Controles de cantidad */}
                      <HStack gap={3} mt={1}>
                        <HStack gap={0} border="1px solid" borderColor="gray.200" borderRadius="md">
                          <IconButton
                            aria-label="Restar"
                            size="xs"
                            variant="ghost"
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          >
                            <FiMinus size={10} />
                          </IconButton>
                          <Text fontSize="xs" minW="24px" textAlign="center" fontWeight="bold">
                            {item.quantity}
                          </Text>
                          <IconButton
                            aria-label="Sumar"
                            size="xs"
                            variant="ghost"
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          >
                            <FiPlus size={10} />
                          </IconButton>
                        </HStack>
                        
                        <IconButton
                          aria-label="Eliminar"
                          size="xs"
                          variant="ghost"
                          color="red.400"
                          onClick={() => removeItem(item.product.id, item.size, item.color)}
                        >
                          <FiTrash2 size={14} />
                        </IconButton>
                      </HStack>
                    </VStack>
                  </Flex>
                  <Separator borderColor="gray.100" />
                </Box>
              ))}
            </VStack>
          )}
        </Drawer.Body>

        {items.length > 0 && (
          <Drawer.Footer
            display="block"
            borderTopWidth="1px"
            p={6}
            bg="gray.50"
          >
            <VStack gap={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Text fontSize="md" color="gray.600">Total estimado</Text>
                <Text fontSize="xl" fontWeight="bold" color="brand.700">
                  ${getTotal().toLocaleString("es-AR")}
                </Text>
              </Flex>
              <Button
                size="lg"
                w="100%"
                bg="brand.500"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={handleCheckout}
                fontWeight="bold"
                boxShadow="md"
              >
                Finalizar Compra
              </Button>
              <Text fontSize="xs" color="gray.400" textAlign="center">
                Impuestos y envíos calculados en el pago
              </Text>
            </VStack>
          </Drawer.Footer>
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
