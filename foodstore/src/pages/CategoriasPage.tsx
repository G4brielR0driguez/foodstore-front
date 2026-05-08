import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../api/categorias";
import { Pencil, Trash2 } from "lucide-react";
import type { Categoria, CategoriaCreate } from "../types";
import { PageHeader } from "../components/PageHeader";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";
import { CategoriaModal } from "../components/modals/CategoriaModal";

const EMPTY_FORM: CategoriaCreate = { nombre: "", descripcion: "", imagen_url: "", parent_id: null };

export function CategoriasPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CategoriaCreate>(EMPTY_FORM);

  const { data: categorias, isLoading, isError } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const createMut = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categorias"] }); closeModal(); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoriaCreate> }) => updateCategoria(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categorias"] }); closeModal(); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categorias"] }),
  });

  const openModal = (cat?: Categoria) => {
    if (cat) {
      setEditingId(cat.id);
      setFormData({ nombre: cat.nombre, descripcion: cat.descripcion || "", imagen_url: cat.imagen_url || "", parent_id: cat.parent_id });
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
      <PageHeader title="Categorías" buttonLabel="Nueva Categoría" onAdd={() => openModal()} />

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorAlert message="Error al cargar las categorías." />}

      {categorias && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría Padre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categorias.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cat.parent_id ? categorias.find((c) => c.id === cat.parent_id)?.nombre || `ID: ${cat.parent_id}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.descripcion || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(cat)} className="text-primary-600 hover:text-primary-900 mx-2 p-1 rounded hover:bg-primary-50 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMut.mutate(cat.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No hay categorías registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CategoriaModal
        isOpen={isModalOpen}
        editingId={editingId}
        formData={formData}
        categorias={categorias ?? []}
        isPending={createMut.isPending || updateMut.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onChange={setFormData}
      />
    </div>
  );
}
