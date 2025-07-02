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
        if (error.response && error.response.status === 401) {
            // Check if the error is due to token expiration
            // The backend sends 'Not authorized, token failed' or 'Not authorized, no token'
            // We can infer token expiration if the status is 401 and there was a token in the request
            const profile = localStorage.getItem('profile');
            if (profile) {
                // If there was a profile, it means the token likely expired or was invalid
                localStorage.removeItem('profile'); // Clear expired token
                window.location.href = '/login'; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default API;
