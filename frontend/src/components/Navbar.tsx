import { Box, Flex, HStack, Text, IconButton, Badge} from "@chakra-ui/react"
import { useCartStore } from "../stores/cartStore"
import { FaShoppingCart } from "react-icons/fa"
import { Link } from "react-router-dom"

export function Navbar() {
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <Box as="header" bg="brand.900" borderBottom="1px solid" borderColor="brand.700">
      <Flex h={16} align="center" justify="space-between" maxW="1200px" mx="auto" px={4}>
        <HStack gap={4}>
          <Link to="/">
          <Text fontWeight="bold" color="white">
            Boutique Vicentinos
          </Text>
          </Link>
        </HStack>

        <HStack gap={3}>
        <Link to="/admin">
          <Text fontSize="sm" color="white">
            Admin
          </Text>
        </Link>
          <Box position="relative">
            <Link to="/checkout">
              <IconButton 
                aria-label="Carrito" 
                _hover={{ color: "brand.500" }} 
                _active={{ color: "brand.500" }} 
                variant="ghost"
                color="white"
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