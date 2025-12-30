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
import { useNavigate, Link } from "react-router-dom";
import type { ChangeEvent } from "react";
import { authService } from "../../../services/authService";
import { toaster } from "../../../app/AppProvider";
import type { ApiError } from "../../../types";

export function UserLoginPage() {
  const navigate = useNavigate();

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

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
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
      await authService.login({
        email: formData.email,
        password: formData.password,
      });

      toaster.create({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
        type: "success",
        duration: 2000,
      });

      // Redirigir al inicio
      navigate("/");
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
                Iniciar Sesión
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
                    placeholder="tu@email.com"
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

            <VStack gap={2} align="center" pt={2}>
              <Text fontSize="sm" color="text.secondary">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#1F7A8C",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Regístrate
                </Link>
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

