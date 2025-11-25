import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { authService } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  // Verificar también si hay token en localStorage (por si el store no está sincronizado)
  const hasToken = authService.isAuthenticated();

  if (!isAuthenticated && !hasToken) {
    // Guardar la ruta a la que quería ir para redirigir después del login
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}