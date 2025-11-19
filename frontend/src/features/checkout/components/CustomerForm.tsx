import {
  Box,
  VStack,
  Input,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import type { ChangeEvent } from "react";
import type { CustomerInfo } from "../../../types";

interface CustomerFormProps {
  customerInfo: CustomerInfo | null;
  onCustomerChange: (info: CustomerInfo) => void;
}

export function CustomerForm({
  customerInfo,
  onCustomerChange,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: customerInfo?.name || "",
    email: customerInfo?.email || "",
    phone: customerInfo?.phone || "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Formato argentino: +54 o sin prefijo, 10 dígitos
    const phoneRegex = /^(\+54)?[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Validar en tiempo real
    const newErrors = { ...errors };

    if (field === "name") {
      if (value.trim().length < 2) {
        newErrors.name = "El nombre debe tener al menos 2 caracteres";
      } else {
        delete newErrors.name;
      }
    }

    if (field === "email") {
      if (!value) {
        newErrors.email = "El email es requerido";
      } else if (!validateEmail(value)) {
        newErrors.email = "El email no es válido";
      } else {
        delete newErrors.email;
      }
    }

    if (field === "phone") {
      if (!value) {
        newErrors.phone = "El teléfono es requerido";
      } else if (!validatePhone(value)) {
        newErrors.phone = "El teléfono no es válido (ej: +541112345678)";
      } else {
        delete newErrors.phone;
      }
    }

    setErrors(newErrors);

    // Si no hay errores, actualizar el estado padre
    if (!newErrors.name && !newErrors.email && !newErrors.phone) {
      if (newData.name && newData.email && newData.phone) {
        onCustomerChange(newData);
      }
    }
  };

  return (
    <Box bg="white" borderRadius="md" p={6} shadow="sm">
      <VStack gap={4} align="stretch">
        <Heading size="md" color="text.primary">
          Información de Contacto
        </Heading>

        <VStack gap={1} align="stretch">
          <Text fontSize="sm" fontWeight="semibold">
            Nombre completo
          </Text>
          <Input
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
          />
          {errors.name && (
            <Text fontSize="sm" color="red.500">
              {errors.name}
            </Text>
          )}
        </VStack>

        <VStack gap={1} align="stretch">
          <Text fontSize="sm" fontWeight="semibold">
            Email
          </Text>
          <Input
            type="email"
            placeholder="juan@example.com"
            value={formData.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <Text fontSize="sm" color="red.500">
              {errors.email}
            </Text>
          )}
        </VStack>

        <VStack gap={1} align="stretch">
          <Text fontSize="sm" fontWeight="semibold">
            Teléfono
          </Text>
          <Input
            type="tel"
            placeholder="+541112345678"
            value={formData.phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)}
          />
          {errors.phone && (
            <Text fontSize="sm" color="red.500">
              {errors.phone}
            </Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}