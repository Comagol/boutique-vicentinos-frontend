import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Spinner,
  NativeSelect,
  Input,
  Container,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "../../../services/ordersService";
import { OrderTable } from "../components/OrderTable";
import type { OrderStatus } from "../../../types";

export function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener todas las órdenes
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-orders", selectedStatus],
    queryFn: () =>
      ordersService.getOrders(
        selectedStatus === "all" ? undefined : { status: selectedStatus }
      ),
  });

  // Filtrar por término de búsqueda (número de orden, email, nombre)
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const orderNumber = (order.orderNumber || "").toLowerCase();
    // El backend puede devolver 'customer' o 'customerInfo'
    const customer = order.customerInfo || (order as any).customer;
    const customerEmail = (customer?.email || "").toLowerCase();
    const customerName = (customer?.name || "").toLowerCase();
    
    return (
      orderNumber.includes(searchLower) ||
      customerEmail.includes(searchLower) ||
      customerName.includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <Container maxW="1400px" py={{ base: 4, md: 8 }}>
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="text.secondary">Cargando órdenes...</Text>
        </VStack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="1400px" py={{ base: 4, md: 8 }}>
        <VStack gap={4}>
          <Text color="red.500" fontSize={{ base: "md", md: "lg" }}>
            Error al cargar las órdenes
          </Text>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box>
      <VStack gap={{ base: 4, md: 6 }} align="stretch">
        {/* Header con título */}
        <Heading size={{ base: "lg", md: "xl" }} color="text.primary">
          Gestión de Pedidos
        </Heading>

        {/* Filtros y búsqueda */}
        <HStack gap={4} flexWrap="wrap" align={{ base: "stretch", md: "center" }}>
          <Box flex="1" minW={{ base: "100%", md: "200px" }}>
            <Input
              placeholder="Buscar por número, email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <Box minW={{ base: "100%", md: "200px" }}>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={selectedStatus}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setSelectedStatus(e.target.value as OrderStatus | "all");
                }}
              >
                <option value="all">Todos los estados</option>
                <option value="pending-payment">Pendiente de pago</option>
                <option value="payment-confirmed">Pago confirmado</option>
                <option value="delivered">Entregado</option>
                <option value="manually-canceled">Cancelado manualmente</option>
                <option value="cancelled-by-time">Cancelado por tiempo</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>
        </HStack>

        {/* Tabla de órdenes */}
        <OrderTable orders={filteredOrders} onRefresh={refetch} />
      </VStack>
    </Box>
  );
}