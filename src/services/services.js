import axios from "axios"; // Importa la librería axios para hacer peticiones HTTP
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'; // URL base de la API de TheMealDB

const api = {
    // Función para buscar una comida por su nombre
    searchMealByName: async (name) => {
        try {
            const response = await axios.get(`${BASE_URL}/search.php?s=${name}`); // Realiza la petición GET con el nombre de la comida
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error searching meal by name:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para listar comidas por la primera letra
    listMealsByFirstLetter: async (letter) => {
        try {
            const response = await axios.get(`${BASE_URL}/search.php?f=${letter}`); // Realiza la petición GET con la letra inicial de la comida
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error listing meals by first letter:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para buscar una comida por su ID
    lookupMealById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`); // Realiza la petición GET con el ID de la comida
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error looking up meal by ID:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para obtener una comida aleatoria
    lookupRandomMeal: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/random.php`); // Realiza la petición GET para obtener una comida aleatoria
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error looking up random meal:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para listar todas las categorías de comidas
    listAllMealCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories.php`); // Realiza la petición GET para obtener todas las categorías de comidas
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error listing all meal categories:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para listar todas las categorías (similar a la anterior)
    listAllCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories.php`); // Realiza la petición GET para obtener todas las categorías de comidas
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error listing all categories:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para listar todas las áreas culinarias
    listAllAreas: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/list.php?a=list`); // Realiza la petición GET para obtener todas las áreas culinarias
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error listing all areas:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para listar todos los ingredientes
    listAllIngredients: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/list.php?i=list`); // Realiza la petición GET para obtener todos los ingredientes
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error listing all ingredients:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para filtrar comidas por ingrediente principal
    filterByMainIngredient: async (ingredient) => {
        try {
            const response = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`); // Realiza la petición GET para filtrar comidas por ingrediente
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error filtering by main ingredient:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para filtrar comidas por categoría
    filterByCategory: async (category) => {
        try {
            const response = await axios.get(`${BASE_URL}/filter.php?c=${category}`); // Realiza la petición GET para filtrar comidas por categoría
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error filtering by category:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    },

    // Función para filtrar comidas por área culinaria
    filterByArea: async (area) => {
        try {
            const response = await axios.get(`${BASE_URL}/filter.php?a=${area}`); // Realiza la petición GET para filtrar comidas por área
            return response.data; // Devuelve los datos obtenidos de la API
        } catch (error) {
            console.error('Error filtering by area:', error); // Manejo de errores
            throw error; // Lanza el error para que pueda ser manejado por quien llame la función
        }
    }
};

export default api; // Exporta el objeto api para que pueda ser utilizado en otros archivos
