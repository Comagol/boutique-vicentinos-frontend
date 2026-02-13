import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
  Heading,
  NativeSelect,
  Badge,
  IconButton,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { Product, ProductCategory, ProductVariant } from "../../../types";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: any, images: File[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

interface FormDataState {
  name: string;
  description: string;
  category: ProductCategory;
  baseColor: string;
  price: string;
  discountPrice: string;
  tags: string[];
  variants: ProductVariant[];
}

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: ProductFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [newVariantColor, setNewVariantColor] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormDataState>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "otros",
    baseColor: initialData?.baseColor || "",
    price: initialData?.price?.toString() || "",
    discountPrice: initialData?.discountPrice?.toString() || "",
    tags: Array.isArray(initialData?.tags) ? initialData.tags : [],
    variants: Array.isArray(initialData?.variants) ? initialData.variants : [],
  });

  // Sincronizar con initialData (para edición)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category || "otros",
        baseColor: initialData.baseColor || "",
        price: initialData.price?.toString() || "",
        discountPrice: initialData.discountPrice?.toString() || "",
        tags: Array.isArray(initialData.tags) ? initialData.tags : [],
        variants: Array.isArray(initialData.variants) ? initialData.variants : [],
      });

      if (Array.isArray(initialData.images)) {
        setImagePreviews(initialData.images);
      }
    }
  }, [initialData]);

  const handleInputChange = (field: keyof FormDataState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Gestión de Tags
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange("tags", [...formData.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleInputChange("tags", formData.tags.filter((t) => t !== tag));
  };

  // Gestión de Variantes (Colores)
  const handleAddVariant = () => {
    const color = newVariantColor.trim();
    if (color && !formData.variants.some(v => v.color.toLowerCase() === color.toLowerCase())) {
      const newVariants = [...formData.variants, { color, sizes: [] }];
      handleInputChange("variants", newVariants);
      setNewVariantColor("");
    }
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    handleInputChange("variants", newVariants);
  };

  // Gestión de Tallas dentro de una Variante
  const handleAddSizeToVariant = (variantIndex: number, size: string) => {
    if (!size.trim()) return;
    
    const newVariants = [...formData.variants];
    const variant = newVariants[variantIndex];
    
    if (!variant.sizes.some(s => s.size.toLowerCase() === size.trim().toLowerCase())) {
      variant.sizes.push({ size: size.trim(), quantity: 0 });
      handleInputChange("variants", newVariants);
    }
  };

  const handleRemoveSizeFromVariant = (variantIndex: number, sizeIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].sizes = newVariants[variantIndex].sizes.filter((_, i) => i !== sizeIndex);
    handleInputChange("variants", newVariants);
  };

  const handleUpdateSizeQuantity = (variantIndex: number, sizeIndex: number, qty: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].sizes[sizeIndex].quantity = Math.max(0, qty);
    handleInputChange("variants", newVariants);
  };

  // Gestión de Imágenes
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      baseColor: formData.baseColor || undefined,
      tags: formData.tags,
      price: parseFloat(formData.price) || 0,
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      variants: formData.variants,
    };

    await onSubmit(productData, selectedImages);
  };

  const categories: ProductCategory[] = [
    "camisetas-rugby", "camisetas-hockey", "shorts-rugby", "polleras-hockey",
    "medias-rugby", "medias-hockey", "pantalones", "shorts", "buzos",
    "gorras", "camperas", "camperon", "bolsos", "gorros", "otros"
  ];

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap={6} align="stretch">
        {/* Sección 1: Información General */}
        <Box bg="white" borderRadius="lg" p={6} shadow="sm" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={6} color="gray.800" display="flex" alignItems="center" gap={2}>
            <Box as="span" bg="brand.500" w="4px" h="20px" borderRadius="full" />
            Información General
          </Heading>
          <VStack gap={5} align="stretch">
            <VStack gap={1} align="stretch">
              <Text fontSize="sm" fontWeight="bold" color="gray.700">Nombre del producto *</Text>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Camiseta Titular 2024"
                size="lg"
              />
            </VStack>

            <VStack gap={1} align="stretch">
              <Text fontSize="sm" fontWeight="bold" color="gray.700">Descripción</Text>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Detalla las características del producto..."
                rows={4}
              />
            </VStack>

            <HStack gap={4} flexDirection={{ base: "column", md: "row" }} align="stretch">
              <VStack gap={1} align="stretch" flex="1">
                <Text fontSize="sm" fontWeight="bold" color="gray.700">Categoría *</Text>
                <NativeSelect.Root size="lg">
                  <NativeSelect.Field
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value as ProductCategory)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat.replace("-", " ").toUpperCase()}</option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </VStack>

              <VStack gap={1} align="stretch" flex="1">
                <Text fontSize="sm" fontWeight="bold" color="gray.700">Color Base</Text>
                <Input
                  value={formData.baseColor}
                  onChange={(e) => handleInputChange("baseColor", e.target.value)}
                  placeholder="Ej: Azul Marino"
                  size="lg"
                />
              </VStack>
            </HStack>

            <HStack gap={4} flexDirection={{ base: "column", md: "row" }} align="stretch">
              <VStack gap={1} align="stretch" flex="1">
                <Text fontSize="sm" fontWeight="bold" color="gray.700">Precio *</Text>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  size="lg"
                />
              </VStack>

              <VStack gap={1} align="stretch" flex="1">
                <Text fontSize="sm" fontWeight="bold" color="gray.700">Precio con Descuento</Text>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                  placeholder="0.00"
                  size="lg"
                />
              </VStack>
            </HStack>
          </VStack>
        </Box>

        {/* Sección 2: Variantes (Color + Tallas + Stock) */}
        <Box bg="white" borderRadius="lg" p={6} shadow="sm" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={6} color="gray.800" display="flex" alignItems="center" gap={2}>
            <Box as="span" bg="brand.500" w="4px" h="20px" borderRadius="full" />
            Stock y Variantes
          </Heading>
          
          <VStack gap={6} align="stretch">
            {/* Input para agregar nuevo color */}
            <HStack gap={3}>
              <Input
                placeholder="Nuevo color (ej: Rojo)"
                value={newVariantColor}
                onChange={(e) => setNewVariantColor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVariant())}
              />
              <Button onClick={handleAddVariant} colorPalette="brand">
                <FiPlus /> Agregar Color
              </Button>
            </HStack>

            {formData.variants.map((variant, vIndex) => (
              <Box 
                key={vIndex} 
                p={5} 
                borderRadius="md" 
                border="1px solid" 
                borderColor="gray.200"
                bg="gray.50"
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <HStack>
                    <Badge colorPalette="brand" size="lg" px={3} py={1} borderRadius="full">
                      Color: {variant.color}
                    </Badge>
                  </HStack>
                  <IconButton
                    aria-label="Eliminar color"
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={() => handleRemoveVariant(vIndex)}
                  >
                    <FiTrash2 />
                  </IconButton>
                </Flex>

                <VStack align="stretch" gap={3}>
                  <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                    Tallas y Cantidades
                  </Text>
                  
                  <Flex gap={3} flexWrap="wrap">
                    {variant.sizes.map((sizeObj, sIndex) => (
                      <HStack 
                        key={sIndex} 
                        bg="white" 
                        p={2} 
                        borderRadius="md" 
                        border="1px solid" 
                        borderColor="gray.200"
                        shadow="xs"
                      >
                        <VStack gap={0} align="start">
                          <Text fontSize="xs" fontWeight="bold">{sizeObj.size}</Text>
                          <Input
                            type="number"
                            size="xs"
                            variant="flushed"
                            w="50px"
                            value={sizeObj.quantity}
                            onChange={(e) => handleUpdateSizeQuantity(vIndex, sIndex, parseInt(e.target.value) || 0)}
                          />
                        </VStack>
                        <IconButton
                          aria-label="Eliminar talla"
                          size="xs"
                          variant="ghost"
                          onClick={() => handleRemoveSizeFromVariant(vIndex, sIndex)}
                        >
                          <FiX />
                        </IconButton>
                      </HStack>
                    ))}
                    
                    {/* Input rápido para agregar talla */}
                    <Input
                      placeholder="Nueva talla (S, M, 42...)"
                      size="sm"
                      w="150px"
                      bg="white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSizeToVariant(vIndex, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                  </Flex>
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Sección 3: Imágenes */}
        <Box bg="white" borderRadius="lg" p={6} shadow="sm" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={6} color="gray.800" display="flex" alignItems="center" gap={2}>
            <Box as="span" bg="brand.500" w="4px" h="20px" borderRadius="full" />
            Galería de Imágenes
          </Heading>
          <VStack gap={4} align="stretch">
            <Box 
              border="2px dashed" 
              borderColor="gray.200" 
              borderRadius="lg" 
              p={10} 
              textAlign="center"
              _hover={{ borderColor: "brand.500", bg: "brand.50" }}
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => document.getElementById('image-input')?.click()}
            >
              <Input
                id="image-input"
                type="file"
                accept="image/*"
                multiple
                display="none"
                onChange={handleImageSelect}
              />
              <VStack gap={2}>
                <Box color="gray.400" fontSize="3xl"><FiPlus /></Box>
                <Text fontWeight="bold">Haz clic para subir imágenes</Text>
                <Text fontSize="xs" color="gray.500">Puedes seleccionar múltiples archivos</Text>
              </VStack>
            </Box>

            {imagePreviews.length > 0 && (
              <Flex gap={4} flexWrap="wrap" mt={4}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} position="relative" w="120px" h="120px" borderRadius="lg" overflow="hidden" shadow="md">
                    <Image src={preview} alt="Vista previa" w="100%" h="100%" objectFit="cover" />
                    <IconButton
                      aria-label="Eliminar imagen"
                      size="xs"
                      position="absolute"
                      top="5px"
                      right="5px"
                      colorPalette="red"
                      rounded="full"
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                    >
                      <FiX />
                    </IconButton>
                  </Box>
                ))}
              </Flex>
            )}
          </VStack>
        </Box>

        {/* Sección 4: Tags */}
        <Box bg="white" borderRadius="lg" p={6} shadow="sm" border="1px solid" borderColor="gray.100">
          <Heading size="md" mb={6} color="gray.800" display="flex" alignItems="center" gap={2}>
            <Box as="span" bg="brand.500" w="4px" h="20px" borderRadius="full" />
            Etiquetas (Tags)
          </Heading>
          <VStack gap={4} align="stretch">
            <HStack gap={2}>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Ej: Invierno, Oferta, Rugby"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button onClick={handleAddTag} variant="outline">Agregar</Button>
            </HStack>
            <Flex gap={2} flexWrap="wrap">
              {formData.tags.map((tag) => (
                <Badge key={tag} colorPalette="brand" variant="subtle" px={3} py={1} borderRadius="md" display="flex" alignItems="center" gap={2}>
                  {tag}
                  <Box as="span" cursor="pointer" onClick={() => handleRemoveTag(tag)}><FiX size={12}/></Box>
                </Badge>
              ))}
            </Flex>
          </VStack>
        </Box>

        {/* Botones de acción */}
        <Flex gap={4} justify="flex-end" py={6}>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading} size="lg">
            Cancelar
          </Button>
          <Button
            type="submit"
            colorPalette="brand"
            size="lg"
            loading={isLoading}
            px={10}
            shadow="lg"
          >
            {isEdit ? "Guardar Cambios" : "Publicar Producto"}
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
