import { Box, Image, VStack, Text, HStack, Badge } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { CTAButton } from "./CTAButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  // calculo los precios a mostrar (descuento o precio regular)
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Box
      bg="white"
      borderRadius="md"
      overflow="hidden"
      shadow="sm"
      transition="all 200ms ease"
      cursor="pointer"
      onClick={handleCardClick}
      _hover={{
        shadow: "md",
        transform: "translateY(-4px)",
      }}
    >
      {/* Imagen del producto */}
      <Box position="relative" width="100%" aspectRatio="1" overflow="hidden">
        <Image
          src={product.images[0] || "/placeholder-image.jpg"}
          alt={product.name}
          width="100%"
          height="100%"
          objectFit="cover"
        />
        {/* Badge de descuento */}
        {hasDiscount && (
          <Badge
            position="absolute"
            top="2"
            right="2"
            colorPalette="red"
            borderRadius="md"
          >
            -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
          </Badge>
        )}
        {/* Badge si está inactivo */}
        {!product.isActive && (
          <Box
            position="absolute"
            inset="0"
            bg="blackAlpha.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Badge colorPalette="gray">No disponible</Badge>
          </Box>
        )}
      </Box>

      {/* Información del producto */}
      <VStack p={4} gap={2} align="stretch">
        <Text fontWeight="semibold" fontSize="lg" maxW="100%" overflow="hidden" textOverflow="ellipsis" whiteSpace="normal">
          {product.name}
        </Text>

        {/* Precio */}
        <HStack gap={2}>
          {hasDiscount && (
            <Text
              fontSize="sm"
              color="text.muted"
              textDecoration="line-through"
            >
              ${product.price.toLocaleString("es-AR")}
            </Text>
          )}
          <Text fontWeight="bold" fontSize="xl" color="brand.700">
            ${displayPrice.toLocaleString("es-AR")}
          </Text>
        </HStack>

        {/* Botón de acción */}
        <Box onClick={(e) => e.stopPropagation()}>
          <CTAButton
            size="sm"
            width="100%"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            disabled={!product.isActive || product.stock.length === 0}
          >
            {product.isActive && product.stock.length > 0
              ? "Ver Detalle"
              : "No disponible"}
          </CTAButton>
        </Box>
      </VStack>
    </Box>
  );
}