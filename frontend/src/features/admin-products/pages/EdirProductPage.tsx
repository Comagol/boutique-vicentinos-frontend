import { Box, Container, Heading, VStack, Spinner, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductForm } from "../components/ProductForm";
import { productsService } from "../../../services/productService";
import { useQueryClient } from "@tanstack/react-query";
import { createToaster } from "@chakra-ui/react";

const toast = createToaster({ placement: "top-end" });

export function EditProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: product,
    isLoading: isLoadingProduct,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productsService.getProductById(productId!),
    enabled: !!productId,
  });

  const handleSubmit = async (productData: any, images: File[]) => {
    if (!productId) return;

    setIsLoading(true);
    try {
      await productsService.updateProduct(productId, productData, images);
      
      toast.create({
        title: "¡Producto actualizado!",
        description: `"${productData.name}" ha sido actualizado exitosamente`,
        type: "success",
        duration: 3000,
      });

      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      
      navigate("/admin");
    } catch (error) {
      toast.create({
        title: "Error al actualizar producto",
        description: error instanceof Error ? error.message : "Error desconocido",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="text.secondary">Cargando producto...</Text>
        </VStack>
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack gap={4}>
          <Text color="red.500" fontSize="lg">
            Producto no encontrado
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Box>
      <Container maxW="1200px" py={8}>
        <VStack gap={6} align="stretch">
          <Heading size="xl" color="text.primary">
            Editar Producto
          </Heading>
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin")}
            isLoading={isLoading}
            isEdit={true}
          />
        </VStack>
      </Container>
    </Box>
  );
}