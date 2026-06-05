import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT 
apiClient.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;