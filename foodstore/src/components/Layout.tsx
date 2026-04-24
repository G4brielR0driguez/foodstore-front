import { Outlet, Link, useLocation } from "react-router-dom";
import { Layers, Apple, Package } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex flex-col h-screen bg-primary-100 text-gray-900 font-sans">
      <header className="bg-primary-700 text-white shadow-lg">
        <div className="w-full px-8 lg:px-12">
          <div className="flex items-center justify-between h-28">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="FoodStore Logo" className="h-24 w-auto object-contain drop-shadow-md" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">FoodStore</h1>
                <p className="text-md text-primary-200">Admin Panel</p>
              </div>
            </div>
            
            <nav className="flex space-x-2">
              <Link
                to="/categorias"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
                  isCurrent("/categorias")
                    ? "bg-primary-500 text-white font-semibold"
                    : "text-primary-50 hover:bg-primary-600 hover:text-white"
                }`}
              >
                <Layers className="w-5 h-5" />
                Categorías
              </Link>
              <Link
                to="/ingredientes"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
                  isCurrent("/ingredientes")
                    ? "bg-primary-500 text-white font-semibold"
                    : "text-primary-50 hover:bg-primary-600 hover:text-white"
                }`}
              >
                <Apple className="w-5 h-5" />
                Ingredientes
              </Link>
              <Link
                to="/productos"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
                  isCurrent("/productos")
                    ? "bg-primary-500 text-white font-semibold"
                    : "text-primary-50 hover:bg-primary-600 hover:text-white"
                }`}
              >
                <Package className="w-5 h-5" />
                Productos
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8">
        <div className="w-full px-4 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
