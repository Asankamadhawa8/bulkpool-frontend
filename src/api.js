import axios from 'axios';

const api = axios.create({
    baseURL: 'https://bulk-pool.onrender.com/api', // or 'http://127.0.0.1:8000' depending on your routes
});

// Automatically inject JWT access token into the headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;