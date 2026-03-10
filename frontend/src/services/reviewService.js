import api from './api';

/**
 * Review API Service
 */

const createReview = async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
};

const getProductReviews = async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
};

const getSellerReviews = async (sellerId) => {
    const response = await api.get(`/reviews/seller/${sellerId}`);
    return response.data;
};

const getMyReviews = async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
};

const getProductRatingDistribution = async (productId) => {
    const response = await api.get(`/reviews/product/${productId}/distribution`);
    return response.data;
};

const getSellerRatingDistribution = async (sellerId) => {
    const response = await api.get(`/reviews/seller/${sellerId}/distribution`);
    return response.data;
};

const reviewService = {
    createReview,
    getProductReviews,
    getSellerReviews,
    getMyReviews,
    getProductRatingDistribution,
    getSellerRatingDistribution,
};

export default reviewService;
