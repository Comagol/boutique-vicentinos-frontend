import { Flex, Box, VStack, HStack, Text, Button, Heading, Separator, Drawer, IconButton } from "@chakra-ui/react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <Flex height="100vh" bg="bg.dim" overflow="hidden">
      {/* Sidebar - Fijo y no scrolleable */}
      <Box
        width="280px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        display={{ base: "none", md: "block" }}
        position="fixed"
        left={0}
        top={0}
        height="100vh"
        overflowY="hidden"
        zIndex={10}
      >
        <VStack gap={0} align="stretch" height="100vh">
          {/* Header del sidebar */}
          <Box p={6} borderBottom="1px solid" borderColor="gray.200" flexShrink={0}>
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
            <Box p={4} borderBottom="1px solid" borderColor="gray.200" flexShrink={0}>
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
          <VStack gap={2} align="stretch" p={4} flex="1" overflowY="auto">
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

      {/* Contenido principal - Scrolleable */}
      <Box 
        flex="1" 
        marginLeft={{ base: 0, md: "280px" }}
        height="100vh"
        overflowY="auto"
        overflowX="hidden"
      >
        {/* Topbar para móvil */}
        <Box
          display={{ base: "block", md: "none" }}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          p={4}
          position="sticky"
          top={0}
          zIndex={100}
        >
          <HStack justify="space-between">
            <HStack gap={3}>
              <IconButton
                aria-label="Abrir menú"
                icon={<FiMenu />}
                variant="ghost"
                onClick={() => setIsDrawerOpen(true)}
              />
              <Heading size="sm" color="brand.700">
                Admin Panel
              </Heading>
            </HStack>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              Salir
            </Button>
          </HStack>
        </Box>

        {/* Contenido de la página */}
        <Box p={{ base: 4, md: 8 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Drawer para navegación móvil */}
      <Drawer.Root open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)} placement="start">
        <Drawer.Backdrop />
        <Drawer.Content>
          <Drawer.Header borderBottom="1px solid" borderColor="gray.200">
            <HStack justify="space-between" width="100%">
              <VStack align="start" gap={1}>
                <Heading size="md" color="brand.700">
                  Admin Panel
                </Heading>
                <Text fontSize="sm" color="text.muted">
                  Boutique Vicentinos
                </Text>
              </VStack>
              <IconButton
                aria-label="Cerrar menú"
                icon={<FiX />}
                variant="ghost"
                onClick={closeDrawer}
              />
            </HStack>
          </Drawer.Header>
          <Drawer.Body p={0}>
            <VStack gap={0} align="stretch">
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
              <VStack gap={2} align="stretch" p={4}>
                <Link to="/admin" onClick={closeDrawer}>
                  <Button variant="ghost" justifyContent="start" width="100%">
                    Productos
                  </Button>
                </Link>
                <Link to="/admin/orders" onClick={closeDrawer}>
                  <Button variant="ghost" justifyContent="start" width="100%">
                    Pedidos
                  </Button>
                </Link>
                <Link to="/" onClick={closeDrawer}>
                  <Button variant="ghost" justifyContent="start" width="100%">
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
                    onClick={() => {
                      closeDrawer();
                      handleLogout();
                    }}
                  >
                    Cerrar Sesión
                  </Button>
                </Box>
              </VStack>
            </VStack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Flex>
  );
};