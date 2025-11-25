import { Route } from "react-router-dom";
import { AdminProductsPage } from "./pages/AdminProductsPage";
import { CreateProductPage } from "./pages/CreateProductPage";
import { EditProductPage } from "./pages/EditProductPage";

export const AdminProductsRoutes = (
  <>
    <Route index element={<AdminProductsPage />} />
    <Route path="products/new" element={<CreateProductPage />} />
    <Route path="products/:productId" element={<EditProductPage />} />
  </>
);