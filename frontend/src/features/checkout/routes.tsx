import { Route } from "react-router-dom";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { MercadoPagoCallbackPage } from "./pages/MercadoPagoCallbackPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";

export const CheckoutRoutes = (
  <>
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="checkout/success" element={<CheckoutSuccessPage />} />
    <Route path="checkout/mercadopago-callback" element={<MercadoPagoCallbackPage />} />
    <Route path="order/:orderId" element={<OrderDetailPage />} />
    <Route path="orders/:orderNumber" element={<OrderDetailPage />} />
  </>
);