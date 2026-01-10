import {
  Box,
  Container,
  VStack,
  Text,
  Input,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { toaster } from "../../../app/AppProvider";
import type { ApiError } from "../../../types";
import { getRedirectPathByRole } from "../../../utils/authRedirect";

export function LoginPage() {
  const navigate = useNavigate();
  const adminLogin = useAuthStore((state) => state.adminLogin);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Solo validar que no estén vacíos
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await adminLogin(formData.email, formData.password);

      // Obtener el rol actualizado después del login
      const currentRole = useAuthStore.getState().role;

      toaster.create({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
        type: "success",
        duration: 2000,
      });

      // Redirigir según el rol
      const redirectPath = getRedirectPathByRole(currentRole);
      navigate(redirectPath);
    } catch (error) {
      const errorMessage =
        (error as ApiError).message ||
        "Error al iniciar sesión. Verifica tus credenciales.";

      toaster.create({
        title: "Error al iniciar sesión",
        description: errorMessage,
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="bg.surface"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={12}
    >
      <Container maxW="md">
        <Box bg="white" borderRadius="md" p={8} shadow="lg">
          <VStack gap={6} align="stretch">
            <VStack gap={2} align="center">
              <Heading size="xl" color="text.primary">
                Administración
              </Heading>
              <Text color="text.secondary" fontSize="sm">
                Boutique Vicentinos
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <VStack gap={1} align="stretch">
                  <Text fontSize="sm" fontWeight="semibold">
                    Email
                  </Text>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("email", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <Text fontSize="sm" color="red.500">
                      {errors.email}
                    </Text>
                  )}
                </VStack>

                <VStack gap={1} align="stretch">
                  <Text fontSize="sm" fontWeight="semibold">
                    Contraseña
                  </Text>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("password", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <Text fontSize="sm" color="red.500">
                      {errors.password}
                    </Text>
                  )}
                </VStack>

                <Button
                  type="submit"
                  size="lg"
                  width="100%"
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: "brand.700" }}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Iniciar Sesión
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}