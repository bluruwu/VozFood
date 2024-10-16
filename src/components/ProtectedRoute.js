import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación
import { Navigate } from "react-router"; // Importa el componente para redirigir a otra ruta

// Componente para proteger rutas que requieren autenticación
export function ProtectedRoute({children}) {
    const { user, loading } = useAuth(); // Extrae el usuario y el estado de carga del contexto de autenticación

    // Si la autenticación está cargando, muestra un mensaje de "loading"
    if (loading) return <h1>loading</h1>;

    // Si no hay un usuario autenticado, redirige a la página de inicio de sesión
    if (!user) return <Navigate to='/login'/>;

    // Si hay un usuario autenticado, renderiza los componentes hijos de la ruta protegida
    return <>{children}</>;
}
