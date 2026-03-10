import api from './api';

/**
 * Analytics API Service (Admin only)
 */

const getOverview = async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
};

const getRevenueAnalytics = async () => {
    const response = await api.get('/analytics/revenue');
    return response.data;
};

const getCategoryAnalytics = async () => {
    const response = await api.get('/analytics/categories');
    return response.data;
};

const getTopSellers = async (limit = 10) => {
    const response = await api.get(`/analytics/top-sellers?limit=${limit}`);
    return response.data;
};

const analyticsService = {
    getOverview,
    getRevenueAnalytics,
    getCategoryAnalytics,
    getTopSellers,
};

export default analyticsService;
