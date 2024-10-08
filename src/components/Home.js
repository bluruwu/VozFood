import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaCog, FaShoppingCart } from "react-icons/fa";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showPedidosModal, setShowPedidosModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedFood, setSelectedFood] = useState('');
  const [foodImage, setFoodImage] = useState('');
  const [pedidos, setPedidos] = useState([]);

  let recognition;

  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }

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

  const handleOpenModal = (foodType, foodImageSrc) => {
    setSelectedFood(foodType);
    setFoodImage(foodImageSrc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    const newPedido = {
      comida: selectedFood,
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

  // Descripciones de ingredientes y sus pesos
  const foodDescriptions = {
    hamburguesa: [
      { ingrediente: 'Pan', peso: '80g' },
      { ingrediente: 'Carne de res', peso: '150g' },
      { ingrediente: 'Queso', peso: '30g' },
      { ingrediente: 'Lechuga', peso: '15g' },
      { ingrediente: 'Tomate', peso: '20g' },
    ],
    pizza: [
      { ingrediente: 'Masa', peso: '200g' },
      { ingrediente: 'Queso', peso: '100g' },
      { ingrediente: 'Pepperoni', peso: '50g' },
      { ingrediente: 'Salsa de tomate', peso: '70g' },
      { ingrediente: 'Aceitunas', peso: '20g' },
    ],
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-orange-300 to-yellow-300">
      <aside className="w-64 bg-white shadow-md h-screen p-6 rounded-lg">
      <img src="/imgs/Gourmet.png" alt="Logo Gourmet" className="w-32 h-auto mx-auto mb-6" />
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
                onClick={handleShowPedidos}
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

          <div className="flex space-x-4 mt-4">
            <div
              className="w-32 h-32 bg-gray-300 cursor-pointer"
              onClick={() => handleOpenModal('hamburguesa', '/imgs/hmbr.jpg')}
            >
              <img src="/imgs/hmbr.jpg" alt="Hamburguesa" className="w-full h-full object-cover" />
            </div>

            <div
              className="w-32 h-32 bg-gray-300 cursor-pointer"
              onClick={() => handleOpenModal('pizza', '/imgs/pizza.jpg')}
            >
              <img src="/imgs/pizza.jpg" alt="Pizza" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
              <h2 className="text-lg font-bold mb-2">Seleccionaste: {selectedFood}</h2>
              <img src={foodImage} alt={selectedFood} className="w-32 h-32 object-cover mx-auto mb-4" />

              {/* Mostrar la descripción de los ingredientes */}
              <div className="text-left mt-4">
                <h3 className="text-md font-semibold mb-2">Ingredientes:</h3>
                <ul className="list-disc list-inside">
                  {foodDescriptions[selectedFood]?.map((item, index) => (
                    <li key={index}>
                      {item.ingrediente}: {item.peso}
                    </li>
                  ))}
                </ul>
              </div>

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
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
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
