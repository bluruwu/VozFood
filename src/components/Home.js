import React, { useState, useEffect } from 'react';
import api from '../services/services'; // Importa los servicios para interactuar con la API
import { useAuth } from '../context/authContext'; // Importa el contexto de autenticación
import { FaUserCircle } from "react-icons/fa"; // Ícono de usuario

export default function Home() {
  const { user, logout } = useAuth(); // Extrae el usuario y la función logout del contexto de autenticación
  const [showPedidosModal, setShowPedidosModal] = useState(false); // Controla la visibilidad del modal de pedidos
  const [inputValue, setInputValue] = useState(''); // Guarda el valor del input de voz
  const [isListening, setIsListening] = useState(false); // Controla si el reconocimiento de voz está activo
  const [selectedFood, setSelectedFood] = useState(null); // Guarda la comida seleccionada
  const [pedidos, setPedidos] = useState([]); // Guarda el historial de pedidos
  const [categories, setCategories] = useState([]); // Guarda las categorías de comida disponibles
  const [meals, setMeals] = useState([]); // Guarda las comidas filtradas por categoría
  const [activeCategory, setActiveCategory] = useState(null); // Controla la categoría seleccionada
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal de detalles de comida
  let recognition; // Variable para manejar la instancia del reconocimiento de voz

  // Configuración del reconocimiento de voz si está disponible en el navegador
  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'es-ES'; // Establece el idioma español
    recognition.interimResults = false; // No muestra resultados intermedios
    recognition.maxAlternatives = 1; // Una sola alternativa de reconocimiento
  }

  // useEffect para cargar las categorías de comidas al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.listAllCategories(); // Llama a la API para obtener las categorías
        setCategories(response.categories); // Actualiza el estado con las categorías
      } catch (error) {
        console.error('Error fetching categories:', error); // Manejo de errores
      }
    };

    fetchCategories(); // Llama a la función de obtención de categorías
  }, []);

  // Maneja el cierre de sesión del usuario
  const handleLogout = async () => {
    try {
      await logout(); // Llama a la función de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error); // Manejo de errores al cerrar sesión
    }
  };

  // Maneja la entrada de voz utilizando el reconocimiento de voz
  const handleVoiceInput = () => {
    if (!isListening) {
      recognition.start(); // Inicia el reconocimiento de voz
      setIsListening(true); // Actualiza el estado de escucha

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Obtiene el texto reconocido
        setInputValue(transcript); // Actualiza el valor del input con el texto reconocido
      };

      recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz: ", event.error); // Manejo de errores
        setIsListening(false); // Detiene la escucha en caso de error
      };

      recognition.onend = () => {
        setIsListening(false); // Detiene la escucha al finalizar el reconocimiento
      };
    } else {
      recognition.stop(); // Detiene el reconocimiento de voz si está activo
      setIsListening(false); // Actualiza el estado de escucha
    }
  };

  // Maneja la apertura de una categoría y carga las comidas correspondientes
  const handleOpenCategory = async (category) => {
    try {
      const response = await api.filterByCategory(category); // Filtra las comidas por categoría
      setMeals(response.meals); // Actualiza el estado de comidas filtradas
      setActiveCategory(category); // Establece la categoría activa
    } catch (error) {
      console.error('Error fetching meals by category:', error); // Manejo de errores
    }
  };

  // Maneja el regreso a la lista de categorías
  const handleBackToCategories = () => {
    setActiveCategory(null); // Elimina la categoría activa
    setMeals([]); // Limpia la lista de comidas
  };

  // Abre el modal con los detalles de la comida seleccionada
  const handleOpenMealModal = async (mealId) => {
    try {
      const response = await api.lookupMealById(mealId); // Busca los detalles de la comida por ID
      const meal = response.meals[0]; // Obtiene la comida
      setSelectedFood(meal); // Establece la comida seleccionada
      setShowModal(true); // Muestra el modal de detalles
    } catch (error) {
      console.error('Error fetching meal details:', error); // Manejo de errores
    }
  };

  // Cierra el modal de detalles de comida
  const handleCloseModal = () => {
    setShowModal(false); // Oculta el modal
  };

  // Guarda el pedido en el localStorage
  const handleSave = () => {
    const newPedido = {
      comida: selectedFood.strMeal, // Nombre de la comida seleccionada
      vozReconocida: inputValue, // Texto reconocido por voz
    };

    const pedidosGuardados = JSON.parse(localStorage.getItem('listaPedidos')) || []; // Obtiene los pedidos almacenados
    const updatedPedidos = [...pedidosGuardados, newPedido]; // Añade el nuevo pedido
    localStorage.setItem('listaPedidos', JSON.stringify(updatedPedidos)); // Guarda el pedido en el localStorage

    alert("Pedido guardado exitosamente"); // Muestra un mensaje de éxito
    handleCloseModal(); // Cierra el modal
  };

  // Muestra el modal de historial de pedidos
  const handleShowPedidos = () => {
    const savedPedidos = JSON.parse(localStorage.getItem('listaPedidos')) || []; // Obtiene los pedidos del localStorage
    setPedidos(savedPedidos); // Actualiza el estado con los pedidos obtenidos
    setShowPedidosModal(true); // Muestra el modal de pedidos
  };
  
  // Cierra el modal de pedidos
  const handleClosePedidosModal = () => {
    setShowPedidosModal(false); // Oculta el modal de pedidos
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-orange-300 to-yellow-300">
      {/* Barra lateral */}
      <aside className="w-64 bg-white shadow-md h-screen p-6 rounded-lg flex flex-col">
        <img src="/imgs/Gourmet.png" alt="Logo Gourmet" className="w-32 h-auto mx-auto mb-6" />
        <nav className='flex-grow'>
          <ul>
            <li>
              <button className="flex items-center w-full text-left py-2 px-4 rounded-md hover:bg-orange-100 transition duration-300">
                Haz tu pedido
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full text-left py-2 px-4 rounded-md hover:bg-orange-100 transition duration-300"
                onClick={handleShowPedidos}
              >
                Pedidos
              </button>
            </li>
            <li>
              <button className="flex items-center w-full text-left py-2 px-4 rounded-md hover:bg-orange-100 transition duration-300">
                Configuraciones
              </button>
            </li>
          </ul>
        </nav>

        {/* Botón para cerrar sesión */}
        {user && (
          <div 
            className="flex items-center w-full text-left py-2 px-2 rounded-md hover:bg-orange-100 transition duration-300 cursor-pointer"
            onClick={handleLogout}>
            <button
              className="flex items-center focus:outline-none"
            >
              <FaUserCircle size={30} />
              <p className=' ml-2'>
                Cerrar sesión
              </p>
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 p-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
        </header>

        {/* Contenedor del menú */}
        <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menú</h2>
          <p className="text-gray-600">Escoga el plato que usted desee ordenar.</p>

          {/* Muestra comidas filtradas por categoría o lista de categorías */}
          {activeCategory ? (
            <div>
              <button
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleBackToCategories}
              >
                Volver a Categorías
              </button>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {meals.map((meal) => (
                  <div
                    key={meal.idMeal}
                    className="bg-gray-300 cursor-pointer rounded-lg overflow-hidden shadow-md"
                    onClick={() => handleOpenMealModal(meal.idMeal)}
                  >
                    <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-32 object-cover" />
                    <div className="p-2 text-center">
                      <h3 className="text-sm font-semibold text-gray-700">{meal.strMeal}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {categories.map((category) => (
                <div
                  key={category.idCategory}
                  className="bg-gray-300 cursor-pointer rounded-lg overflow-hidden shadow-md"
                  onClick={() => handleOpenCategory(category.strCategory)}
                >
                  <img src={category.strCategoryThumb} alt={category.strCategory} className="w-full h-32 object-cover" />
                  <div className="p-2 text-center">
                    <h3 className="text-sm font-semibold text-gray-700">{category.strCategory}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de detalles de la comida */}
        {showModal && selectedFood && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50" onClick={handleCloseModal}>
            <div className="bg-white p-4 rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-bold mb-2">Seleccionaste: {selectedFood.strMeal}</h2>
              <img src={selectedFood.strMealThumb} alt={selectedFood.strMeal} className="w-full h-64 object-cover mb-4" />
              <h3 className="text-md font-semibold mb-2">Ingredientes:</h3>
              <ul className="list-disc list-inside">
                {/* Muestra los ingredientes de la comida seleccionada */}
                {Array.from({ length: 20 }, (_, i) => i + 1).map((index) => {
                  const ingredient = selectedFood[`strIngredient${index}`];
                  const measure = selectedFood[`strMeasure${index}`];
                  return ingredient ? (
                    <li key={index}>
                      {ingredient} - {measure}
                    </li>
                  ) : null;
                })}
              </ul>
              <textarea
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border-2 border-gray-300 p-2 w-full mt-4"
              />

              <div className="mt-4 flex justify-between ">
                {/* Botón para iniciar/detener el reconocimiento de voz */}
                <button
                  className={`px-4 py-2 rounded ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  onClick={handleVoiceInput}
                >
                  {isListening ? 'Parar' : 'Hablar'}
                </button>

                {/* Botón para guardar el pedido */}
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Enviar
                </button>

                {/* Botón para cerrar el modal */}
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de historial de pedidos */}
        {showPedidosModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50" onClick={handleClosePedidosModal}>
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-bold mb-4">Historial de Pedidos</h2>

              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Pedido</th>
                    <th className="border border-gray-300 p-2">Voz Reconocida</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length > 0 ? (
                    pedidos.map((pedido, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">{pedido.comida}</td>
                        <td className="border border-gray-300 p-2">{pedido.vozReconocida}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="border border-gray-300 p-2 text-center">
                        No hay pedidos realizados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-4 flex justify-end">
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleClosePedidosModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}