import { Route } from "react-router-dom";
import { AdminOrdersPage } from "./pages/AdminOrdersPage";

export const AdminOrdersRoutes = (
  <Route path="orders" element={<AdminOrdersPage />} />
);