import { Flex, Box, VStack, HStack, Text, Button, Heading, Separator } from "@chakra-ui/react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <Flex minH="100vh" bg="bg.dim">
      {/* Sidebar */}
      <Box
        width="280px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        display={{ base: "none", md: "block" }}
      >
        <VStack gap={0} align="stretch" height="100vh">
          {/* Header del sidebar */}
          <Box p={6} borderBottom="1px solid" borderColor="gray.200">
            <VStack gap={2} align="start">
              <Heading size="md" color="brand.700">
                Admin Panel
              </Heading>
              <Text fontSize="sm" color="text.muted">
                Boutique Vicentinos
              </Text>
            </VStack>
          </Box>

          {/* Info del admin */}
          {admin && (
            <Box p={4} borderBottom="1px solid" borderColor="gray.200">
              <VStack gap={1} align="start">
                <Text fontSize="sm" fontWeight="semibold" color="text.primary">
                  {admin.name}
                </Text>
                <Text fontSize="xs" color="text.muted">
                  {admin.email}
                </Text>
              </VStack>
            </Box>
          )}

          {/* Navegación */}
          <VStack gap={2} align="stretch" p={4} flex="1">
            <Link to="/admin">
              <Button
                variant="ghost"
                justifyContent="start"
              >
                Productos
              </Button>
            </Link>
            <Link to="/admin/orders">
            <Button
              variant="ghost"
              justifyContent="start"
            >
              Pedidos
            </Button>
            </Link>
            <Link to="/">
              <Button
                variant="ghost"
                justifyContent="start"
              >
                Volver a la tienda
              </Button>
            </Link>
            <Box mt="auto" pt={4}>
              <Separator mb={4} />
              <Button
                variant="ghost"
                justifyContent="start"
                width="100%"
                color="red.500"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </VStack>
        </VStack>
      </Box>

      {/* Contenido principal */}
      <Box flex="1" overflow="auto">
        {/* Topbar para móvil */}
        <Box
          display={{ base: "block", md: "none" }}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          p={4}
        >
          <HStack justify="space-between">
            <Heading size="sm" color="brand.700">
              Admin Panel
            </Heading>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              Salir
            </Button>
          </HStack>
        </Box>

        {/* Contenido de la página */}
        <Box p={8}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};