import { Box, Container, Heading, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ProductForm } from "../components/ProductForm";
import { productsService } from "../../../services/productService";
import { useQueryClient } from "@tanstack/react-query";
import { createToaster } from "@chakra-ui/react";

const toast = createToaster({ placement: "top-end" });

export function CreateProductPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (productData: any, images: File[]) => {
    setIsLoading(true);
    try {
      await productsService.createProduct(productData, images);
      
      toast.create({
        title: "¡Producto creado!",
        description: `"${productData.name}" ha sido creado exitosamente`,
        type: "success",
        duration: 3000,
      });

      // Invalidar cache para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      
      navigate("/admin");
    } catch (error) {
      toast.create({
        title: "Error al crear producto",
        description: error instanceof Error ? error.message : "Error desconocido",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Container maxW="1200px" py={8}>
        <VStack gap={6} align="stretch">
          <Heading size="xl" color="text.primary">
            Crear Nuevo Producto
          </Heading>
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin")}
            isLoading={isLoading}
            isEdit={false}
          />
        </VStack>
      </Container>
    </Box>
  );
}