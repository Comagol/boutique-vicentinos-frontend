import { Box, Flex, HStack, Text, IconButton, Badge} from "@chakra-ui/react"
import { useCartStore } from "../stores/cartStore"
import { FaShoppingCart } from "react-icons/fa"
import { Link } from "react-router-dom"

export function Navbar() {
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <Box as="header" bg="bg.surface" borderBottom="1px solid" borderColor="gray.200">
      <Flex h={16} align="center" justify="space-between" maxW="1200px" mx="auto" px={4}>
        <HStack gap={4}>
          <Link to="/">
          <Text fontWeight="bold" color="brand.700">
            Boutique Vicentinos
          </Text>
          </Link>
        </HStack>

        <HStack gap={3}>
        <Link to="/admin">
          <Text fontSize="sm" color="text.secondary">
            Admin
          </Text>
          </Link>
          <Box position="relative">
            <Link to="/checkout">
              <IconButton 
                aria-label="Carrito" 
                _hover={{ color: "brand.700" }} 
                _active={{ color: "brand.900" }} 
                variant="ghost"
              >
                <FaShoppingCart />
              </IconButton>
            </Link>
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