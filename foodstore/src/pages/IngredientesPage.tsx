import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIngredientes, createIngrediente, updateIngrediente, deleteIngrediente } from "../api/ingredientes";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import type { Ingrediente, IngredienteCreate } from "../types";
import { PageHeader } from "../components/PageHeader";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorAlert } from "../components/ErrorAlert";
import { IngredienteModal } from "../components/modals/IngredienteModal";

const EMPTY_FORM: IngredienteCreate = { nombre: "", descripcion: "", es_alergeno: false };

export function IngredientesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<IngredienteCreate>(EMPTY_FORM);

  const { data: ingredientes, isLoading, isError } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
  });

  const createMut = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["ingredientes"] }); closeModal(); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IngredienteCreate> }) => updateIngrediente(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["ingredientes"] }); closeModal(); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ingredientes"] }),
  });

  const openModal = (ing?: Ingrediente) => {
    if (ing) {
      setEditingId(ing.id);
      setFormData({ nombre: ing.nombre, descripcion: ing.descripcion || "", es_alergeno: ing.es_alergeno });
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
      <PageHeader title="Ingredientes" buttonLabel="Nuevo Ingrediente" onAdd={() => openModal()} />

      {isLoading && <LoadingSpinner />}
      {isError && <ErrorAlert message="Error al cargar los ingredientes." />}

      {ingredientes && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Alergeno</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ingredientes.map((ing) => (
                <tr key={ing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ing.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ing.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ing.es_alergeno ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3" /> Sí
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(ing)} className="text-primary-600 hover:text-primary-900 mx-2 p-1 rounded hover:bg-primary-50 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMut.mutate(ing.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {ingredientes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No hay ingredientes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <IngredienteModal
        isOpen={isModalOpen}
        editingId={editingId}
        formData={formData}
        isPending={createMut.isPending || updateMut.isPending}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onChange={setFormData}
      />
    </div>
  );
}
