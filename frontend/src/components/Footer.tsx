import { Box, Container, VStack, Text, HStack } from "@chakra-ui/react";

export function Footer() {
  return (
    <Box as="footer" bg="brand.900" color="white" mt="auto">
      <Container maxW="1200px" py={8}>
        <VStack gap={4} align="stretch">
          <HStack gap={8} justify="center" flexWrap="wrap">
            <VStack align="start" gap={2}>
              <Text fontWeight="bold" fontSize="lg">
                Boutique Vicentinos
              </Text>
              <Text fontSize="sm" color="brand.100">
                Club de Rugby y Hockey
              </Text>
            </VStack>
          </HStack>

          <Box borderBottom="1px solid" borderColor="brand.700" />

          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Text fontSize="sm" color="brand.300">
              © {new Date().getFullYear()} Boutique Vicentinos. Todos los derechos reservados.
            </Text>
            <Text fontSize="sm" color="brand.300">
              Reservas y consultas: boutique@vicentinos.com
            </Text>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}