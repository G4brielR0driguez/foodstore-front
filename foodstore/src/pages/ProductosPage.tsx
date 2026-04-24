import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductos, createProducto, updateProducto, deleteProducto, type Producto, type ProductoCreate } from "../api/productos";
import { getCategorias } from "../api/categorias";
import { getIngredientes } from "../api/ingredientes";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export function ProductosPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<ProductoCreate>({
    nombre: "",
    descripcion: "",
    precio_base: 0,
    stock_cantidad: 0,
    disponible: true,
    categoria_ids: [],
    ingrediente_ids: []
  });

  const { data: categorias } = useQuery({ queryKey: ["categorias"], queryFn: getCategorias });
  const { data: ingredientes } = useQuery({ queryKey: ["ingredientes"], queryFn: getIngredientes });

  const { data: productos, isLoading, isError } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos
  });

  const createMut = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      closeModal();
    }
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductoCreate> }) => updateProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      closeModal();
    }
  });

  const deleteMut = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    }
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
        categoria_ids: prod.categorias?.map(c => c.id) || [],
        ingrediente_ids: prod.ingredientes?.map(i => i.id) || []
      });
    } else {
      setEditingId(null);
      setFormData({ 
        nombre: "", 
        descripcion: "", 
        precio_base: 0, 
        stock_cantidad: 0, 
        disponible: true,
        categoria_ids: [],
        ingrediente_ids: []
      });
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Productos</h2>
        <button
          onClick={() => openModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Nuevo Producto
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {isError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error al cargar los productos.
        </div>
      )}

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
                  <td className="px-6 py-4 text-sm text-gray-500">{prod.categorias?.map(c => c.nombre).join(", ") || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prod.precio_base}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.stock_cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prod.disponible ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No Disponible
                      </span>
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
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ej: Hamburguesa Clásica"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={formData.descripcion || ""}
                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none h-20"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                      {categorias?.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={formData.categoria_ids.includes(cat.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setFormData({ ...formData, categoria_ids: [...formData.categoria_ids, cat.id] });
                              } else {
                                setFormData({ ...formData, categoria_ids: formData.categoria_ids.filter(id => id !== cat.id) });
                              }
                            }}
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{cat.nombre}</span>
                        </label>
                      ))}
                      {(!categorias || categorias.length === 0) && (
                        <span className="text-sm text-gray-500">No hay categorías</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                      {ingredientes?.map(ing => (
                        <label key={ing.id} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={formData.ingrediente_ids.includes(ing.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setFormData({ ...formData, ingrediente_ids: [...formData.ingrediente_ids, ing.id] });
                              } else {
                                setFormData({ ...formData, ingrediente_ids: formData.ingrediente_ids.filter(id => id !== ing.id) });
                              }
                            }}
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{ing.nombre}</span>
                        </label>
                      ))}
                      {(!ingredientes || ingredientes.length === 0) && (
                        <span className="text-sm text-gray-500">No hay ingredientes</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.precio_base}
                      onChange={e => setFormData({ ...formData, precio_base: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stock_cantidad}
                      onChange={e => setFormData({ ...formData, stock_cantidad: parseInt(e.target.value, 10) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <input
                    id="disponible"
                    type="checkbox"
                    checked={formData.disponible}
                    onChange={e => setFormData({ ...formData, disponible: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="disponible" className="ml-2 block text-sm text-gray-900">
                    Disponible
                  </label>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMut.isPending || updateMut.isPending}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {createMut.isPending || updateMut.isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
