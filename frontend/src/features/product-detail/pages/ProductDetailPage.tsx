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
import { useState } from "react";
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
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Store del carrito
  const addItem = useCartStore((state) => state.addItem);

  // Asegurar que los arrays sean arrays válidos
  const stockArray = product && Array.isArray(product.stock) ? product.stock : [];
  const colorsArray = product && Array.isArray(product.colors) ? product.colors : [];
  const imagesArray = product && Array.isArray(product.images) ? product.images : [];
  const sizesArray = product && Array.isArray(product.sizes) ? product.sizes : [];

  // Calcular stock disponible para la talla/color seleccionados
  const availableStock = stockArray
    .filter(
      (s) =>
        s.size === selectedSize &&
        (selectedColor ? s.color === selectedColor : true)
    )
    .reduce((sum, s) => sum + s.quantity, 0);

  // Obtener colores disponibles para la talla seleccionada
  const availableColorsForSize = selectedSize 
    ? Array.from(
      new Set(
        stockArray
          .filter((s) => {
            const sizeMatch = String(s.size || "").trim() === String(selectedSize || "").trim();
            const quantity = typeof s.quantity === "number" ? s.quantity : Number(s.quantity) || 0;
            return sizeMatch && quantity > 0;
          })
          .map((s) => s.color)
          .filter((c): c is string => !!c)
      )
    )
    : [];

