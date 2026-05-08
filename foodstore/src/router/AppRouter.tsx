import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { CategoriasPage } from "../pages/CategoriasPage";
import { IngredientesPage } from "../pages/IngredientesPage";
import { ProductosPage } from "../pages/ProductosPage";

/**
 * AppRouter centraliza toda la configuración de navegación de la SPA.
 * Utiliza react-router-dom con rutas anidadas bajo el Layout principal.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/categorias" replace />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="ingredientes" element={<IngredientesPage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="productos/:id" element={<ProductosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
