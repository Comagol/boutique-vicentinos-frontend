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
import { useCartStore, selectCartCount } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toaster } from "../app/AppProvider";
import { useState, useEffect } from "react";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const itemCount = useCartStore(selectCartCount);
  const items = useCartStore((s) => s.items);
  const isCartOpen = useCartStore((s) => s.isDrawerOpen);
  const setIsCartOpen = useCartStore((s) => s.setDrawerOpen);
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
    setIsCartOpen(true);
  };

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const admin = useAuthStore((state) => state.admin);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  const userName = role === "admin" ? admin?.name : user?.name;

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
              {!isAuthenticated ? (
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
              ) : (
                <>
                  <Text color="white" fontSize="sm" fontWeight="medium">
                    Hola, {userName || "Usuario"}
                  </Text>
                  <Button
                    variant="ghost"
                    color="white"
                    onClick={() => {
                      logout();
                      navigate("/");
                      toaster.create({
                        title: "Sesión cerrada",
                        description: "Has cerrado sesión correctamente",
                        type: "success",
                        duration: 2000,
                      });
                    }}
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
                    Cerrar Sesión
                  </Button>
                </>
              )}
            </>
          )}

          {/* Mobile Auth Button - Shows user icon on mobile */}
          {isMobile && (
            <>
              {!isAuthenticated ? (
                <IconButton
                  aria-label="Iniciar sesión"
                  variant="ghost"
                  color="white"
                  onClick={() => navigate("/login")}
                  _hover={{
                    bg: "whiteAlpha.200",
                    color: "brand.100",
                  }}
                >
                  <Icon as={FaUser} boxSize={5} />
                </IconButton>
              ) : (
                <HStack gap={2}>
                  <Text color="white" fontSize="xs" fontWeight="medium">
                    Hola, {userName || "Usuario"}
                  </Text>
                  <Button
                    variant="ghost"
                    color="white"
                    size="sm"
                    onClick={() => {
                      logout();
                      navigate("/");
                      toaster.create({
                        title: "Sesión cerrada",
                        description: "Has cerrado sesión correctamente",
                        type: "success",
                        duration: 2000,
                      });
                    }}
                    _hover={{
                      bg: "whiteAlpha.200",
                      color: "brand.100",
                    }}
                    fontSize="xs"
                  >
                    Salir
                  </Button>
                </HStack>
              )}
            </>
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
      <CartDrawer open={isCartOpen} onOpenChange={(e) => setIsCartOpen(e.open)} />
    </Box>
  );
}