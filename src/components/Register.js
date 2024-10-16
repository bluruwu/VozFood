import { useState } from "react";
import { useAuth } from "../context/authContext"; // Importa el contexto de autenticación
import { useNavigate } from "react-router"; // Importa el hook para navegación
import { Alert } from "./Alert"; // Importa el componente de alerta para mostrar errores
import { FaUserPlus, FaUser, FaLock } from "react-icons/fa"; // Iconos para mejorar la UI

export default function Register() {
  const navigate = useNavigate(); // Hook para redirigir a otras rutas
  const [user, setUser] = useState({
    email: "", // Estado para el campo de email
    password: "", // Estado para el campo de password
  });
  const [error, setError] = useState(); // Estado para manejar los mensajes de error
  const [loading, setLoading] = useState(false); // Estado para manejar el botón de carga

  // Función para manejar los cambios en los campos del formulario
  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value }); // Actualiza el estado de 'user' con el valor ingresado
  };

  const { singup } = useAuth(); // Extrae la función de registro desde el contexto de autenticación

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    setError(''); // Reinicia los errores antes de cada intento
    e.preventDefault(); // Previene que la página se recargue al enviar el formulario
    setLoading(true); // Activa el estado de carga mientras se procesa el registro

    try {
      await singup(user.email, user.password); // Intenta registrar al usuario con email y contraseña
      navigate("/"); // Redirige al usuario a la página de inicio si el registro es exitoso
    } catch (error) {
      // Manejo de errores específicos de Firebase para mostrar mensajes más descriptivos
      if (error.code === 'auth/weak-password') {
        setError("La contraseña debe de tener mínimo 6 caracteres");
      } else if (error.code === 'auth/invalid-email') {
        setError("Correo inválido, intenta nuevamente");
      } else if (error.code === 'auth/email-already-in-use') {
        setError("Correo ya registrado, intenta nuevamente");
      } else {
        setError(error.message); // Cualquier otro error es mostrado directamente
      }
    } finally {
      setLoading(false); // Asegura que el estado de carga se detenga al finalizar
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-300 to-yellow-300">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
        {/* Muestra la alerta si hay un error */}
        {error && <Alert message={error} />}
        
        {/* Título de registro */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
          <FaUserPlus className="mr-2 text-orange-500" /> {/* Icono de usuario con "+" */}
          Crear Cuenta
        </h2>

        {/* Formulario de registro */}
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
              placeholder="youremail@company.com" // Placeholder para el campo de email
              onChange={handleChange} // Llama a la función para manejar cambios
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              required // Hace que el campo sea obligatorio
            />
          </div>

          {/* Campo de contraseña */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <FaLock className="absolute left-3 top-10 text-gray-400" /> {/* Icono de candado */}
            <input
              type="password"
              name="password"
              placeholder="********" // Placeholder para el campo de contraseña
              onChange={handleChange} // Llama a la función para manejar cambios
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              required // Hace que el campo sea obligatorio
            />
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300 flex items-center justify-center"
            disabled={loading} // Desactiva el botón cuando el estado de carga está activo
          >
            {loading ? (
              // Muestra un spinner de carga si está en proceso
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
              "Registrarse" // Texto cuando el botón no está en estado de carga
            )}
          </button>
        </form>

        {/* Opción para redirigir al inicio de sesión si ya tienes una cuenta */}
        <p className="mt-4 text-center text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}