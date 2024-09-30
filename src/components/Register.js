import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router";
import { Alert } from "./Alert";
import { FaUserPlus,FaUser, FaLock } from "react-icons/fa";
export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error,setError]=useState()
  const [loading, setLoading] = useState(false);
  
  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };
  const { singup } = useAuth();

  const handleSubmit = async (e) => {
    setError('')
    e.preventDefault();
    setLoading(true);

    try {
      await singup(user.email, user.password);
      navigate("/");
    } catch (error) {
        if(error.code==='auth/weak-password'){
            setError("La contraseña debe de tener minimo 6 caracteres")
        }else if(error.code==='auth/invalid-email'){
            setError("Correo invalido, intenta nuevamente")
        }else if(error.code==='auth/email-already-in-use'){
            setError("Correo ya registrado, intenta nuevamente")
        }else{
            setError(error.message)
        }
    }finally {
      setLoading(false); // Asegúrate de detener el estado de carga incluso si hay un error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-300 to-yellow-300">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
        {error && <Alert message={error} />}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
          <FaUserPlus className="mr-2 text-orange-500" />
          Crear Cuenta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <FaUser className="absolute left-3 top-10 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="youremail@company.com"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <FaLock className="absolute left-3 top-10 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="********"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300 flex items-center justify-center"
            disabled={loading}
          >
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
              "Registrarse"
            )}
          </button>
        </form>

        {/* Opcional: Link de inicio de sesión */}
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
