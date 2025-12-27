import { Box, Flex, HStack, Text, IconButton, Badge } from "@chakra-ui/react"
import { useCartStore } from "../stores/cartStore"
import { FaShoppingCart } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { toaster } from "../app/AppProvider"

export function Navbar() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const items = useCartStore((s) => s.items);
  const navigate = useNavigate();

  const handleCartClick = () => {
    if (items.length === 0) {
      toaster.create({ // Usar toaster en lugar de toast
        title: "Carrito vacío",
        description: "Agrega productos al carrito para continuar",
        type: "warning",
        duration: 2000,
      });
      return;
    }
    navigate("/checkout");
  };

  return (
    <Box as="header" bg="brand.900" borderBottom="1px solid" borderColor="brand.700">
      <Flex h={16} align="center" justify="space-between" maxW="1200px" mx="auto" px={4}>
        <HStack gap={4}>
          <Box onClick={() => navigate("/")} cursor="pointer">
          <Text fontWeight="bold" color="white">
            Boutique Vicentinos
          </Text>
          </Box>
        </HStack>

        <HStack gap={3}>
          <Box position="relative">
            <IconButton 
              aria-label="Carrito" 
              onClick={handleCartClick}
              _hover={{ color: "brand.500" }} 
              _active={{ color: "brand.500" }} 
              variant="ghost"
              color="white"
            >
              <FaShoppingCart />
            </IconButton>
            {itemCount > 0 && (
              <Badge
                position="absolute"
                top="-6px"
                right="-6px"
                colorPalette="red"
                borderRadius="full"
              >
                {itemCount}
              </Badge>
            )}
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
}