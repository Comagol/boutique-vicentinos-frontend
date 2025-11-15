import { extendTheme } from "@chakra-ui/react";

const fonts = {
  heading: "Poppins, sans-serif",
  body: "Inter, system-ui, sans-serif",
};

const colors = {
  brand: {
    900: "#0B1F3A",
    700: "#123B65",
    500: "#1F7A8C",
    300: "#40A9AA",
    100: "#D5F5F6",
  },
  accent: {
    500: "#F28F3B",
    400: "#F6A85E",
  },
  background: {
    surface: "#F2F4F7",
    dim: "#E5E9F0",
  },
  text: {
    primary: "#0B1F3A",
    secondary: "#374151",
    muted: "#6B7280",
  },
};

const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
};

const shadows = {
  md: "0 10px 30px rgba(15, 23, 42, 0.08)",
};

const styles = {
  global: {
    body: {
      bg: "background.surface",
      color: "text.primary",
    },
  },
};

export const theme = extendTheme({ fonts, colors, radii, shadows, styles });