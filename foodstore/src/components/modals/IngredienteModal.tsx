import { ModalWrapper } from "../ModalWrapper";
import type { IngredienteCreate } from "../../types";

interface IngredienteModalProps {
  isOpen: boolean;
  editingId: number | null;
  formData: IngredienteCreate;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: IngredienteCreate) => void;
}

/**
 * Modal de creación/edición de un Ingrediente.
 * Contiene el formulario con sus campos y lógica de presentación.
 */
export function IngredienteModal({
  isOpen,
  editingId,
  formData,
  isPending,
  onClose,
  onSubmit,
  onChange,
}: IngredienteModalProps) {
  if (!isOpen) return null;

  return (
    <ModalWrapper
      title={editingId ? "Editar Ingrediente" : "Nuevo Ingrediente"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
              placeholder="Ej: Tomate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.descripcion || ""}
              onChange={(e) => onChange({ ...formData, descripcion: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow resize-none h-24"
              placeholder="Descripción opcional..."
            />
          </div>

          <div className="flex items-center mt-2">
            <input
              id="modal-alergeno"
              type="checkbox"
              checked={formData.es_alergeno}
              onChange={(e) => onChange({ ...formData, es_alergeno: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="modal-alergeno" className="ml-2 block text-sm text-gray-900">
              Es alérgeno
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
