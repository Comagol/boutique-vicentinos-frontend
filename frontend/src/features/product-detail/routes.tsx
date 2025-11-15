import { Route } from "react-router-dom";

const ProductDetailPage = () => <div>Product detail coming soon</div>;

export const ProductDetailRoutes = (
  <Route path="product/:productId" element={<ProductDetailPage />} />
);

