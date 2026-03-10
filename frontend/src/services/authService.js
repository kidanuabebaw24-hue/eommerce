import api from './api';

const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('roles', JSON.stringify(response.data.roles));
    }
    return response.data;
};

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('roles', JSON.stringify(response.data.roles));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
};

const authService = {
    login,
    register,
    logout,
};

export default authService;
