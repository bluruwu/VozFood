import React, { useState, useEffect } from 'react';
import api from '../services/services';
import { useAuth } from '../context/authContext';
import { FaUserCircle } from "react-icons/fa"; // Ícono de usuario, puedes elegir otro

export default function Home() {
  const { user, logout } = useAuth();
  const [showPedidosModal, setShowPedidosModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  let recognition;

  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.listAllCategories();
        setCategories(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();     
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz: ", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleOpenCategory = async (category) => {
    try {
      const response = await api.filterByCategory(category);
      setMeals(response.meals);
      setActiveCategory(category);
    } catch (error) {
      console.error('Error fetching meals by category:', error);
    }
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
    setMeals([]);
  };

  const handleOpenMealModal = async (mealId) => {
    try {
      const response = await api.lookupMealById(mealId);
      const meal = response.meals[0];
      setSelectedFood(meal);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching meal details:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    const newPedido = {
      comida: selectedFood.strMeal,
      vozReconocida: inputValue,
    };

    const pedidosGuardados = JSON.parse(localStorage.getItem('listaPedidos')) || [];
    const updatedPedidos = [...pedidosGuardados, newPedido];
    localStorage.setItem('listaPedidos', JSON.stringify(updatedPedidos));

    alert("Pedido guardado exitosamente");
    handleCloseModal();
  };

  const handleShowPedidos = () => {
    const savedPedidos = JSON.parse(localStorage.getItem('listaPedidos')) || [];
    setPedidos(savedPedidos);
    setShowPedidosModal(true);
  };

  const handleClosePedidosModal = () => {
    setShowPedidosModal(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-orange-300 to-yellow-300">
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

        <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menú</h2>
          <p className="text-gray-600">Escoga el plato que usted desee ordenar.</p>

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

        {showModal && selectedFood && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50" onClick={handleCloseModal}>
            <div className="bg-white p-4 rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-bold mb-2">Seleccionaste: {selectedFood.strMeal}</h2>
              <img src={selectedFood.strMealThumb} alt={selectedFood.strMeal} className="w-full h-64 object-cover mb-4" />
              <h3 className="text-md font-semibold mb-2">Ingredientes:</h3>
              <ul className="list-disc list-inside">
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
                <button
                  className={`px-4 py-2 rounded ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  onClick={handleVoiceInput}
                >
                  {isListening ? 'Parar' : 'Hablar'}
                </button>

                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Enviar
                </button>

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