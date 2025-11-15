import { Flex, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <Flex bg="background.dim" minH="100vh">
      <Box flex="1" p={8}>
        <Outlet />
      </Box>
    </Flex>
  )
}