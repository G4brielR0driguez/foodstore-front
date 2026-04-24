import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import { CategoriasPage } from "./pages/CategoriasPage";
import { IngredientesPage } from "./pages/IngredientesPage";
import { ProductosPage } from "./pages/ProductosPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/categorias" replace />} />
            <Route path="categorias" element={<CategoriasPage />} />
            <Route path="ingredientes" element={<IngredientesPage />} />
            <Route path="productos" element={<ProductosPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
