import { Route } from "react-router-dom";

const AdminProductsPage = () => <div>Admin products coming soon</div>;

export const AdminProductsRoutes = (
  <>
    <Route index element={<AdminProductsPage />} />
    <Route path="products/:productId" element={<AdminProductsPage />} />
  </>
);