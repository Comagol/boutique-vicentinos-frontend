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
  Portal, // Importante: necesitamos el Portal
} from "@chakra-ui/react";
import { useCartStore, selectCartTotal } from "../stores/cartStore";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toaster } from "../app/AppProvider";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const total = useCartStore(selectCartTotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const navigate = useNavigate();

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
    <Drawer.Root 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <Portal> {/* El Portal saca el componente fuera del Navbar */}
        <Drawer.Backdrop />
        <Drawer.Positioner> {/* El Positioner ayuda a ubicarlo correctamente */}
          <Drawer.Content 
            bg="white" 
            h="100dvh" // Usamos dvh para mejor soporte en móviles
            w={{ base: "100%", md: "420px" }} 
            boxShadow="2xl"
            position="fixed"
            right={0}
            top={0}
          >
            <Drawer.Header 
              borderBottomWidth="1px" 
              p={5} 
              bg="white"
            >
              <Flex justify="space-between" align="center">
                <HStack gap={3}>
                  <Box color="brand.600">
                    <FiShoppingBag size={24} />
                  </Box>
                  <Drawer.Title fontSize="xl" fontWeight="bold" color="gray.800">
                    Tu Carrito
                  </Drawer.Title>
                </HStack>
                <IconButton
                  variant="ghost"
                  size="md"
                  onClick={() => onOpenChange({ open: false })}
                  color="gray.500"
                  _hover={{ bg: "gray.100", color: "brand.500" }}
                >
                  <FiX size={20} />
                </IconButton>
              </Flex>
            </Drawer.Header>

            <Drawer.Body 
              p={0} 
              overflowY="auto" 
              flex="1"
              css={{
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#CBD5E0",
                  borderRadius: "10px",
                },
              }}
            >
              {items.length === 0 ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  h="70vh"
                  p={8}
                  textAlign="center"
                >
                  <Box color="gray.100" mb={6}>
                    <FiShoppingBag size={100} />
                  </Box>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                    El carrito está vacío
                  </Text>
                  <Text fontSize="md" color="gray.500" mt={3} maxW="280px">
                    ¿Aún no te decidiste? Tenemos muchas opciones para vos.
                  </Text>
                  <Button
                    mt={8}
                    bg="brand.500"
                    color="white"
                    px={8}
                    rounded="full"
                    onClick={() => onOpenChange({ open: false })}
                  >
                    Explorar productos
                  </Button>
                </Flex>
              ) : (
                <VStack gap={0} align="stretch" p={2}>
                  {items.map((item) => (
                    <Box key={`${item.product.id}-${item.size}-${item.color}`} w="100%">
                      <Flex p={4} gap={4} align="center" position="relative">
                        {/* Imagen con sombra sutil */}
                        <Box
                          w="90px"
                          h="90px"
                          borderRadius="xl"
                          overflow="hidden"
                          flexShrink={0}
                          boxShadow="sm"
                          border="1px solid"
                          borderColor="gray.100"
                        >
                          <Image
                            src={item.product.images[0] || "/placeholder-image.jpg"}
                            alt={item.product.name}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                          />
                        </Box>

                        {/* Contenido info */}
                        <VStack align="start" gap={0} flex="1">
                          <Text 
                            fontWeight="bold" 
                            fontSize="md" 
                            color="gray.800" 
                            lineHeight="shorter"
                            mb={1}
                          >
                            {item.product.name}
                          </Text>
                          <Text fontSize="xs" color="brand.500" fontWeight="extrabold" letterSpacing="wider" mb={2}>
                            {item.size.toUpperCase()} {item.color && `| ${item.color.toUpperCase()}`}
                          </Text>
                          
                          <Flex w="100%" justify="space-between" align="center">
                            <Text fontWeight="800" fontSize="xl" color="gray.900">
                              ${(item.product.discountPrice || item.product.price).toLocaleString("es-AR")}
                            </Text>
                            
                            <HStack gap={1} bg="gray.100" borderRadius="full" p={1}>
                                <IconButton
                                  aria-label="Restar"
                                  size="xs"
                                  variant="ghost"
                                  rounded="full"
                                  onClick={() => handleUpdateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                                >
                                  <FiMinus size={10} />
                                </IconButton>
                                <Text fontSize="sm" minW="25px" textAlign="center" fontWeight="bold">
                                  {item.quantity}
                                </Text>
                                <IconButton
                                  aria-label="Sumar"
                                  size="xs"
                                  variant="ghost"
                                  rounded="full"
                                  onClick={() => handleUpdateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                                >
                                  <FiPlus size={10} />
                                </IconButton>
                            </HStack>
                          </Flex>
                        </VStack>

                        <IconButton
                          aria-label="Eliminar"
                          size="sm"
                          variant="subtle"
                          colorPalette="red"
                          color="red.600"
                          rounded="full"
                          onClick={() => removeItem(item.product.id, item.size, item.color)}
                          position="absolute"
                          top={2}
                          right={2}
                        >
                          <FiTrash2 size={16} />
                        </IconButton>
                      </Flex>
                      <Separator borderColor="gray.100" mx={4} />
                    </Box>
                  ))}
                </VStack>
              )}
            </Drawer.Body>

            {items.length > 0 && (
              <Drawer.Footer
                display="block"
                p={6}
                bg="white"
                boxShadow="0 -10px 20px -5px rgba(0,0,0,0.05)"
              >
                <VStack gap={4} align="stretch">
                  <Flex justify="space-between" align="baseline">
                    <Text fontSize="sm" color="gray.500" fontWeight="bold">TOTAL</Text>
                    <Text fontSize="3xl" fontWeight="900" color="brand.700">
                      ${total.toLocaleString("es-AR")}
                    </Text>
                  </Flex>
                  <Button
                    size="xl"
                    w="100%"
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: "brand.600", transform: "translateY(-2px)" }}
                    _active={{ transform: "translateY(0)" }}
                    onClick={() => navigate("/checkout")}
                    fontWeight="extrabold"
                    fontSize="lg"
                    h="60px"
                    rounded="xl"
                    boxShadow="0 8px 20px -6px rgba(0,0,0,0.2)"
                  >
                    FINALIZAR COMPRA
                  </Button>
                </VStack>
              </Drawer.Footer>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}