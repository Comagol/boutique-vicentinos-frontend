import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  Badge,
  Button,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { useCartStore } from "../stores/cartStore";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toaster } from "../app/AppProvider";
import { useState, useEffect } from "react";

export function Navbar() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const items = useCartStore((s) => s.items);
  const navigate = useNavigate();
  const [prevItemCount, setPrevItemCount] = useState(itemCount);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Animación del badge cuando cambia el conteo
  useEffect(() => {
    if (itemCount !== prevItemCount && itemCount > 0) {
      setIsCartAnimating(true);
      const timer = setTimeout(() => setIsCartAnimating(false), 600);
      setPrevItemCount(itemCount);
      return () => clearTimeout(timer);
    }
  }, [itemCount, prevItemCount]);

  const handleCartClick = () => {
    if (items.length === 0) {
      toaster.create({
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
    <Box
      as="header"
      bg="brand.900"
      borderBottom="1px solid"
      borderColor="brand.700"
      shadow="md"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex
        h={{ base: 16, md: 20 }}
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
      >
        {/* Logo */}
        <Box
          onClick={() => navigate("/")}
          cursor="pointer"
          transition="transform 0.2s ease"
          _hover={{ transform: "scale(1.05)" }}
        >
          <Text
            fontWeight="bold"
            color="white"
            fontSize={{ base: "lg", md: "xl" }}
            letterSpacing="wide"
          >
            Boutique Vicentinos
          </Text>
        </Box>

        {/* Right side: Auth buttons + Cart */}
        <HStack gap={{ base: 2, md: 4 }}>
          {/* Auth Buttons - Hidden on mobile, shown on desktop */}
          {!isMobile && (
            <>
              <Button
                variant="ghost"
                color="white"
                onClick={() => navigate("/login")}
                _hover={{
                  bg: "whiteAlpha.200",
                  color: "brand.100",
                }}
                _active={{
                  bg: "whiteAlpha.300",
                }}
                transition="all 0.2s ease"
                fontWeight="medium"
              >
                Iniciar Sesión
              </Button>
              <Button
                bg="brand.500"
                color="white"
                onClick={() => navigate("/register")}
                _hover={{
                  bg: "brand.700",
                  transform: "translateY(-1px)",
                  shadow: "lg",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s ease"
                fontWeight="semibold"
                borderRadius="md"
              >
                Registrarse
              </Button>
            </>
          )}

          {/* Mobile Auth Button - Shows user icon on mobile */}
          {isMobile && (
            <IconButton
              aria-label="Iniciar sesión"
              icon={<FaUser />}
              variant="ghost"
              color="white"
              onClick={() => navigate("/login")}
              _hover={{
                bg: "whiteAlpha.200",
                color: "brand.100",
              }}
            />
          )}

          {/* Cart Icon */}
          <Box position="relative">
            <IconButton
              aria-label="Carrito de compras"
              onClick={handleCartClick}
              variant="ghost"
              color="white"
              size={{ base: "md", md: "lg" }}
              transition="all 0.2s ease"
              _hover={{
                bg: "whiteAlpha.200",
                color: "brand.300",
                transform: "scale(1.1)",
              }}
              _active={{
                transform: "scale(0.95)",
              }}
            >
              <Icon
                as={FaShoppingCart}
                boxSize={{ base: 5, md: 6 }}
                transition="transform 0.3s ease"
                transform={isCartAnimating ? "scale(1.2)" : "scale(1)"}
              />
            </IconButton>
            {itemCount > 0 && (
              <Badge
                position="absolute"
                top="-2px"
                right="-2px"
                colorPalette="red"
                borderRadius="full"
                minW="20px"
                h="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="bold"
                px={1}
                transform={isCartAnimating ? "scale(1.3)" : "scale(1)"}
                transition="transform 0.3s ease-in-out"
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