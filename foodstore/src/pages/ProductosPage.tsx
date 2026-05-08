import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductos, createProducto, updateProducto, deleteProducto } from "../api/productos";
import { getCategorias } from "../api/categorias";
import { getIngredientes } from "../api/ingredientes";
import { Pencil, Trash2 } from "lucide-react";
import type { Producto, ProductoCreate } from "../types";
import { PageHeader } from "../components/PageHeader";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";
import { ProductoModal } from "../components/modals/ProductoModal";

const EMPTY_FORM: ProductoCreate = {
  nombre: "",
  descripcion: "",
  precio_base: 0,
  stock_cantidad: 0,
  disponible: true,
  categoria_ids: [],
  ingrediente_ids: [],
};

export function ProductosPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductoCreate>(EMPTY_FORM);

  const { data: categorias = [] } = useQuery({ queryKey: ["categorias"], queryFn: getCategorias });
  const { data: ingredientes = [] } = useQuery({ queryKey: ["ingredientes"], queryFn: getIngredientes });

  const { data: productos, isLoading, isError } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const createMut = useMutation({
    mutationFn: createProducto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["productos"] }); closeModal(); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductoCreate> }) => updateProducto(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["productos"] }); closeModal(); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });

  const openModal = (prod?: Producto) => {
    if (prod) {
      setEditingId(prod.id);
      setFormData({
        nombre: prod.nombre,
        descripcion: prod.descripcion || "",
        precio_base: prod.precio_base,
        stock_cantidad: prod.stock_cantidad,
        disponible: prod.disponible,
        categoria_ids: prod.categorias?.map((c) => c.id) || [],
        ingrediente_ids: prod.ingredientes?.map((i) => i.id) || [],
      });
    } else {
      setEditingId(null);
      setFormData(EMPTY_FORM);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMut.mutate({ id: editingId, data: formData });
    } else {
      createMut.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Productos" buttonLabel="Nuevo Producto" onAdd={() => openModal()} />

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorAlert message="Error al cargar los productos." />}

      {productos && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categorías</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{prod.categorias?.map((c) => c.nombre).join(", ") || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prod.precio_base}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.stock_cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prod.disponible ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Disponible</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">No Disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(prod)} className="text-primary-600 hover:text-primary-900 mx-2 p-1 rounded hover:bg-primary-50 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMut.mutate(prod.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No hay productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ProductoModal
        isOpen={isModalOpen}
        editingId={editingId}
        formData={formData}
        categorias={categorias}
        ingredientes={ingredientes}
        isPending={createMut.isPending || updateMut.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onChange={setFormData}
      />
    </div>
  );
}
