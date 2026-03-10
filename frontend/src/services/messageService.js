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

const messageService = {
    sendMessage,
    getMyMessages,
    getUnreadMessages,
    getUnreadCount,
    markAsRead,
};

export default messageService;
