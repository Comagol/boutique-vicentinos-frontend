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
import { useAuthStore } from "../../../stores/authStore";
import { toaster } from "../../../app/AppProvider";
import type { ApiError } from "../../../types";

export function RegisterPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    field: "name" | "email" | "password" | "confirmPassword",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
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
      await signup(formData.name, formData.email, formData.password);

      toaster.create({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente",
        type: "success",
        duration: 2000,
      });

      // Redirigir al inicio
      navigate("/");
    } catch (error) {
      const errorMessage =
        (error as ApiError).message ||
        "Error al registrarse. Por favor, intenta nuevamente.";

      toaster.create({
        title: "Error al registrarse",
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
                Crear Cuenta
              </Heading>
              <Text color="text.secondary" fontSize="sm">
                Boutique Vicentinos
              </Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <VStack gap={1} align="stretch">
                  <Text fontSize="sm" fontWeight="semibold">
                    Nombre
                  </Text>
                  <Input
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("name", e.target.value)
                    }
                    disabled={isLoading}
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

                <VStack gap={1} align="stretch">
                  <Text fontSize="sm" fontWeight="semibold">
                    Confirmar Contraseña
                  </Text>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <Text fontSize="sm" color="red.500">
                      {errors.confirmPassword}
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
                  Registrarse
                </Button>
              </VStack>
            </form>

            <VStack gap={2} align="center" pt={2}>
              <Text fontSize="sm" color="text.secondary">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#1F7A8C",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Inicia sesión
                </Link>
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

