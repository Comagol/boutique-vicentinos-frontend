import {
  Box,
  VStack,
  HStack,
  Text,
  RadioGroup,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

interface PaymentOptionsProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export function PaymentOptions({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentOptionsProps) {
  return (
    <Box bg="white" borderRadius="md" p={6} shadow="sm">
      <VStack gap={4} align="stretch">
        <Heading size="md" color="text.primary">
          Método de Pago
        </Heading>

        <RadioGroup.Root
          value={paymentMethod}
          onValueChange={(e) => {
            if (e.value) {
              // e.value puede ser un array o un string dependiendo de la implementación
              const selectedValue = Array.isArray(e.value) ? e.value[0] : e.value;
              if (selectedValue) {
                onPaymentMethodChange(selectedValue);
              }
            }
          }}
        >
          <VStack gap={3} align="stretch">
            <RadioGroup.Item value="cash">
              <RadioGroup.ItemControl />
              <RadioGroup.ItemText>
                <HStack gap={3}>
                  <Icon as={FaMoneyBillWave} boxSize={5} />
                  <VStack align="start" gap={0}>
                    <Text fontWeight="semibold">Efectivo</Text>
                    <Text fontSize="sm" color="text.muted">
                      Pagarás al retirar el producto
                    </Text>
                  </VStack>
                </HStack>
              </RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item value="mercado_pago">
              <RadioGroup.ItemControl />
              <RadioGroup.ItemText>
                <HStack gap={3}>
                  <Icon as={FaCreditCard} boxSize={5} />
                  <VStack align="start" gap={0}>
                    <Text fontWeight="semibold">Mercado Pago</Text>
                    <Text fontSize="sm" color="text.muted">
                      Pagarás con tarjeta o transferencia
                    </Text>
                  </VStack>
                </HStack>
              </RadioGroup.ItemText>
            </RadioGroup.Item>
          </VStack>
        </RadioGroup.Root>
      </VStack>
    </Box>
  );
}