import { Box } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import { Navbar } from "../../components/Navbar"

export const PublicLayout = () => {
  return (
    <Box bg="background.surface" minH="100vh">
      <Navbar />
      <Outlet />
      {/* TODO: FOOTER */}
    </Box>
  )
}