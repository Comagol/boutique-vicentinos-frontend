import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { FaMoneyBillWave, FaCreditCard, FaCheckCircle } from "react-icons/fa";

interface PaymentOptionsProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export function PaymentOptions({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentOptionsProps) {
  const paymentMethods = [
    {
      id: "cash",
      label: "Efectivo",
      description: "Pagarás al retirar el producto",
      icon: FaMoneyBillWave,
    },
    {
      id: "mercado_pago",
      label: "Mercado Pago",
      description: "Pagarás con tarjeta o transferencia",
      icon: FaCreditCard,
    },
  ];

  return (
    <Box bg="white" borderRadius="md" p={6} shadow="sm">
      <VStack gap={4} align="stretch">
        <Heading size="md" color="text.primary">
          Método de Pago
        </Heading>

        <VStack gap={3} align="stretch">
          {paymentMethods.map((method) => {
            const isSelected = paymentMethod === method.id;
            const IconComponent = method.icon;

            return (
              <Box
                key={method.id}
                as="button"
                width="100%"
                p={4}
                borderRadius="md"
                border="2px solid"
                borderColor={isSelected ? "brand.500" : "gray.200"}
                bg={isSelected ? "brand.50" : "white"}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: isSelected ? "brand.700" : "brand.300",
                  bg: isSelected ? "brand.50" : "gray.50",
                }}
                _active={{
                  transform: "scale(0.98)",
                }}
                onClick={() => onPaymentMethodChange(method.id)}
              >
                <Flex align="center" justify="space-between" gap={3}>
                  <HStack gap={3} flex="1">
                    <Icon
                      as={IconComponent}
                      boxSize={6}
                      color={isSelected ? "brand.500" : "text.secondary"}
                    />
                    <VStack align="start" gap={0} flex="1">
                      <Text
                        fontWeight="semibold"
                        color={isSelected ? "brand.700" : "text.primary"}
                        fontSize="md"
                      >
                        {method.label}
                      </Text>
                      <Text fontSize="sm" color="text.muted">
                        {method.description}
                      </Text>
                    </VStack>
                  </HStack>
                  {isSelected && (
                    <Icon
                      as={FaCheckCircle}
                      boxSize={5}
                      color="brand.500"
                    />
                  )}
                </Flex>
              </Box>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
}