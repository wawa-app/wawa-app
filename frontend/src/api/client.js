import axios from 'axios';
import { API_BASE_URL } from '@env';
import { getToken } from '../storage/tokenStorage';

if (__DEV__) {
    console.log('[apiClient] API_BASE_URL:', API_BASE_URL);
}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT 
apiClient.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (__DEV__) {
            console.log('[apiClient] request:', config.method?.toUpperCase(), config.baseURL, config.url, {
                hasToken: Boolean(token),
            });
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
