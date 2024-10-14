import { useAuth } from "../context/authContext";
import { Navigate } from "react-router";

export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <h1>Loading...</h1>; // Puedes personalizar el mensaje de loading

  if (user) return <Navigate to="/" replace />; // Si el usuario está autenticado, lo redirigimos a la ruta "/"

  return <>{children}</>; // Si no está autenticado, le permitimos acceder a la ruta pública
}