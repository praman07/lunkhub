import axios from 'axios';

const authApiInstance = axios.create({
    baseURL: '/api/auth',
});

export const register = async ({ username, email, password }) => {
    const response = await authApiInstance.post('/register', { username, email, password });
    return response.data;
};

export const login = async ({ identifier, password }) => {
    const response = await authApiInstance.post('/login', { identifier, password });
    return response.data;
};

export const logout = async () => {
    const response = await authApiInstance.post('/logout');
    return response.data;
};

export const getMe = async () => {
    const response = await authApiInstance.get('/me');
    return response.data;
};
