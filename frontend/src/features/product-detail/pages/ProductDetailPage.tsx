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
  Flex,
  createToaster,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProductDetail } from "../useProductDetail";
import { useCartStore } from "../../../stores/cartStore";
import { CTAButton } from "../../../components/CTAButton";

const toast = createToaster({ placement: "top-end" });

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
  const availableColorsForSize = Array.from(
    new Set(
      stockArray
        .filter((s) => s.size === selectedSize)
        .map((s) => s.color)
        .filter((c): c is string => !!c)
    )
  );

  // Handler para agregar al carrito
  const handleAddToCart = () => {
    if (!product) return;

    // Validaciones
    if (!selectedSize) {
      toast.create({
        title: "Selecciona una talla",
        description: "Selecciona una talla para agregar el producto al carrito",
        type: "warning",
        duration: 2000,
      });
      return;
    }

    if (colorsArray.length > 0 && !selectedColor) {
      toast.create({
        title: "Selecciona un color",
        description: "Selecciona un color para agregar el producto al carrito",
        type: "warning",
        duration: 2000,
      });
      return;
    }

    if (availableStock < quantity) {
      toast.create({
        title: "Stock insuficiente",
        description: `Solo hay ${availableStock} disponible(s)`,
        type: "error",
        duration: 2000,
      });
      return;
    }

    // Agregar al carrito
    addItem(product, selectedSize, selectedColor || product.baseColor || "", quantity);

    toast.create({
        title: "Producto agregado al carrito",
        description: "Producto agregado al carrito correctamente",
        type: "success",
        duration: 2000,
      });
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
    <Box py={8} bg="bg.surface" minH="calc(100vh - 200px)">
      <Container maxW="1200px">
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1fr 1fr",
          }}
          gap={8}
        >
          {/* Columna izquierda: Imágenes */}
          <VStack gap={4} align="stretch">
            {/* Imagen principal */}
            <Box
              borderRadius="md"
              overflow="hidden"
              aspectRatio="1"
              bg="white"
              shadow="sm"
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
              <HStack gap={2} overflowX="auto">
                {imagesArray.map((img, index) => (
                  <Box
                    key={index}
                    borderRadius="md"
                    overflow="hidden"
                    width="80px"
                    height="80px"
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
          <VStack gap={6} align="stretch">
            {/* Nombre y badges */}
            <VStack align="start" gap={2}>
              <Text fontSize="3xl" fontWeight="bold" color="text.primary">
                {product.name}
              </Text>
              <HStack gap={2}>
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
              <HStack gap={2}>
                {hasDiscount && (
                  <Text
                    fontSize="lg"
                    color="text.muted"
                    textDecoration="line-through"
                  >
                    ${product.price.toLocaleString("es-AR")}
                  </Text>
                )}
                <Text fontSize="2xl" fontWeight="bold" color="brand.700">
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
                  {sizesArray.map((sizeObj) => (
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
                <Flex gap={2} align="center">
                  <Button
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Text minW="40px" textAlign="center">
                    {quantity}
                  </Text>
                  <Button
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(availableStock, quantity + 1))
                    }
                    disabled={quantity >= availableStock}
                  >
                    +
                  </Button>
                  <Text fontSize="sm" color="text.muted" ml="auto">
                    Máx: {availableStock}
                  </Text>
                </Flex>
              </VStack>
            )}

            <Box borderTop="1px solid" borderColor="gray.200" />

            {/* Botón agregar al carrito */}
            <CTAButton
              size="lg"
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