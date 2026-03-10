import api from './api';

/**
 * Transaction API Service
 */

const createTransaction = async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
};

const getTransactionById = async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
};

const getTransactionByReference = async (paymentReference) => {
    const response = await api.get(`/transactions/reference/${paymentReference}`);
    return response.data;
};

const getMyPurchases = async () => {
    const response = await api.get('/transactions/purchases');
    return response.data;
};

const getMySales = async () => {
    const response = await api.get('/transactions/sales');
    return response.data;
};

const getSellerEarnings = async (sellerId) => {
    const response = await api.get(`/transactions/seller/${sellerId}/earnings`);
    return response.data;
};

const getBuyerSpending = async (buyerId) => {
    const response = await api.get(`/transactions/buyer/${buyerId}/spending`);
    return response.data;
};

const transactionService = {
    createTransaction,
    getTransactionById,
    getTransactionByReference,
    getMyPurchases,
    getMySales,
    getSellerEarnings,
    getBuyerSpending,
};

export default transactionService;
