import api from './api';

const getAllProducts = async (page = 0, size = 10) => {
    const response = await api.get(`/products?page=${page}&size=${size}`);
    return response.data;
};

const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

const createProduct = async (formData) => {
    // If we're sending files, we use FormData and don't explicitly set Content-Type header
    // Axios will automatically set the correct boundary and multipart/form-data
    const response = await api.post('/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const getCategories = async () => {
    const response = await api.get('/products/categories');
    return response.data;
};

const productService = {
    getAllProducts,
    getProductById,
    createProduct,
    getMyProducts: async () => {
        const response = await api.get('/products/me');
        return response.data;
    },
    getCategories,
};

export default productService;
