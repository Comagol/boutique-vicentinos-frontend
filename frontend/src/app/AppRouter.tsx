import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { CatalogRoutes } from "../features/catalog/routes";
import { ProductDetailRoutes } from "../features/product-detail/routes";
import { CheckoutRoutes } from "../features/checkout/routes";
import { AdminProductsRoutes } from "../features/admin-products/routes";
import { AdminOrdersRoutes } from "../features/admin-orders/routes";
import { LoginPage } from "../features/admin-auth/pages/Login";
import { UserAuthRoutes } from "../features/user-auth/routes";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PublicLayout />}>
        {CatalogRoutes}
        {ProductDetailRoutes}
        {CheckoutRoutes}
        {UserAuthRoutes}
      </Route>

      {/* Ruta de login (sin protección) */}
      <Route path="admin/login" element={<LoginPage />} />

      {/* Rutas de admin (protegidas) */}
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {AdminProductsRoutes}
        {AdminOrdersRoutes}
      </Route>
    </Routes>
  </BrowserRouter>
);