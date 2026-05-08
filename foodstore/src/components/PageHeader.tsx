import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  buttonLabel: string;
  onAdd: () => void;
}

/**
 * Encabezado reutilizable para las páginas de listado.
 * Muestra el título de la sección y un botón para agregar un nuevo elemento.
 */
export function PageHeader({ title, buttonLabel, onAdd }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h2>
      <button
        onClick={onAdd}
        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
      >
        <Plus className="w-5 h-5" />
        {buttonLabel}
      </button>
    </div>
  );
}
