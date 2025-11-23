import { Route } from "react-router-dom";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";

export const CheckoutRoutes = (
  <>
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="checkout/success" element={<CheckoutSuccessPage />} />
  </>
);