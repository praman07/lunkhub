import axios from 'axios';

const linkApiInstance = axios.create({
    baseURL: '/api/links',
    withCredentials: true,
})


export const getLinks = async ({ username }) => {
    const response = await linkApiInstance.get(`/${username}`);
    /**
     * http://localhost:5173/api/links/rohan
     */
    console.log(response.data)
    return response.data;
}

export const linkClick = async ({ linkId }) => {
    const response = await linkApiInstance.patch(`/${linkId}/click`);
    /**
     * http://localhost:5173/api/links/64a0e7f8c1b2f5e4d6a7b8c9/click
     */
    console.log(response.data)
    return response.data;
}

export const addLink = async ({ title, url }) => {
    const response = await linkApiInstance.post('/', { title, url });
    console.log(response.data)
    return response.data;
}

export const updateLinkApi = async ({ linkId, title, url }) => {
    const response = await linkApiInstance.put(`/${linkId}`, { title, url });
    console.log(response.data)
    return response.data;
}

export const deleteLinkApi = async ({ linkId }) => {
    const response = await linkApiInstance.delete(`/${linkId}`);
    console.log(response.data)
    return response.data;
}