import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación
import { Navigate } from "react-router"; // Importa el componente para redirigir a otra ruta

// Componente para proteger al usuario de re-loguearse
export function PublicRoute({ children }) {
  const { user, loading } = useAuth(); // Extrae el usuario y el estado de carga del contexto de autenticación

  if (loading) return <h1>Loading...</h1>; 

  if (user) return <Navigate to="/" replace />; // Si el usuario está autenticado, lo redirigimos a la ruta "/"

  return <>{children}</>; // Si no está autenticado, le permitimos acceder a la ruta pública
}