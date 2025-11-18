import { Route } from "react-router-dom";
import { CatalogPage } from "./pages/CatalogPage";

export const CatalogRoutes = (
  <>
    <Route index element={<CatalogPage />} />
  </>
);