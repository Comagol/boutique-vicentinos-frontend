import {
  Box,
  Container,
  Grid,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  NativeSelect,
  Spinner,
  Badge,
  Flex
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useProductDetail } from "../useProductDetail";
import { useCartStore } from "../../../stores/cartStore";
import { CTAButton } from "../../../components/CTAButton";
import { toaster } from "../../../app/AppProvider";

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  // Obtener el producto
  const {
    data: product,
    isLoading,
    isError,
  } = useProductDetail(productId || "");

  // Estado local para selecciones del usuario
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Store del carrito
  const addItem = useCartStore((state) => state.addItem);

  // Derivados de Variantes
  const variants = product?.variants || [];
  const imagesArray = product?.images || [];

  // 1. Colores disponibles (aquellos que tienen al menos una talla con stock)
  const availableColors = useMemo(() => {
    return variants
      .filter(v => v.sizes.some(s => s.quantity > 0))
      .map(v => v.color);
  }, [variants]);

  // 2. Tallas disponibles para el color seleccionado
  const sizesForSelectedColor = useMemo(() => {
    if (!selectedColor) return [];
    const variant = variants.find(v => v.color === selectedColor);
    return variant ? variant.sizes.filter(s => s.quantity > 0) : [];
  }, [selectedColor, variants]);

  // 3. Stock disponible para la combinación seleccionada
  const availableStock = useMemo(() => {
    if (!selectedColor || !selectedSize) return 0;
    const sizeObj = sizesForSelectedColor.find(s => s.size === selectedSize);
    return sizeObj ? sizeObj.quantity : 0;
  }, [selectedColor, selectedSize, sizesForSelectedColor]);

  // Handler para agregar al carrito
  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedColor) {
      toaster.create({ title: "Selecciona un color", type: "warning" });
      return;
    }

    if (!selectedSize) {
      toaster.create({ title: "Selecciona una talla", type: "warning" });
      return;
    }

    const success = addItem(product, selectedSize, selectedColor, quantity);

    if (success) {
      toaster.create({
        title: "Producto agregado",
        description: "Se añadió al carrito correctamente",
        type: "success",
      });
    } else {
      toaster.create({
        title: "Stock insuficiente",
        description: "No hay más stock disponible",
        type: "error",
      });
    }
  };

  if (isLoading) {
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
          <Text color="red.500" fontSize="lg">Producto no encontrado</Text>
          <Button onClick={() => navigate("/")}>Volver al catálogo</Button>
        </VStack>
      </Container>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <Box py={{ base: 4, md: 8 }} px={{ base: 4, md: 0 }} bg="bg.surface" minH="calc(100vh - 200px)">
      <Container maxW="1200px" px={{ base: 0, md: 4 }}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 6, md: 8 }}>
          
          {/* Columna Izquierda: Galería */}
          <VStack gap={4} align="center">
            <Box borderRadius="md" overflow="hidden" aspectRatio="1" bg="white" shadow="sm" w="100%" maxW="500px">
              <Image src={imagesArray[selectedImageIndex] || "/placeholder.jpg"} alt={product.name} w="100%" h="100%" objectFit="cover" />
            </Box>
            
            {imagesArray.length > 1 && (
              <HStack gap={2} overflowX="auto" w="100%" maxW="500px" pb={2}>
                {imagesArray.map((img, index) => (
                  <Box 
                    key={index} 
                    w="80px" h="80px" borderRadius="md" overflow="hidden" flexShrink={0} cursor="pointer"
                    border={selectedImageIndex === index ? "2px solid" : "1px solid"}
                    borderColor={selectedImageIndex === index ? "brand.500" : "gray.200"}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image src={img} w="100%" h="100%" objectFit="cover" />
                  </Box>
                ))}
              </HStack>
            )}
          </VStack>

          {/* Columna Derecha: Info */}
          <VStack gap={6} align="stretch">
            <VStack align="start" gap={2}>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.800">{product.name}</Text>
              <HStack gap={2}>
                <Badge colorPalette="brand" variant="solid">{product.category.replace("-", " ").toUpperCase()}</Badge>
                {hasDiscount && <Badge colorPalette="red">OFERTA</Badge>}
              </HStack>
            </VStack>

            <HStack gap={4} align="baseline">
              <Text fontSize="3xl" fontWeight="extrabold" color="brand.600">${displayPrice.toLocaleString("es-AR")}</Text>
              {hasDiscount && (
                <Text fontSize="lg" color="gray.400" textDecoration="line-through">${product.price.toLocaleString("es-AR")}</Text>
              )}
            </HStack>

            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={2}>DESCRIPCIÓN</Text>
              <Text color="gray.600" whiteSpace="pre-line">{product.description}</Text>
            </Box>

            <Box borderTop="1px solid" borderColor="gray.100" pt={6} />

            {/* Selectores */}
            <VStack gap={4} align="stretch">
              <VStack align="start" gap={2}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">COLOR</Text>
                <NativeSelect.Root>
                  <NativeSelect.Field 
                    value={selectedColor} 
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      setSelectedSize(""); // Reset size al cambiar color
                      setQuantity(1);
                    }}
                  >
                    <option value="">Selecciona un color</option>
                    {availableColors.map(color => <option key={color} value={color}>{color.toUpperCase()}</option>)}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </VStack>

              <VStack align="start" gap={2} opacity={!selectedColor ? 0.5 : 1} pointerEvents={!selectedColor ? "none" : "auto"}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">TALLA</Text>
                <NativeSelect.Root>
                  <NativeSelect.Field 
                    value={selectedSize} 
                    onChange={(e) => {
                      setSelectedSize(e.target.value);
                      setQuantity(1);
                    }}
                  >
                    <option value="">Selecciona una talla</option>
                    {sizesForSelectedColor.map(s => <option key={s.size} value={s.size}>{s.size.toUpperCase()} ({s.quantity} disponibles)</option>)}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </VStack>

              {selectedSize && (
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">CANTIDAD</Text>
                  <HStack bg="gray.50" borderRadius="full" p={1} border="1px solid" borderColor="gray.200">
                    <Button size="sm" variant="ghost" rounded="full" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</Button>
                    <Text fontSize="md" minW="40px" textAlign="center" fontWeight="bold">{quantity}</Text>
                    <Button size="sm" variant="ghost" rounded="full" onClick={() => setQuantity(Math.min(availableStock, quantity + 1))} disabled={quantity >= availableStock}>+</Button>
                  </HStack>
                </VStack>
              )}
            </VStack>

            <CTAButton
              size="xl"
              w="100%"
              onClick={handleAddToCart}
              disabled={!product.isActive || !selectedSize || availableStock === 0}
              mt={4}
            >
              {!product.isActive ? "NO DISPONIBLE" : availableStock === 0 ? "SIN STOCK" : "AGREGAR AL CARRITO"}
            </CTAButton>
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
}
