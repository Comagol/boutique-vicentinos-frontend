import type { UserRole } from "../types";

export function getRedirectPathByRole(role: UserRole | null): string {
  if (role === "admin") {
    return "/admin";
  }
  return "/"; // Usuario regular o null
}

