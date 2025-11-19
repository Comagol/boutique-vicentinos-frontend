import { Box, Flex } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import { Navbar } from "../../components/Navbar"
import { Footer } from "../../components/Footer"

export const PublicLayout = () => {
  return (
    <Flex direction="column" minH="100vh" bg="bg.surface">
      <Navbar />
      <Box flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  )
}