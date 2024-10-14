import axios  from "axios";
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const api = {
    searchMealByName: async (name) => {
        try {
            const response = await axios.get(`${BASE_URL}/search.php?s=${name}`);
            return response.data;
        } catch (error) {
            console.error('Error searching meal by name:', error);
            throw error;
        }
    },

    listMealsByFirstLetter: async (letter) => {
        try {
            const response = await axios.get(`${BASE_URL}/search.php?f=${letter}`);
            return response.data;
        } catch (error) {
            console.error('Error listing meals by first letter:', error);
            throw error;
        }
    },

    lookupMealById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
            return response.data;
        } catch (error) {
            console.error('Error looking up meal by ID:', error);
            throw error;
        }
    },

    lookupRandomMeal: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/random.php`);
            return response.data;
        } catch (error) {
            console.error('Error looking up random meal:', error);
            throw error;
        }
    },

    listAllMealCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories.php`);
            return response.data;
        } catch (error) {
            console.error('Error listing all meal categories:', error);
            throw error;
        }
    },

    listAllCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories.php`);
            return response.data;
        } catch (error) {
            console.error('Error listing all categories:', error);
            throw error;
        }
    },

    listAllAreas: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/list.php?a=list`);
            return response.data;
        } catch (error) {
            console.error('Error listing all areas:', error);
            throw error;
        }
    },

    listAllIngredients: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/list.php?i=list`);
            return response.data;
        } catch (error) {
            console.error('Error listing all ingredients:', error);
            throw error;
        }
    },

    filterByMainIngredient: async (ingredient) => {
        try {
            const response = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`);
            return response.data;
        } catch (error) {
            console.error('Error filtering by main ingredient:', error);
            throw error;
        }
    },

    filterByCategory: async (category) => {
        try {
            const response = await axios.get(`${BASE_URL}/filter.php?c=${category}`);
            return response.data;
        } catch (error) {
            console.error('Error filtering by category:', error);
            throw error;
        }
    },

    filterByArea: async (area) => {
        try {
            const response = await axios.get(`${BASE_URL}/filter.php?a=${area}`);
            return response.data;
        } catch (error) {
            console.error('Error filtering by area:', error);
            throw error;
        }
    }
};

export default api;