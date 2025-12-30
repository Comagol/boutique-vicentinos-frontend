import {
  Box,
  Text,
  Image,
  Badge,
  HStack,
  IconButton,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { productsService } from "../../../services/productService";
import { toaster } from "../../../app/AppProvider";
import type { Product } from "../../../types";
import { FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { ProductCard } from "./ProductCard";

interface ProductTableProps {
  products: Product[];
  onRefresh: () => void;
}

export function ProductTable({ products, onRefresh }: ProductTableProps) {
  const navigate = useNavigate();
  // Mostrar cards en móvil y tablet, tabla solo en desktop (lg+)
  const showCards = useBreakpointValue({ base: true, lg: false });

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

  if (products.length === 0) {
    return (
      <Box bg="white" borderRadius="md" p={{ base: 4, md: 8 }} textAlign="center">
        <Text color="text.muted" fontSize={{ base: "sm", md: "md" }}>No hay productos disponibles</Text>
      </Box>
    );
  }

  // Vista móvil y tablet: Cards
  if (showCards) {
    return (
      <VStack gap={4} align="stretch">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onRefresh={onRefresh} />
        ))}
      </VStack>
    );
  }

  // Vista desktop (lg+): Tabla
  return (
    <Box bg="white" borderRadius="md" overflow="hidden" shadow="sm">
      <Box overflowX="auto">
        <Box as="table" width="100%" borderCollapse="collapse">
          <Box as="thead" bg="gray.50">
            <Box as="tr">
              <Box as="th" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }} textAlign="left" fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Imagen
              </Box>
              <Box as="th" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }} textAlign="left" fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Nombre
              </Box>
              <Box as="th" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }} textAlign="left" fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200" display={{ base: "none", lg: "table-cell" }}>
                Categoría
              </Box>
              <Box as="th" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }} textAlign="left" fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Precio
              </Box>
              <Box as="th" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }} textAlign="left" fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Stock
              </Box>
              <Box as="th" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }} textAlign="left" fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Estado
              </Box>
              <Box as="th" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }} textAlign="left" fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="text.primary" borderBottom="1px solid" borderColor="gray.200">
                Acciones
              </Box>
            </Box>
          </Box>
          <Box as="tbody">
            {products.map((product) => {
              // Asegurar que stock sea un array antes de usar reduce
              // Puede venir como string JSON desde el backend
              let stockArray: any[] = [];
              if (Array.isArray(product.stock)) {
                stockArray = product.stock;
              } else if (typeof product.stock === 'string') {
                try {
                  const parsed = JSON.parse(product.stock);
                  stockArray = Array.isArray(parsed) ? parsed : [];
                } catch (e) {
                  stockArray = [];
                }
              } else if (product.stock) {
                // Si es otro tipo de objeto, intentar convertirlo
                stockArray = [];
              }
              
              // Calcular total, asegurándonos de que quantity sea un número
              const totalStock = stockArray.reduce(
                (sum: number, s: any) => {
                  const quantity = typeof s.quantity === 'number' ? s.quantity : Number(s.quantity) || 0;
                  return sum + quantity;
                },
                0
              );
              const displayPrice = product.discountPrice || product.price;
              const imagesArray = Array.isArray(product.images) ? product.images : [];

              return (
                <Box
                  as="tr"
                  key={product.id}
                  _hover={{ bg: "gray.50" }}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                >
                  <Box as="td" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }}>
                    <Image
                      src={imagesArray[0] || "/placeholder.jpg"}
                      alt={product.name}
                      width={{ base: "40px", md: "60px" }}
                      height={{ base: "40px", md: "60px" }}
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </Box>
                  <Box as="td" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }}>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="semibold" fontSize={{ base: "xs", md: "sm" }}>{product.name}</Text>
                      {product.discountPrice && (
                        <Text fontSize="xs" color="text.muted">
                          ${product.price.toLocaleString("es-AR")}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                  <Box as="td" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }} display={{ base: "none", lg: "table-cell" }}>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="text.secondary">
                      {product.category}
                    </Text>
                  </Box>
                  <Box as="td" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }}>
                    <Text fontWeight="semibold" fontSize={{ base: "xs", md: "sm" }}>
                      ${displayPrice.toLocaleString("es-AR")}
                    </Text>
                  </Box>
                  <Box as="td" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }}>
                    <Badge
                      colorPalette={totalStock > 0 ? "green" : "red"}
                      borderRadius="md"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {totalStock} unidades
                    </Badge>
                  </Box>
                  <Box as="td" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }}>
                    <Badge
                      colorPalette={product.isActive ? "green" : "gray"}
                      borderRadius="md"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </Box>
                  <Box as="td" px={{ base: 2, md: 4 }} py={{ base: 2, md: 3 }}>
                    <HStack gap={1}>
                      <IconButton
                        aria-label="Ver/Editar"
                        size={{ base: "xs", md: "sm" }}
                        variant="ghost"
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                      >
                        <FiEdit />
                      </IconButton>
                      <IconButton
                        aria-label={
                          product.isActive ? "Desactivar" : "Activar"
                        }
                        size={{ base: "xs", md: "sm" }}
                        variant="ghost"
                        onClick={() => handleToggleActive(product)}
                      >
                        {product.isActive ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                      <IconButton
                        aria-label="Eliminar"
                        size={{ base: "xs", md: "sm" }}
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