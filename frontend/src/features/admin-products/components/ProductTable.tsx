import {
  Box,
  Text,
  Image,
  Badge,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { productsService } from "../../../services/productService";
import { createToaster } from "@chakra-ui/react";
import type { Product } from "../../../types";
import { FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";

const toast = createToaster({ placement: "top-end" });

interface ProductTableProps {
  products: Product[];
  onRefresh: () => void;
}

export function ProductTable({ products, onRefresh }: ProductTableProps) {
  const navigate = useNavigate();

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de eliminar permanentemente "${productName}"?`)) {
      return;
    }

    try {
      await productsService.deleteProduct(productId);
      toast.create({
        title: "Producto eliminado",
        description: `"${productName}" ha sido eliminado permanentemente`,
        type: "success",
        duration: 2000,
      });
      onRefresh();
    } catch (error) {
      toast.create({
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
        toast.create({
          title: "Producto desactivado",
          description: `"${product.name}" ya no se muestra en el catálogo`,
          type: "success",
          duration: 2000,
        });
      } else {
        await productsService.activateProduct(product.id);
        toast.create({
          title: "Producto activado",
          description: `"${product.name}" ahora se muestra en el catálogo`,
          type: "success",
          duration: 2000,
        });
      }
      onRefresh();
    } catch (error) {
      toast.create({
        title: "Error",
        description: "No se pudo actualizar el estado del producto",
        type: "error",
        duration: 3000,
      });
    }
  };

  if (products.length === 0) {
    return (
      <Box bg="white" borderRadius="md" p={8} textAlign="center">
        <Text color="text.muted">No hay productos disponibles</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="md" overflow="hidden" shadow="sm">
      <Box overflowX="auto">
        <Box as="table" width="100%" borderCollapse="collapse">
          <Box as="thead" bg="gray.50">
            <Box as="tr">
              <Box as="th" px={4} py={3} textAlign="left" fontSize="sm" fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Imagen
              </Box>
              <Box as="th" px={4} py={3} textAlign="left" fontSize="sm" fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Nombre
              </Box>
              <Box as="th" px={4} py={3} textAlign="left" fontSize="sm" fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Categoría
              </Box>
              <Box as="th" px={4} py={3} textAlign="left" fontSize="sm" fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Precio
              </Box>
              <Box as="th" px={4} py={3} textAlign="left" fontSize="sm" fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Stock
              </Box>
              <Box as="th" px={4} py={3} textAlign="left" fontSize="sm" fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Estado
              </Box>
              <Box as="th" px={4} py={3} textAlign="left" fontSize="sm" fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Acciones
              </Box>
            </Box>
          </Box>
          <Box as="tbody">
            {products.map((product) => {
              const totalStock = product.stock.reduce(
                (sum, s) => sum + s.quantity,
                0
              );
              const displayPrice = product.discountPrice || product.price;

              return (
                <Box
                  as="tr"
                  key={product.id}
                  _hover={{ bg: "gray.50" }}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                >
                  <Box as="td" px={4} py={3}>
                    <Image
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.name}
                      width="60px"
                      height="60px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="semibold">{product.name}</Text>
                      {product.discountPrice && (
                        <Text fontSize="xs" color="text.muted">
                          ${product.price.toLocaleString("es-AR")}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <Text fontSize="sm" color="text.secondary">
                      {product.category}
                    </Text>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <Text fontWeight="semibold">
                      ${displayPrice.toLocaleString("es-AR")}
                    </Text>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <Badge
                      colorPalette={totalStock > 0 ? "green" : "red"}
                      borderRadius="md"
                    >
                      {totalStock} unidades
                    </Badge>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <Badge
                      colorPalette={product.isActive ? "green" : "gray"}
                      borderRadius="md"
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </Box>
                  <Box as="td" px={4} py={3}>
                    <HStack gap={2}>
                      <IconButton
                        aria-label="Ver/Editar"
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                      >
                        <FiEdit />
                      </IconButton>
                      <IconButton
                        aria-label={
                          product.isActive ? "Desactivar" : "Activar"
                        }
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(product)}
                      >
                        {product.isActive ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                      <IconButton
                        aria-label="Eliminar"
                        size="sm"
                        variant="ghost"
                        color="red.500"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </HStack>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}