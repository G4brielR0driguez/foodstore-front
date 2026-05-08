import { X } from "lucide-react";

interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Envoltorio genérico para modales.
 * Proporciona el overlay, el panel blanco, el encabezado con título y botón de cierre.
 * El contenido del modal se pasa como children.
 */
export function ModalWrapper({ title, onClose, children }: ModalWrapperProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
