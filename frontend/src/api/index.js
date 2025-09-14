import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Backend API URL
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

API.interceptors.response.use(
    (res) => res,
    (error) => {
        // The browser's developer console will naturally log 404 errors for failed network requests.
        // This is expected behavior and cannot be programmatically suppressed.
        // The following logic ensures that while the browser logs the error, our application handles it gracefully
        // by not flooding the console with additional custom error messages for expected "Not Found" scenarios,
        // such as checking for an evaluation that doesn't exist yet.
        if (error.response?.status !== 404 || !error.config.url.includes('/evaluations/')) {
            console.error("API Error:", error.response || error.message);
        }

        if (error.response && error.response.status === 401) {
            const profile = localStorage.getItem('profile');
            if (profile) {
                localStorage.removeItem('profile');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const createChatSession = () => API.post('/chats',);
export const getChatSessions = () => API.get('/chats');
export const getChatSessionById = (id) => API.get(`/chats/${id}`);
export const sendMessage = (sessionId, content, botType) => API.post(`/chats/${sessionId}/messages`, { sessionId, content, botType });
export const submitEvaluation = (sessionId, rating, comment) => API.post('/evaluations', { sessionId, rating, comment });
export const fetchEvaluation = (sessionId) => API.get(`/evaluations/${sessionId}`);

// Admin Prompt Management
export const createBotPrompt = (newPrompt) => API.post('/admin/prompts', newPrompt);
export const getAllBotPrompts = () => API.get('/admin/prompts');
export const getBotPromptById = (id) => API.get(`/admin/prompts/${id}`);
export const updateBotPrompt = (id, updatedPrompt) => API.put(`/admin/prompts/${id}`, updatedPrompt);
export const deleteBotPrompt = (id) => API.delete(`/admin/prompts/${id}`);
export const setDefaultBotPrompt = (id) => API.put(`/admin/prompts/${id}/set-default`);

// Admin API Key Management
export const getAllBotApiKeys = () => API.get('/admin/api-keys');
export const updateBotApiKey = (botType, apiKey) => API.put(`/admin/api-keys/${botType}`, { apiKey });

export default API;
