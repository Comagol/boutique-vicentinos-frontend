import { Route } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterPage";
import { UserLoginPage } from "./pages/UserLoginPage";

export const UserAuthRoutes = (
  <>
    <Route path="register" element={<RegisterPage />} />
    <Route path="login" element={<UserLoginPage />} />
  </>
);

