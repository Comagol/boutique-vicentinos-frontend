import { Box, Container, Grid, Spinner, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "../../../components/ProductCard";
import { getProducts } from "../../../services/api";

export function CatalogPage() {
  // Usar React Query para obtener los productos
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="text.secondary">Cargando productos...</Text>
        </VStack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack gap={4}>
          <Text color="red.500" fontSize="lg">
            Error al cargar los productos
          </Text>
          <Text color="text.muted" fontSize="sm">
            {error instanceof Error ? error.message : "Error desconocido"}
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Box py={8} bg="bg.surface" minH="calc(100vh - 200px)">
      <Container maxW="1200px">
        <VStack gap={6} align="stretch">
          {/* Título */}
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="text.primary">
              Catálogo de Productos
            </Text>
            <Text color="text.secondary" fontSize="sm">
              {products.length} producto{products.length !== 1 ? "s" : ""} disponible
              {products.length !== 1 ? "s" : ""}
            </Text>
          </Box>

          {/* Grid de productos */}
          {products.length > 0 ? (
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={6}
            >
              {products
                .filter((product) => product.isActive)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </Grid>
          ) : (
            <VStack gap={4} py={12}>
              <Text color="text.muted" fontSize="lg">
                No hay productos disponibles
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}