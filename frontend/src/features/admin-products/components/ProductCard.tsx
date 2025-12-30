import {
  Box,
  Text,
  Image,
  Badge,
  HStack,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { productsService } from "../../../services/productService";
import { toaster } from "../../../app/AppProvider";
import type { Product } from "../../../types";
import { FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";

interface ProductCardProps {
  product: Product;
  onRefresh: () => void;
}

export function ProductCard({ product, onRefresh }: ProductCardProps) {
  const navigate = useNavigate();

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de eliminar permanentemente "${productName}"?`)) {
      return;
    }

    try {
      await productsService.deleteProduct(productId);
      toaster.create({
        title: "Producto eliminado",
        description: `"${productName}" ha sido eliminado permanentemente`,
        type: "success",
        duration: 2000,
      });
      onRefresh();
    } catch (error) {
      toaster.create({
        title: "Error al eliminar",
        description: "No se pudo eliminar el producto",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      if (product.isActive) {
        await productsService.deactivateProduct(product.id);
        toaster.create({
          title: "Producto desactivado",
          description: `"${product.name}" ya no se muestra en el catálogo`,
          type: "success",
          duration: 2000,
        });
      } else {
        await productsService.activateProduct(product.id);
        toaster.create({
          title: "Producto activado",
          description: `"${product.name}" ahora se muestra en el catálogo`,
          type: "success",
          duration: 2000,
        });
      }
      onRefresh();
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "No se pudo actualizar el estado del producto",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Calcular stock total
  let stockArray: any[] = [];
  if (Array.isArray(product.stock)) {
    stockArray = product.stock;
  } else if (typeof product.stock === "string") {
    try {
      const parsed = JSON.parse(product.stock);
      stockArray = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      stockArray = [];
    }
  }

  const totalStock = stockArray.reduce(
    (sum: number, s: any) => {
      const quantity = typeof s.quantity === "number" ? s.quantity : Number(s.quantity) || 0;
      return sum + quantity;
    },
    0
  );

  const displayPrice = product.discountPrice || product.price;
  const imagesArray = Array.isArray(product.images) ? product.images : [];

  return (
    <Box
      bg="white"
      borderRadius="md"
      p={{ base: 4, md: 5 }}
      shadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <HStack gap={{ base: 4, md: 5 }} align="start">
        {/* Imagen */}
        <Image
          src={imagesArray[0] || "/placeholder.jpg"}
          alt={product.name}
          width={{ base: "80px", md: "100px" }}
          height={{ base: "80px", md: "100px" }}
          objectFit="cover"
          borderRadius="md"
          flexShrink={0}
        />

        {/* Información */}
        <VStack align="start" gap={2} flex="1" minW={0}>
          <VStack align="start" gap={1} width="100%">
            <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }} lineClamp={2}>
              {product.name}
            </Text>
            <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted" textTransform="capitalize">
              {product.category}
            </Text>
          </VStack>

          <HStack gap={2} flexWrap="wrap" width="100%">
            <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
              ${displayPrice.toLocaleString("es-AR")}
            </Text>
            {product.discountPrice && (
              <Text fontSize={{ base: "xs", md: "sm" }} color="text.muted" textDecoration="line-through">
                ${product.price.toLocaleString("es-AR")}
              </Text>
            )}
          </HStack>

          <HStack gap={2} flexWrap="wrap" width="100%">
            <Badge
              colorPalette={totalStock > 0 ? "green" : "red"}
              borderRadius="md"
              fontSize={{ base: "xs", md: "sm" }}
            >
              {totalStock} unidades
            </Badge>
            <Badge
              colorPalette={product.isActive ? "green" : "gray"}
              borderRadius="md"
              fontSize={{ base: "xs", md: "sm" }}
            >
              {product.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </HStack>

          {/* Acciones */}
          <HStack gap={2} width="100%" flexWrap="wrap">
            <Button
              size={{ base: "sm", md: "md" }}
              variant="outline"
              onClick={() => navigate(`/admin/products/${product.id}`)}
              flex={{ base: "1", md: "none" }}
              minW={{ base: "100px", md: "auto" }}
            >
              <Icon as={FiEdit} mr={2} />
              Editar
            </Button>
            <Button
              size={{ base: "sm", md: "md" }}
              variant="outline"
              onClick={() => handleToggleActive(product)}
              flex={{ base: "1", md: "none" }}
              minW={{ base: "100px", md: "auto" }}
            >
              <Icon as={product.isActive ? FiEyeOff : FiEye} mr={2} />
              {product.isActive ? "Ocultar" : "Mostrar"}
            </Button>
            <Button
              size={{ base: "sm", md: "md" }}
              variant="outline"
              color="red.500"
              onClick={() => handleDelete(product.id, product.name)}
              flex={{ base: "1", md: "none" }}
              minW={{ base: "100px", md: "auto" }}
            >
              <Icon as={FiTrash2} mr={2} />
              Eliminar
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}

