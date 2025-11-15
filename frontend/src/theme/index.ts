import { createSystem, defaultConfig } from "@chakra-ui/react";

const customConfig = {
  theme: {
    tokens: {
      colors: {
        brand: {
          900: { value: "#0B1F3A" },
          700: { value: "#123B65" },
          500: { value: "#1F7A8C" },
          300: { value: "#40A9AA" },
          100: { value: "#D5F5F6" },
        },
        accent: {
          500: { value: "#F28F3B" },
          400: { value: "#F6A85E" },
        },
        background: {
          surface: { value: "#F2F4F7" },
          dim: { value: "#E5E9F0" },
        },
        text: {
          primary: { value: "#0B1F3A" },
          secondary: { value: "#374151" },
          muted: { value: "#6B7280" },
        },
      },
      radii: {
        sm: { value: "8px" },
        md: { value: "12px" },
        lg: { value: "16px" },
      },
      shadows: {
        md: { value: "0 10px 30px rgba(15, 23, 42, 0.08)" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.surface": { value: "{colors.background.surface}" },
        "bg.dim": { value: "{colors.background.dim}" },
        "text.primary": { value: "{colors.text.primary}" },
        "text.secondary": { value: "{colors.text.secondary}" },
        "text.muted": { value: "{colors.text.muted}" },
      },
    },
  },
  globalCss: {
    body: {
      bg: "bg.surface",
      color: "text.primary",
    },
  },
};

export const system = createSystem(defaultConfig, customConfig);