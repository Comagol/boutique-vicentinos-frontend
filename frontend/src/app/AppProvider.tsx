import { ChakraProvider, createToaster, Toaster, Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { AppRouter } from "./AppRouter";
import { system } from "../theme";

const toaster = createToaster({ placement: "top-end" });

export const AppProvider = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ChakraProvider value={system}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <Toaster toaster={toaster}>
          {({ title, description }) => (
            <Box>{title}: {description}</Box>
          )}
        </Toaster>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  );
};