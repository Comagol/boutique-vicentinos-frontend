import { ChakraProvider, createToaster, Toaster, Box, VStack, Text, CloseButton } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { AppRouter } from "./AppRouter";
import { system } from "../theme";

export const toaster = createToaster({ placement: "top-end" });

export const AppProvider = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ChakraProvider value={system}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <Toaster toaster={toaster}>
          {(toast) => {
            const { title, description, type, id } = toast;
            
            // Colores según el tipo
            const colorPalette = 
              type === "success" ? "green" :
              type === "error" ? "red" :
              type === "warning" ? "yellow" :
              "blue";

            return (
              <Box
                bg={`${colorPalette}.50`}
                borderLeft="4px solid"
                borderColor={`${colorPalette}.500`}
                borderRadius="md"
                p={4}
                shadow="lg"
                minW="300px"
                maxW="400px"
                mb={3}
                position="relative"
              >
                <VStack align="start" gap={2}>
                  {title && (
                    <Text 
                      fontWeight="semibold" 
                      fontSize="sm" 
                      color={`${colorPalette}.900`}
                    >
                      {title}
                    </Text>
                  )}
                  {description && (
                    <Text 
                      fontSize="sm" 
                      color="text.secondary"
                    >
                      {description}
                    </Text>
                  )}
                </VStack>
                <CloseButton
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => toaster.dismiss(id)}
                  color="text.muted"
                  _hover={{ color: "text.primary" }}
                />
              </Box>
            );
          }}
        </Toaster>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  );
};