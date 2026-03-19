import api from './api';

const sendMessage = async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
};

const getMyMessages = async () => {
    const response = await api.get('/messages/my-messages');
    return response.data;
};

const getUnreadMessages = async () => {
    const response = await api.get('/messages/unread');
    return response.data;
};

const getUnreadCount = async () => {
    const response = await api.get('/messages/unread-count');
    return response.data;
};

const markAsRead = async (messageId) => {
    const response = await api.put(`/messages/${messageId}/mark-read`);
    return response.data;
};

const getAllMessages = async () => {
    const response = await api.get('/messages/all');
    return response.data;
};

const getMessageStats = async () => {
    const response = await api.get('/messages/stats');
    return response.data;
};

const deleteMessage = async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
};

const messageService = {
    sendMessage,
    getMyMessages,
    getUnreadMessages,
    getUnreadCount,
    markAsRead,
    getAllMessages,
    getMessageStats,
    deleteMessage,
};

export default messageService;
