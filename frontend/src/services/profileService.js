import api from './api';

/**
 * User Profile API Service
 */

const getMyProfile = async () => {
    const response = await api.get('/profile');
    return response.data;
};

const getProfileByUserId = async (userId) => {
    const response = await api.get(`/profile/user/${userId}`);
    return response.data;
};

const updateMyProfile = async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
};

const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/profile/photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const getTopSellers = async () => {
    const response = await api.get('/profile/top-sellers');
    return response.data;
};

const getVerifiedSellers = async (minRating = 4.0) => {
    const response = await api.get(`/profile/verified-sellers?minRating=${minRating}`);
    return response.data;
};

const profileService = {
    getMyProfile,
    getProfileByUserId,
    updateMyProfile,
    uploadProfilePhoto,
    getTopSellers,
    getVerifiedSellers,
};

export default profileService;
