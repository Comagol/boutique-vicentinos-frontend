import { Route } from "react-router-dom";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export const ProductDetailRoutes = (
  <Route path="product/:productId" element={<ProductDetailPage />} />
);

