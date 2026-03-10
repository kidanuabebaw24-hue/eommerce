import api from './api';

/**
 * Payment API Service
 */

const initiatePayment = async (paymentData) => {
    const response = await api.post('/payments/initiate', paymentData);
    return response.data;
};

const verifyPayment = async (verificationData) => {
    const response = await api.post('/payments/verify', verificationData);
    return response.data;
};

const getPaymentByTransactionId = async (transactionId) => {
    const response = await api.get(`/payments/transaction/${transactionId}`);
    return response.data;
};

const paymentService = {
    initiatePayment,
    verifyPayment,
    getPaymentByTransactionId,
};

export default paymentService;
