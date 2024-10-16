import { useState } from "react"; 
import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación
import { useNavigate } from "react-router"; // Importa la función para la navegación entre rutas
import { Alert } from "./Alert"; // Componente para mostrar alertas
import { FaUser, FaLock } from "react-icons/fa"; // Iconos para los campos de usuario y contraseña

export default function Login() {
  const navigate = useNavigate(); // Hook para redirigir al usuario a otras rutas
  const [user, setUser] = useState({
    email: "", // Almacena el valor del email
    password: "", // Almacena el valor del password
  });
  const [error, setError] = useState(); // Almacena cualquier error de autenticación
  const [loading, setLoading] = useState(false); // Estado para manejar el botón de carga

  // Función para actualizar los campos del formulario
  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value }); // Actualiza el valor del campo correspondiente (email o password)
  };

  const { login } = useAuth(); // Obtiene la función de inicio de sesión del contexto de autenticación

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la recarga de la página al enviar el formulario
    setError(""); // Reinicia el estado de error antes de cada intento
    setLoading(true); // Activa el estado de carga mientras se procesa la autenticación

    try {
      await login(user.email, user.password); // Intenta iniciar sesión con las credenciales proporcionadas
      navigate("/"); // Redirige al usuario a la página de inicio si la autenticación es exitosa
    } catch (error) {
      setLoading(false); // Desactiva el estado de carga si ocurre un error
      if (error.code === "auth/invalid-credential") {
        setError("Usuario o Contraseña incorrectos"); // Mensaje específico para error de credenciales
      } else {
        setError(error.message); // Mensaje general para otros errores
      }
    } finally {
      setLoading(false); // Asegura que el estado de carga se desactive siempre, independientemente de si hay error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-300 to-yellow-300">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
        {/* Muestra la alerta si hay un error */}
        {error && <Alert message={error} />}
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
        
        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de email */}
          <div className="relative">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <FaUser className="absolute left-3 top-10 text-gray-400" /> {/* Icono de usuario */}
            <input
              type="email"
              name="email"
              placeholder="youremail@company.com" // Ejemplo para el placeholder
              onChange={handleChange} // Llama a la función para actualizar el estado al cambiar el campo
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              required // Campo obligatorio
            />
          </div>

          {/* Campo de password */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <FaLock className="absolute left-3 top-10 text-gray-400" /> {/* Icono de candado */}
            <input
              type="password"
              name="password"
              placeholder="********" // Placeholder para el password
              onChange={handleChange} // Actualiza el estado al cambiar el valor del campo
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              required // Campo obligatorio
            />
          </div>

          {/* Botón para iniciar sesión */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300 flex items-center justify-center"
            disabled={loading} // Desactiva el botón cuando está en estado de carga
          >
            {/* Muestra un spinner mientras está cargando */}
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l-2 2-2-2V4a8 8 0 018 8H4z"
                ></path>
              </svg>
            ) : (
              "Iniciar Sesión" // Texto del botón cuando no está cargando
            )}
          </button>
        </form>

        {/* Opción para ir a la página de registro */}
        <p className="mt-4 text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-orange-500 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}