import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { CatalogRoutes } from "../features/catalog/routes";
import { ProductDetailRoutes } from "../features/product-detail/routes";
import { CheckoutRoutes } from "../features/checkout/routes";
import { AdminProductsRoutes } from "../features/admin-products/routes";
import { AdminOrdersRoutes } from "../features/admin-orders/routes";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PublicLayout />}>
        {CatalogRoutes}
        {ProductDetailRoutes}
        {CheckoutRoutes}
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        {AdminProductsRoutes}
        {AdminOrdersRoutes}
      </Route>
    </Routes>
  </BrowserRouter>
);