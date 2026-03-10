import api from './api';

/**
 * Favorite/Wishlist API Service
 */

const addToFavorites = async (productId) => {
    const response = await api.post(`/favorites/${productId}`);
    return response.data;
};

const removeFromFavorites = async (productId) => {
    const response = await api.delete(`/favorites/${productId}`);
    return response.data;
};

const getMyFavorites = async () => {
    const response = await api.get('/favorites');
    return response.data;
};

const isFavorited = async (productId) => {
    const response = await api.get(`/favorites/${productId}/check`);
    return response.data;
};

const getFavoriteCount = async (productId) => {
    const response = await api.get(`/favorites/${productId}/count`);
    return response.data;
};

const favoriteService = {
    addToFavorites,
    removeFromFavorites,
    getMyFavorites,
    isFavorited,
    getFavoriteCount,
};

export default favoriteService;
