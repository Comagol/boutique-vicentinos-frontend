import { Box } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"

export const PublicLayout = () => {
  return (
    <Box bg="background.surface" minH="100vh">
      {/* TODO: NAVBAR */}
      <Outlet />
      {/* TODO: FOOTER */}
    </Box>
  )
}