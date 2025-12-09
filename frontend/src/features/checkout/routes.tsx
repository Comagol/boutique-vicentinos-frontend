import { Route } from "react-router-dom";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";

export const CheckoutRoutes = (
  <>
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="checkout/success" element={<CheckoutSuccessPage />} />
    <Route path="order/:orderId" element={<OrderDetailPage />} />
    <Route path="orders/:orderNumber" element={<OrderDetailPage />} />
  </>
);