interface ErrorAlertProps {
  message: string;
}

/**
 * Alerta de error reutilizable.
 * Muestra un mensaje de error con estilos consistentes en toda la app.
 */
export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
      {message}
    </div>
  );
}
