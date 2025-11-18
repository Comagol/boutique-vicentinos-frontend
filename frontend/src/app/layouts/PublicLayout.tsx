import { Box } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import { Navbar } from "../../components/Navbar"
import { Footer } from "../../components/Footer"

export const PublicLayout = () => {
  return (
    <Box bg="background.surface" minH="100vh">
      <Navbar />
      <Box flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}