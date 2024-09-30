//import { useNavigate } from "react-router";
import { useAuth } from "../context/authContext";
import { FaClipboardList, FaCog, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";

export default function Home() {
  const { user, logout, loading } = useAuth();
  console.log(user);

  const handleLogout = async () => {
    try {
        await logout();
    } catch (error) {
        console.loğ(error)
    }
  };

  if (loading) return <h1>loading...</h1>

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-orange-300 to-yellow-300">
      {/* Sidebar Izquierdo */}
      <aside className="w-64 bg-white shadow-md h-screen p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel</h2>
        {/* Navegación */}
        <nav>
          <ul>
            <li>
              <button className="flex items-center w-full text-left py-2 px-4 rounded-md hover:bg-orange-100 transition duration-300">
                <FaShoppingCart className="mr-2 text-orange-500" />
                Haz tu pedido
              </button>
            </li>
            <li>
              <button className="flex items-center w-full text-left py-2 px-4 rounded-md hover:bg-orange-100 transition duration-300">
                <FaClipboardList className="mr-2 text-orange-500" />
                Pedidos
              </button>
            </li>
            <li>
              <button className="flex items-center w-full text-left py-2 px-4 rounded-md hover:bg-orange-100 transition duration-300">
                <FaCog className="mr-2 text-orange-500" />
                Configuraciones
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Panel Principal */}
      <div className="flex-1 p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido, <span className="text-orange-600">{user.email}</span>
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </header>

        {/* Contenido Principal */}
        <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Panel Central</h2>
          <p className="text-gray-600">
            Este es el panel donde puedes agregar la información o acciones que necesitas mostrar en la pantalla principal.
          </p>
        </div>
      </div>
    </div>
  );
}
