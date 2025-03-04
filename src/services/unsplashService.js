import axios from 'axios';

// Necesitarás registrarte en Unsplash Developer para obtener una API key
// https://unsplash.com/developers
const API_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Reemplaza esto con tu API key de Unsplash
const BASE_URL = 'https://api.unsplash.com';

// Crear una instancia de axios con configuración predeterminada
const unsplashApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${API_KEY}`
  },
  // Añadir timeout para evitar promesas pendientes indefinidamente
  timeout: 10000
});

// Función para buscar imágenes por término
export const searchImages = async (query, page = 1, perPage = 30) => {
  try {
    const response = await unsplashApi.get('/search/photos', {
      params: {
        query,
        page,
        per_page: perPage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar imágenes:', error);
    // Asegurar que siempre devolvemos un objeto con la estructura esperada
    return { results: [], total: 0, total_pages: 0 };
  }
};

// Función para obtener imágenes aleatorias (para la carga inicial)
export const getRandomImages = async (count = 30) => {
  try {
    const response = await unsplashApi.get('/photos/random', {
      params: {
        count
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener imágenes aleatorias:', error);
    // Devolver un array vacío en lugar de propagar el error
    return [];
  }
};

// Función para obtener imágenes de gatos (fallback)
export const getCatImages = async (page = 1, perPage = 30) => {
  try {
    const response = await unsplashApi.get('/search/photos', {
      params: {
        query: 'cats',
        page,
        per_page: perPage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener imágenes de gatos:', error);
    // Asegurar que siempre devolvemos un objeto con la estructura esperada
    return { results: [], total: 0, total_pages: 0 };
  }
};

// Función para obtener más imágenes (paginación)
export const getMoreImages = async (page = 2, perPage = 30) => {
  try {
    const response = await unsplashApi.get('/photos', {
      params: {
        page,
        per_page: perPage,
        order_by: 'popular'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener más imágenes:', error);
    // Devolver un array vacío en lugar de propagar el error
    return [];
  }
};
