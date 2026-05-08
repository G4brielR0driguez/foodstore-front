import { ModalWrapper } from "../ModalWrapper";
import type { Categoria, CategoriaCreate } from "../../types";

interface CategoriaModalProps {
  isOpen: boolean;
  editingId: number | null;
  formData: CategoriaCreate;
  categorias: Categoria[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: CategoriaCreate) => void;
}

/**
 * Modal de creación/edición de una Categoría.
 * Contiene el formulario con sus campos y lógica de presentación.
 */
export function CategoriaModal({
  isOpen,
  editingId,
  formData,
  categorias,
  isPending,
  onClose,
  onSubmit,
  onChange,
}: CategoriaModalProps) {
  if (!isOpen) return null;

  return (
    <ModalWrapper
      title={editingId ? "Editar Categoría" : "Nueva Categoría"}
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
              placeholder="Ej: Bebidas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría Padre</label>
            <select
              value={formData.parent_id || ""}
              onChange={(e) =>
                onChange({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : null })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-white"
            >
              <option value="">Ninguna (Categoría principal)</option>
              {categorias
                .filter((c) => c.id !== editingId)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
            </select>
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
