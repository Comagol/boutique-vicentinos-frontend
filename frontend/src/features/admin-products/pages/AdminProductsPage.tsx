import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Spinner,
  NativeSelect,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { productsService } from "../../../services/productService";
import { ProductTable } from "../components/ProductTable";
import type { ProductCategory } from "../../../types";
import { CTAButton } from "../../../components/CTAButton";

export function AdminProductsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener todos los productos (incluye desactivados)
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-products", selectedCategory],
    queryFn: () =>
      selectedCategory === "all"
        ? productsService.getAllProducts()
        : productsService.getAllProducts(selectedCategory),
  });

  // Filtrar por término de búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container maxW="1400px" py={8}>
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="text.secondary">Cargando productos...</Text>
        </VStack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="1400px" py={8}>
        <VStack gap={4}>
          <Text color="red.500" fontSize="lg">
            Error al cargar los productos
          </Text>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box>
      <VStack gap={6} align="stretch">
        {/* Header con título y botón crear */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Heading size="xl" color="text.primary">
            Gestión de Productos
          </Heading>
          <CTAButton onClick={() => navigate("/admin/products/new")}>
            + Crear Producto
          </CTAButton>
        </HStack>

        {/* Filtros y búsqueda */}
        <HStack gap={4} flexWrap="wrap">
          <Box flex="1" minW="200px">
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <Box minW="200px">
            <NativeSelect.Root>
              <NativeSelect.Field
                value={selectedCategory}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setSelectedCategory(e.target.value as ProductCategory | "all");
                }}
              >
                <option value="all">Todas las categorías</option>
                <option value="camisetas-rugby">Camisetas Rugby</option>
                <option value="camisetas-hockey">Camisetas Hockey</option>
                <option value="shorts-rugby">Shorts Rugby</option>
                <option value="polleras-hockey">Polleras Hockey</option>
                <option value="medias-rugby">Medias Rugby</option>
                <option value="medias-hockey">Medias Hockey</option>
                <option value="pantalones">Pantalones</option>
                <option value="shorts">Shorts</option>
                <option value="buzos">Buzos</option>
                <option value="gorras">Gorras</option>
                <option value="camperas">Camperas</option>
                <option value="camperon">Camperón</option>
                <option value="bolsos">Bolsos</option>
                <option value="gorros">Gorros</option>
                <option value="otros">Otros</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>
        </HStack>

        {/* Tabla de productos */}
        <ProductTable
          products={filteredProducts}
          onRefresh={refetch}
        />
      </VStack>
    </Box>
  );
}