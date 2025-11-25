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
import type { Product, ProductCategory, StockInfo } from "../../../types";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: FormData, images: File[]) => Promise<void>;
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
  sizes: Array<{ size: string; type: "adulto" | "infantil" }>;
  colors: string[];
  stock: StockInfo[];
}

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: ProductFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState<{ size: string; type: "adulto" | "infantil" }>({
    size: "",
    type: "adulto",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormDataState>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "otros",
    baseColor: initialData?.baseColor || "",
    price: initialData?.price?.toString() || "",
    discountPrice: initialData?.discountPrice?.toString() || "",
    tags: initialData?.tags || [],
    sizes: initialData?.sizes || [],
    colors: initialData?.colors || [],
    stock: initialData?.stock || [],
  });

  // Cargar imágenes existentes si estamos editando
  useEffect(() => {
    if (isEdit && initialData?.images) {
      setImagePreviews(initialData.images);
    }
  }, [isEdit, initialData]);

  const handleInputChange = (
    field: keyof FormDataState,
    value: string | string[] | Array<{ size: string; type: "adulto" | "infantil" }> | StockInfo[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange("tags", [...formData.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((t) => t !== tag)
    );
  };

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      handleInputChange("colors", [...formData.colors, newColor.trim()]);
      setNewColor("");
    }
  };

  const handleRemoveColor = (color: string) => {
    handleInputChange(
      "colors",
      formData.colors.filter((c) => c !== color)
    );
  };

  const handleAddSize = () => {
    if (newSize.size.trim()) {
      const sizeExists = formData.sizes.some(
        (s) => s.size === newSize.size.trim() && s.type === newSize.type
      );
      if (!sizeExists) {
        handleInputChange("sizes", [...formData.sizes, { ...newSize, size: newSize.size.trim() }]);
        setNewSize({ size: "", type: "adulto" });
      }
    }
  };

  const handleRemoveSize = (size: string, type: "adulto" | "infantil") => {
    handleInputChange(
      "sizes",
      formData.sizes.filter((s) => !(s.size === size && s.type === type))
    );
    // Eliminar stock relacionado
    handleInputChange(
      "stock",
      formData.stock.filter((s) => !(s.size === size))
    );
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);

    // Crear previews
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

  const handleStockChange = (
    size: string,
    color: string | undefined,
    quantity: number
  ) => {
    const stockIndex = formData.stock.findIndex(
      (s) => s.size === size && s.color === color
    );

    if (stockIndex >= 0) {
      const newStock = [...formData.stock];
      if (quantity <= 0) {
        newStock.splice(stockIndex, 1);
      } else {
        newStock[stockIndex] = { ...newStock[stockIndex], quantity };
      }
      handleInputChange("stock", newStock);
    } else if (quantity > 0) {
      handleInputChange("stock", [
        ...formData.stock,
        { size, color, quantity },
      ]);
    }
  };

  const getStockQuantity = (size: string, color?: string): number => {
    const stockItem = formData.stock.find(
      (s) => s.size === size && s.color === color
    );
    return stockItem?.quantity || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.name.trim()) {
      alert("El nombre es requerido");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }
    if (formData.sizes.length === 0) {
      alert("Debes agregar al menos una talla");
      return;
    }

    // Preparar datos del formulario
    const productFormData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      baseColor: formData.baseColor.trim() || undefined,
      tags: formData.tags,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice
        ? parseFloat(formData.discountPrice)
        : undefined,
      sizes: formData.sizes,
      colors: formData.colors,
      stock: formData.stock,
    };

    await onSubmit(productFormData as any, selectedImages);
  };

  const categories: ProductCategory[] = [
    "camisetas-rugby",
    "camisetas-hockey",
    "shorts-rugby",
    "polleras-hockey",
    "medias-rugby",
    "medias-hockey",
    "pantalones",
    "shorts",
    "buzos",
    "gorras",
    "camperas",
    "camperon",
    "bolsos",
    "gorros",
    "otros",
  ];

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap={6} align="stretch">
        {/* Información básica */}
        <Box bg="white" borderRadius="md" p={6} shadow="sm">
          <Heading size="md" mb={4} color="text.primary">
            Información Básica
          </Heading>
          <VStack gap={4} align="stretch">
            <VStack gap={1} align="stretch">
              <Text fontSize="sm" fontWeight="semibold">
                Nombre del producto *
              </Text>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Camiseta Titular 2024"
                required
              />
            </VStack>

            <VStack gap={1} align="stretch">
              <Text fontSize="sm" fontWeight="semibold">
                Descripción
              </Text>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descripción del producto..."
                rows={4}
              />
            </VStack>

            <HStack gap={4}>
              <VStack gap={1} align="stretch" flex="1">
                <Text fontSize="sm" fontWeight="semibold">
                  Categoría *
                </Text>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={formData.category}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleInputChange("category", e.target.value as ProductCategory)
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat
                          .split("-")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </VStack>

              <VStack gap={1} align="stretch" flex="1">
                <Text fontSize="sm" fontWeight="semibold">
                  Color base (opcional)
                </Text>
                <Input
                  value={formData.baseColor}
                  onChange={(e) => handleInputChange("baseColor", e.target.value)}
                  placeholder="Ej: Azul"
                />
              </VStack>
            </HStack>

            <HStack gap={4}>
              <VStack gap={1} align="stretch" flex="1">
                <Text fontSize="sm" fontWeight="semibold">
                  Precio *
                </Text>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </VStack>

              <VStack gap={1} align="stretch" flex="1">
                <Text fontSize="sm" fontWeight="semibold">
                  Precio con descuento (opcional)
                </Text>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice}
                  onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                  placeholder="0.00"
                />
              </VStack>
            </HStack>
          </VStack>
        </Box>

        {/* Imágenes */}
        <Box bg="white" borderRadius="md" p={6} shadow="sm">
          <Heading size="md" mb={4} color="text.primary">
            Imágenes
          </Heading>
          <VStack gap={4} align="stretch">
            <Box>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
              />
              <Text fontSize="xs" color="text.muted" mt={1}>
                Puedes seleccionar múltiples imágenes
              </Text>
            </Box>

            {imagePreviews.length > 0 && (
              <Flex gap={2} flexWrap="wrap">
                {imagePreviews.map((preview, index) => (
                  <Box key={index} position="relative" width="100px" height="100px">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <IconButton
                      aria-label="Eliminar imagen"
                      size="xs"
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      borderRadius="full"
                      color="red.500"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FiX />
                    </IconButton>
                  </Box>
                ))}
              </Flex>
            )}
          </VStack>
        </Box>

        {/* Tags */}
        <Box bg="white" borderRadius="md" p={6} shadow="sm">
          <Heading size="md" mb={4} color="text.primary">
            Tags
          </Heading>
          <VStack gap={2} align="stretch">
            <HStack gap={2}>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Agregar tag"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                <FiPlus />
              </Button>
            </HStack>
            {formData.tags.length > 0 && (
              <HStack gap={2} flexWrap="wrap">
                {formData.tags.map((tag) => (
                  <Badge key={tag} borderRadius="md" p={2}>
                    {tag}
                    <IconButton
                      aria-label={`Eliminar tag ${tag}`}
                      size="xs"
                      variant="ghost"
                      ml={2}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <FiX />
                    </IconButton>
                  </Badge>
                ))}
              </HStack>
            )}
          </VStack>
        </Box>

        {/* Tallas */}
        <Box bg="white" borderRadius="md" p={6} shadow="sm">
          <Heading size="md" mb={4} color="text.primary">
            Tallas *
          </Heading>
          <VStack gap={4} align="stretch">
            <HStack gap={2}>
              <Input
                value={newSize.size}
                onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                placeholder="Ej: S, M, L, XL"
                flex="1"
              />
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={newSize.type}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setNewSize({
                      ...newSize,
                      type: e.target.value as "adulto" | "infantil",
                    })
                  }
                  style={{ minWidth: "120px" }}
                >
                  <option value="adulto">Adulto</option>
                  <option value="infantil">Infantil</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
              <Button type="button" onClick={handleAddSize}>
                <FiPlus />
              </Button>
            </HStack>

            {formData.sizes.length > 0 && (
              <VStack gap={2} align="stretch">
                {formData.sizes.map((sizeObj, index) => (
                  <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                    <Text>
                      {sizeObj.size} ({sizeObj.type})
                    </Text>
                    <IconButton
                      aria-label={`Eliminar talla ${sizeObj.size}`}
                      size="sm"
                      variant="ghost"
                      color="red.500"
                      onClick={() => handleRemoveSize(sizeObj.size, sizeObj.type)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </HStack>
                ))}
              </VStack>
            )}
          </VStack>
        </Box>

        {/* Colores */}
        <Box bg="white" borderRadius="md" p={6} shadow="sm">
          <Heading size="md" mb={4} color="text.primary">
            Colores (opcional)
          </Heading>
          <VStack gap={2} align="stretch">
            <HStack gap={2}>
              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Ej: Azul, Rojo, Blanco"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
              />
              <Button type="button" onClick={handleAddColor}>
                <FiPlus />
              </Button>
            </HStack>
            {formData.colors.length > 0 && (
              <HStack gap={2} flexWrap="wrap">
                {formData.colors.map((color) => (
                  <Badge key={color} borderRadius="md" p={2}>
                    {color}
                    <IconButton
                      aria-label={`Eliminar color ${color}`}
                      size="xs"
                      variant="ghost"
                      ml={2}
                      onClick={() => handleRemoveColor(color)}
                    >
                      <FiX />
                    </IconButton>
                  </Badge>
                ))}
              </HStack>
            )}
          </VStack>
        </Box>

        {/* Stock */}
        {formData.sizes.length > 0 && (
          <Box bg="white" borderRadius="md" p={6} shadow="sm">
            <Heading size="md" mb={4} color="text.primary">
              Stock
            </Heading>
            <VStack gap={4} align="stretch">
              {formData.sizes.map((sizeObj) => (
                <Box key={`${sizeObj.size}-${sizeObj.type}`}>
                  <Text fontWeight="semibold" mb={2}>
                    Talla: {sizeObj.size} ({sizeObj.type})
                  </Text>
                  <VStack gap={2} align="stretch" ml={4}>
                    {formData.colors.length > 0 ? (
                      formData.colors.map((color) => (
                        <HStack key={color} gap={2}>
                          <Text fontSize="sm" minW="100px">
                            {color}:
                          </Text>
                          <Input
                            type="number"
                            min="0"
                            value={getStockQuantity(sizeObj.size, color)}
                            onChange={(e) =>
                              handleStockChange(
                                sizeObj.size,
                                color,
                                parseInt(e.target.value) || 0
                              )
                            }
                            style={{ maxWidth: "120px" }}
                          />
                        </HStack>
                      ))
                    ) : (
                      <HStack gap={2}>
                        <Text fontSize="sm">Cantidad:</Text>
                        <Input
                          type="number"
                          min="0"
                          value={getStockQuantity(sizeObj.size)}
                          onChange={(e) =>
                            handleStockChange(
                              sizeObj.size,
                              undefined,
                              parseInt(e.target.value) || 0
                            )
                          }
                          style={{ maxWidth: "120px" }}
                        />
                      </HStack>
                    )}
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Botones de acción */}
        <HStack gap={4} justify="flex-end">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            bg="brand.500"
            color="white"
            _hover={{ bg: "brand.700" }}
            loading={isLoading}
            disabled={isLoading}
          >
            {isEdit ? "Actualizar Producto" : "Crear Producto"}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}