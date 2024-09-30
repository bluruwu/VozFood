import { FaExclamationTriangle } from "react-icons/fa";
export function Alert({ message }) {
  return (
    <div className="flex items-center mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md transition-transform transform hover:scale-105 animate-pulse">
      <FaExclamationTriangle className="mr-2 text-red-600" />
      <span className="flex-1">{message}</span>
      <button
        onClick={() => window.location.reload()} // O agrega una lógica para cerrar la alerta
        className="ml-4 text-red-600 hover:text-red-800 transition duration-300"
      >
        ✖
      </button>
    </div>
  );
}
