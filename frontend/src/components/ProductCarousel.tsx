import {
  Box,
  Container,
  HStack,
  VStack,
  Image,
  Text,
  IconButton,
  Flex,
  Badge,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Product } from "../types";

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determinar cuántos productos mostrar según el tamaño de pantalla
  const itemsPerView = useBreakpointValue({
    base: 1, // móvil: 1 producto
    md: 2, // tablet: 2 productos
    lg: 3, // desktop: 3 productos
  }) || 1;

  // Calcular el número máximo de slides
  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Función para avanzar al siguiente slide
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0; // Volver al inicio
      }
      return prev + 1;
    });
  };

  // Función para retroceder al slide anterior
  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return maxIndex; // Ir al final
      }
      return prev - 1;
    });
  };

  // Función para ir a un slide específico
  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Auto-play: avanzar automáticamente cada 5 segundos
  useEffect(() => {
    if (products.length <= itemsPerView || isPaused) {
      // Si hay menos productos que los que se muestran o está pausado, no hacer auto-play
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0; // Volver al inicio
        }
        return prev + 1;
      });
    }, 3000); // 3 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, products.length, itemsPerView, maxIndex]);

  // Manejar click en un producto
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Si no hay productos o hay muy pocos, no mostrar el carrusel
  if (!products || products.length === 0) {
    return null;
  }

  // Si hay menos productos que los que se muestran, mostrar todos sin carrusel
  if (products.length <= itemsPerView) {
    return (
      <Box py={8} bg="bg.surface" borderBottom="1px solid" borderColor="gray.200">
        <Container maxW="1200px">
          <VStack gap={4}>
            <Text fontSize="xl" fontWeight="bold" color="text.primary">
              Productos en Oferta
            </Text>
            <HStack gap={4} width="100%" justify="center" flexWrap="wrap">
              {products.map((product) => {
                const displayPrice = product.discountPrice || product.price;
                const originalPrice = product.price;
                const discountPercent = product.discountPrice
                  ? Math.round(((originalPrice - product.discountPrice) / originalPrice) * 100)
                  : 0;

                return (
                  <Box
                    key={product.id}
                    position="relative"
                    width={{ base: "100%", md: "calc(50% - 8px)", lg: "calc(33.333% - 11px)" }}
                    maxW="350px"
                    borderRadius="md"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => handleProductClick(product.id)}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "lg",
                    }}
                  >
                    <Box position="relative" width="100%" aspectRatio="1" overflow="hidden">
                      <Image
                        src={product.images[0] || "/placeholder-image.jpg"}
                        alt={product.name}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                      {discountPercent > 0 && (
                        <Badge
                          position="absolute"
                          top="2"
                          right="2"
                          colorPalette="red"
                          borderRadius="md"
                          fontSize="sm"
                          px={2}
                          py={1}
                        >
                          -{discountPercent}%
                        </Badge>
                      )}
                      <Box
                        position="absolute"
                        bottom="0"
                        left="0"
                        right="0"
                        bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                        p={4}
                        color="white"
                      >
                        <Text fontWeight="bold" fontSize="lg" mb={1}>
                          {product.name}
                        </Text>
                        <HStack gap={2}>
                          {product.discountPrice && (
                            <Text fontSize="sm" textDecoration="line-through" opacity={0.7}>
                              ${originalPrice.toLocaleString("es-AR")}
                            </Text>
                          )}
                          <Text fontWeight="bold" fontSize="xl">
                            ${displayPrice.toLocaleString("es-AR")}
                          </Text>
                        </HStack>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </HStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      py={8}
      bg="bg.surface"
      borderBottom="1px solid"
      borderColor="gray.200"
      position="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Container maxW="1200px">
        <VStack gap={6} align="stretch">
          {/* Título */}
          <Text fontSize="xl" fontWeight="bold" color="text.primary" textAlign="center">
            Productos en Oferta
          </Text>

          {/* Carrusel */}
          <Box position="relative" width="100%">
            {/* Botón izquierdo */}
            {maxIndex > 0 && (
              <IconButton
                aria-label="Producto anterior"
                position="absolute"
                left={{ base: 2, md: -4 }}
                top="50%"
                transform="translateY(-50%)"
                zIndex={10}
                borderRadius="full"
                bg="white"
                color="brand.700"
                shadow="lg"
                _hover={{
                  bg: "brand.500",
                  color: "white",
                }}
                onClick={() => {
                  prevSlide();
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 3000); // Reanudar después de 3 segundos
                }}
              >
                <FaChevronLeft />
              </IconButton>
            )}

            {/* Contenedor de productos */}
            <Box
              overflow="hidden"
              width="100%"
              position="relative"
              px={{ base: 8, md: 12 }}
            >
              <Flex
                gap={4}
                transition="transform 0.5s ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {products.map((product) => {
                  const displayPrice = product.discountPrice || product.price;
                  const originalPrice = product.price;
                  const discountPercent = product.discountPrice
                    ? Math.round(((originalPrice - product.discountPrice) / originalPrice) * 100)
                    : 0;

                  return (
                    <Box
                      key={product.id}
                      flexShrink={0}
                      width={`${100 / itemsPerView}%`}
                      position="relative"
                      borderRadius="md"
                      overflow="hidden"
                      cursor="pointer"
                      onClick={() => handleProductClick(product.id)}
                      transition="all 0.3s ease"
                      _hover={{
                        transform: "translateY(-4px)",
                        shadow: "lg",
                      }}
                    >
                      <Box position="relative" width="100%" aspectRatio="1" overflow="hidden">
                        <Image
                          src={product.images[0] || "/placeholder-image.jpg"}
                          alt={product.name}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                        />
                        {discountPercent > 0 && (
                          <Badge
                            position="absolute"
                            top="2"
                            right="2"
                            colorPalette="red"
                            borderRadius="md"
                            fontSize="sm"
                            px={2}
                            py={1}
                          >
                            -{discountPercent}%
                          </Badge>
                        )}
                        <Box
                          position="absolute"
                          bottom="0"
                          left="0"
                          right="0"
                          bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                          p={4}
                          color="white"
                        >
                          <Text fontWeight="bold" fontSize="lg" mb={1} lineClamp={2}>
                            {product.name}
                          </Text>
                          <HStack gap={2} flexWrap="wrap">
                            {product.discountPrice && (
                              <Text fontSize="sm" textDecoration="line-through" opacity={0.7}>
                                ${originalPrice.toLocaleString("es-AR")}
                              </Text>
                            )}
                            <Text fontWeight="bold" fontSize="xl">
                              ${displayPrice.toLocaleString("es-AR")}
                            </Text>
                          </HStack>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Flex>
            </Box>

            {/* Botón derecho */}
            {maxIndex > 0 && (
              <IconButton
                aria-label="Siguiente producto"
                position="absolute"
                right={{ base: 2, md: -4 }}
                top="50%"
                transform="translateY(-50%)"
                zIndex={10}
                borderRadius="full"
                bg="white"
                color="brand.700"
                shadow="lg"
                _hover={{
                  bg: "brand.500",
                  color: "white",
                }}
                onClick={() => {
                  nextSlide();
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 3000); // Reanudar después de 3 segundos
                }}
              >
                <FaChevronRight />
              </IconButton>
            )}
          </Box>

          {/* Indicadores de puntos */}
          {maxIndex > 0 && (
            <Flex justify="center" gap={2} mt={2}>
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <Box
                  key={index}
                  width="10px"
                  height="10px"
                  borderRadius="full"
                  bg={currentIndex === index ? "brand.500" : "gray.300"}
                  cursor="pointer"
                  transition="all 0.2s ease"
                  _hover={{
                    bg: currentIndex === index ? "brand.700" : "gray.400",
                  }}
                  onClick={() => {
                    goToSlide(index);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 3000);
                  }}
                />
              ))}
            </Flex>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

