import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCog, FaShoppingCart } from "react-icons/fa";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showPedidosModal, setShowPedidosModal] = useState(false); // Estado para el modal de pedidos
  const [inputValue, setInputValue] = useState(''); // Estado para el input de voz
  const [isListening, setIsListening] = useState(false); // Estado para controlar si está escuchando
  const [selectedFood, setSelectedFood] = useState(''); // Estado para la comida seleccionada
  const [foodImage, setFoodImage] = useState(''); // Estado para almacenar la imagen seleccionada
  const [pedidos, setPedidos] = useState([]); // Estado para almacenar los pedidos

  let recognition;

  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition(); // Usar la Web Speech API
    recognition.lang = 'es-ES'; // Idioma español
    recognition.interimResults = false; // Solo resultados finales
    recognition.maxAlternatives = 1; // Número de resultados
  }

  // Función para iniciar o detener el reconocimiento de voz
  const handleVoiceInput = () => {
    if (!isListening) {
      recognition.start(); // Iniciar el reconocimiento de voz
      setIsListening(true); // Cambia el estado a escuchando

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Obtener el texto reconocido
        setInputValue(transcript); // Establecer el texto en el input
      };

      recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz: ", event.error);
        setIsListening(false); // Cambia el estado a no escuchando en caso de error
      };

      recognition.onend = () => {
        setIsListening(false); // Cambia el estado cuando termine de escuchar
      };
    } else {
      recognition.stop(); // Detener el reconocimiento de voz
      setIsListening(false); // Cambia el estado a no escuchando
    }
  };

  // Abrir el modal y asignar el tipo de comida y la imagen seleccionada
  const handleOpenModal = (foodType, foodImageSrc) => {
    setSelectedFood(foodType);
    setFoodImage(foodImageSrc); // Establecer la imagen seleccionada
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Función para guardar en localStorage
  const handleSave = () => {
    const newPedido = {
      comida: selectedFood,
      vozReconocida: inputValue,
    };

    // Obtener la lista actual de pedidos en localStorage o inicializarla
    const pedidosGuardados = JSON.parse(localStorage.getItem('listaPedidos')) || [];

    // Agregar el nuevo pedido a la lista
    const updatedPedidos = [...pedidosGuardados, newPedido];

    // Guardar la lista actualizada en localStorage
    localStorage.setItem('listaPedidos', JSON.stringify(updatedPedidos));

    alert("Pedido guardado exitosamente");

    handleCloseModal(); // Cerrar modal después de guardar
  };

  // Función para abrir el modal de pedidos y cargar los pedidos desde localStorage
  const handleShowPedidos = () => {
    const savedPedidos = JSON.parse(localStorage.getItem('listaPedidos')) || [];
    setPedidos(savedPedidos); // Cargar la lista de pedidos en el estado
    setShowPedidosModal(true); // Mostrar el modal de pedidos
  };

  // Función para cerrar el modal de pedidos
  const handleClosePedidosModal = () => {
    setShowPedidosModal(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-orange-300 to-yellow-300">
      <aside className="w-64 bg-white shadow-md h-screen p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel</h2>
        <nav>
          <ul>
            <li>
              <button className="flex items-center w-full text-left py-2 px-4 rounded-md hover:bg-orange-100 transition duration-300">
                <FaShoppingCart className="mr-2 text-orange-500" />
                Haz tu pedido
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full text-left py-2 px-4 rounded-md hover:bg-orange-100 transition duration-300"
                onClick={handleShowPedidos} // Mostrar el modal de pedidos
              >
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

      <div className="flex-1 p-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menú</h2>
          <p className="text-gray-600">Escoga el plato que usted desee ordenar.</p>

          <div
            className="w-32 h-32 bg-gray-300 cursor-pointer mt-4"
            onClick={() => handleOpenModal('hamburguesa', '/imgs/hmbr.jpg')}
          >
            <img src="/imgs/hmbr.jpg" alt="Hamburguesa" className="w-full h-full object-cover" />
          </div>

          <div
            className="w-32 h-32 bg-gray-300 cursor-pointer mt-4"
            onClick={() => handleOpenModal('pizza', '/imgs/pizza.jpg')}
          >
            <img src="/imgs/pizza.jpg" alt="Pizza" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Modal de selección de comida */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-2">Seleccionaste: {selectedFood}</h2>
              <img src={foodImage} alt={selectedFood} className="w-32 h-32 object-cover mx-auto mb-4" />

              {/* Input de voz */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border-2 border-gray-300 p-2 w-full"
              />

              <button
                className={`mt-4 px-4 py-2 rounded ${
                  isListening ? 'bg-red-500' : 'bg-green-500'
                } text-white`}
                onClick={handleVoiceInput}
              >
                {isListening ? 'Parar' : 'Dar voz'}
              </button>

              {/* Botón de enviar */}
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Enviar
              </button>

              <button
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal de pedidos */}
        {showPedidosModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
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
                        No hay pedidos guardados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <button
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleClosePedidosModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

