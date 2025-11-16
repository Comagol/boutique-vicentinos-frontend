import { Button, type ButtonProps } from "@chakra-ui/react";

export function CTAButton(props: ButtonProps) {
  return (
    <Button
      bg="brand.500"
      color="white"
      _hover={{ bg: "brand.700" }}
      _active={{ bg: "brand.900" }}
      borderRadius="md"
      transition="all 200ms ease"
      {...props}
    />
  );
}