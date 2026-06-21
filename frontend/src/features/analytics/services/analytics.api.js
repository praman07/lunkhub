import axios from 'axios';

const analyticsApiInstance = axios.create({
    baseURL: '/api/link',
});

export const getAnalytics = async ({ username }) => {
    const response = await analyticsApiInstance.get(`/${username}/analytics`);
    return response.data;
};
