import { Route } from "react-router-dom";
import { AdminProductsPage } from "./pages/AdminProductsPage";

export const AdminProductsRoutes = (
  <>
    <Route index element={<AdminProductsPage />} />
    <Route path="products/:productId" element={<AdminProductsPage />} />
  </>
);