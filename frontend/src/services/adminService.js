import api from './api';

const getAllUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

const approveUser = async (id) => {
    const response = await api.put(`/admin/users/${id}/approve`);
    return response.data;
};

const rejectUser = async (id) => {
    const response = await api.put(`/admin/users/${id}/reject`);
    return response.data;
};

const suspendUser = async (id) => {
    const response = await api.put(`/admin/users/${id}/suspend`);
    return response.data;
};

const adminDeleteProduct = async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
};

const adminService = {
    getAllUsers,
    approveUser,
    rejectUser,
    suspendUser,
    adminDeleteProduct,
};

export default adminService;
