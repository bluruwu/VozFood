import { FaExclamationTriangle } from "react-icons/fa"; // Importa el icono de exclamación

// Componente Alert para mostrar mensajes de error o advertencia
export function Alert({ message }) {
  return (
    <div className="flex items-center mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md transition-transform transform hover:scale-105 animate-pulse">
      {/* Icono de advertencia */}
      <FaExclamationTriangle className="mr-2 text-red-600" />
      
      {/* Mensaje de la alerta */}
      <span className="flex-1">{message}</span>
      
      {/* Botón para cerrar o recargar la página, se puede modificar según la necesidad */}
      <button
        onClick={() => window.location.reload()} // Recarga la página cuando se hace clic
        className="ml-4 text-red-600 hover:text-red-800 transition duration-300"
      >
        ✖ {/* Icono para cerrar */}
      </button>
    </div>
  );
}