// Obtener talles disponibles: solo los que tienen stock en al menos un color
const availableSizes = sizesArray.filter((sizeObj) => {
  // Verificar si hay stock en al menos un color para esta talla
  return stockArray.some((s) => {
    // Normalizar comparación de strings (trim y case-insensitive si es necesario)
    const sizeMatch = String(s.size || "").trim() === String(sizeObj.size || "").trim();
    
    // Asegurar que quantity sea un número y mayor a 0
    const quantity = typeof s.quantity === "number" ? s.quantity : Number(s.quantity) || 0;
    
    return sizeMatch && quantity > 0;
  });
});

  // Handler para agregar al carrito
  const handleAddToCart = () => {
    if (!product) return;

    // Validaciones
    if (!selectedSize) {
      toaster.create({
        title: "Selecciona una talla",
        description: "Selecciona una talla para agregar el producto al carrito",
        type: "warning",
        duration: 2000,
      });
      return;
    }

    if (colorsArray.length > 0 && !selectedColor) {
      toaster.create({
        title: "Selecciona un color",
        description: "Selecciona un color para agregar el producto al carrito",
        type: "warning",
        duration: 2000,
      });
      return;
    }

    if (availableStock < quantity) {
      toaster.create({
        title: "Stock insuficiente",
        description: `Solo hay ${availableStock} disponible(s)`,
        type: "error",
        duration: 2000,
      });
      return;
    }

    // Agregar al carrito
    const success = addItem(product, selectedSize, selectedColor || product.baseColor || "", quantity);

    if (success) {
      toaster.create({
        title: "Producto agregado",
        description: "El producto se añadió al carrito correctamente",
        type: "success",
        duration: 2000,
      });
    } else {
      toaster.create({
        title: "Stock insuficiente",
        description: "No hay suficiente stock disponible para la cantidad seleccionada",
        type: "error",
        duration: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="1200px" py={{ base: 4, md: 8 }} px={{ base: 4, md: 4 }}>
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="text.secondary">Cargando producto...</Text>
        </VStack>
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container maxW="1200px" py={{ base: 4, md: 8 }} px={{ base: 4, md: 4 }}>
        <VStack gap={4}>
          <Text color="red.500" fontSize="lg">
            Producto no encontrado
          </Text>
          <Button onClick={() => navigate("/")}>Volver al catálogo</Button>
        </VStack>
      </Container>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <Box 
      py={{ base: 4, md: 8 }} 
      px={{ base: 4, md: 0 }}
      bg="bg.surface" 
      minH="calc(100vh - 200px)"
    >
      <Container maxW="1200px" px={{ base: 0, md: 4 }}>
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1fr 1fr",
          }}
          gap={{ base: 6, md: 8 }}
        >
          {/* Columna izquierda: Imágenes */}
          <VStack gap={{ base: 3, md: 4 }} align="center" justify="flex-start">
            {/* Imagen principal */}
            <Box
              borderRadius="md"
              overflow="hidden"
              aspectRatio="1"
              bg="white"
              shadow="sm"
              width={{ base: "85%", sm: "75%", md: "100%" }}
              maxW={{ base: "350px", sm: "400px", md: "500px" }}
              mx="auto"
            >
              <Image
                src={imagesArray[selectedImageIndex] || "/placeholder.jpg"}
                alt={product.name}
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </Box>

            {/* Galería de miniaturas (si hay más de una imagen) */}
            {imagesArray.length > 1 && (
              <HStack 
                gap={2} 
                overflowX="auto" 
                width={{ base: "85%", sm: "75%", md: "100%" }}
                maxW={{ base: "350px", sm: "400px", md: "500px" }}
                mx="auto"
                pb={2}
                css={{
                  "&::-webkit-scrollbar": {
                    height: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#cbd5e0",
                    borderRadius: "3px",
                  },
                }}
              >
                {imagesArray.map((img, index) => (
                  <Box
                    key={index}
                    borderRadius="md"
                    overflow="hidden"
                    width={{ base: "60px", sm: "65px", md: "80px" }}
                    height={{ base: "60px", sm: "65px", md: "80px" }}
                    flexShrink={0}
                    cursor="pointer"
                    border={
                      selectedImageIndex === index
                        ? "2px solid"
                        : "1px solid"
                    }
                    borderColor={
                      selectedImageIndex === index ? "brand.500" : "gray.200"
                    }
                    onClick={() => setSelectedImageIndex(index)}
                    transition="all 0.2s ease"
                    _hover={{
                      borderColor: "brand.300",
                      transform: "scale(1.05)",
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                ))}
              </HStack>
            )}
          </VStack>

          {/* Columna derecha: Información y selectores */}
          <VStack gap={{ base: 4, md: 6 }} align="stretch">
            {/* Nombre y badges */}
            <VStack align="start" gap={2}>
              <Text 
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold" 
                color="text.primary"
                textAlign="left"
                css={{
                  verticalAlign: "middle",
                  boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.15)",
                }}
              >
                {product.name}
              </Text>
              <HStack 
                gap={2} 
                flexWrap="wrap"
                align="start"
              >
                {hasDiscount && (
                  <Badge colorPalette="red" borderRadius="md">
                    Descuento
                  </Badge>
                )}
                {!product.isActive && (
                  <Badge colorPalette="gray">No disponible</Badge>
                )}
                {availableStock > 0 && (
                  <Badge colorPalette="green">
                    {availableStock} disponible{availableStock !== 1 ? "s" : ""}
                  </Badge>
                )}
              </HStack>
            </VStack>

            <Box borderTop="1px solid" borderColor="gray.200" />

            {/* Precio */}
            <VStack align="start" gap={1}>
              <HStack gap={2} flexWrap="wrap">
                {hasDiscount && (
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color="text.muted"
                    textDecoration="line-through"
                  >
                    ${product.price.toLocaleString("es-AR")}
                  </Text>
                )}
                <Text 
                  fontSize={{ base: "xl", md: "2xl" }} 
                  fontWeight="bold" 
                  color="brand.700"
                >
                  ${displayPrice.toLocaleString("es-AR")}
                </Text>
              </HStack>
            </VStack>

            {/* Descripción */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Descripción
              </Text>
              <Text color="text.secondary" whiteSpace="pre-line">
                {product.description}
              </Text>
            </Box>

            <Box borderTop="1px solid" borderColor="gray.200" />

            {/* Selector de talla */}
            <VStack align="stretch" gap={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Talla {selectedSize && `(${selectedSize})`}
              </Text>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={selectedSize}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const value = e.target.value;
                    setSelectedSize(value);
                    setSelectedColor(""); // Reset color al cambiar talla
                    setQuantity(1); // Reset cantidad
                  }}
                >
                  <option value="">Selecciona una talla</option>
                  {availableSizes.map((sizeObj) => (
                    <option key={sizeObj.size} value={sizeObj.size}>
                      {sizeObj.size} ({sizeObj.type})
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </VStack>

            {/* Selector de color (solo si hay colores) */}
            {colorsArray.length > 0 && (
              <VStack align="stretch" gap={2}>
                <Text fontSize="sm" fontWeight="semibold">
                  Color {selectedColor && `(${selectedColor})`}
                </Text>
                <Box opacity={!selectedSize ? 0.5 : 1} pointerEvents={!selectedSize ? "none" : "auto"}>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={selectedColor}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        if (!selectedSize) return;
                        const value = e.target.value;
                        setSelectedColor(value);
                        setQuantity(1); // Reset cantidad
                      }}
                    >
                      <option value="">Selecciona un color</option>
                      {availableColorsForSize.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Box>
              </VStack>
            )}

            {/* Selector de cantidad */}
            {selectedSize && (
              <VStack align="stretch" gap={2}>
                <Text fontSize="sm" fontWeight="semibold">
                  Cantidad
                </Text>
                <Flex 
                  gap={2} 
                  align="center"
                  flexWrap="wrap"
                >
                  <Button
                    size={{ base: "md", md: "sm" }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Text 
                    minW={{ base: "50px", md: "40px" }} 
                    textAlign="center"
                    fontSize={{ base: "md", md: "sm" }}
                  >
                    {quantity}
                  </Text>
                  <Button
                    size={{ base: "md", md: "sm" }}
                    onClick={() =>
                      setQuantity(Math.min(availableStock, quantity + 1))
                    }
                    disabled={quantity >= availableStock}
                  >
                    +
                  </Button>
                  <Text 
                    fontSize="sm" 
                    color="text.muted" 
                    ml={{ base: 0, md: "auto" }}
                    width={{ base: "100%", md: "auto" }}
                    textAlign={{ base: "left", md: "right" }}
                  >
                    Máx: {availableStock}
                  </Text>
                </Flex>
              </VStack>
            )}

            <Box borderTop="1px solid" borderColor="gray.200" />

            {/* Botón agregar al carrito */}
            <CTAButton
              size={{ base: "md", md: "lg" }}
              width="100%"
              onClick={handleAddToCart}
              disabled={
                !product.isActive ||
                !selectedSize ||
                availableStock === 0 ||
                (colorsArray.length > 0 && !selectedColor)
              }
            >
              {!product.isActive
                ? "Producto no disponible"
                : availableStock === 0
                ? "Sin stock"
                : "Agregar al carrito"}
            </CTAButton>
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
}