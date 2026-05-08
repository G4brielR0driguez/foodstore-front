import { ModalWrapper } from "../ModalWrapper";
import type { Categoria, Ingrediente, ProductoCreate } from "../../types";

interface ProductoModalProps {
  isOpen: boolean;
  editingId: number | null;
  formData: ProductoCreate;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: ProductoCreate) => void;
}

/**
 * Modal de creación/edición de un Producto.
 * Incluye selección múltiple de categorías e ingredientes mediante checkboxes.
 */
export function ProductoModal({
  isOpen,
  editingId,
  formData,
  categorias,
  ingredientes,
  isPending,
  onClose,
  onSubmit,
  onChange,
}: ProductoModalProps) {
  if (!isOpen) return null;

  const toggleCategoria = (id: number, checked: boolean) => {
    const updated = checked
      ? [...formData.categoria_ids, id]
      : formData.categoria_ids.filter((cid) => cid !== id);
    onChange({ ...formData, categoria_ids: updated });
  };

  const toggleIngrediente = (id: number, checked: boolean) => {
    const updated = checked
      ? [...formData.ingrediente_ids, id]
      : formData.ingrediente_ids.filter((iid) => iid !== id);
    onChange({ ...formData, ingrediente_ids: updated });
  };

  return (
    <ModalWrapper
      title={editingId ? "Editar Producto" : "Nuevo Producto"}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ej: Hamburguesa Clásica"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.descripcion || ""}
              onChange={(e) => onChange({ ...formData, descripcion: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                {categorias.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.categoria_ids.includes(cat.id)}
                      onChange={(e) => toggleCategoria(cat.id, e.target.checked)}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{cat.nombre}</span>
                  </label>
                ))}
                {categorias.length === 0 && (
                  <span className="text-sm text-gray-500">No hay categorías</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                {ingredientes.map((ing) => (
                  <label key={ing.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.ingrediente_ids.includes(ing.id)}
                      onChange={(e) => toggleIngrediente(ing.id, e.target.checked)}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{ing.nombre}</span>
                  </label>
                ))}
                {ingredientes.length === 0 && (
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
                onChange={(e) =>
                  onChange({ ...formData, precio_base: parseFloat(e.target.value) || 0 })
                }
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
                onChange={(e) =>
                  onChange({ ...formData, stock_cantidad: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center mt-2">
            <input
              id="modal-disponible"
              type="checkbox"
              checked={formData.disponible}
              onChange={(e) => onChange({ ...formData, disponible: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="modal-disponible" className="ml-2 block text-sm text-gray-900">
              Disponible
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
