import axios from 'axios';
import { API_BASE_URL } from '@env';
import { getToken, deleteToken } from '../storage/tokenStorage'

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

// Request interceptor
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

// Response interceptor 
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await deleteToken()
            delete apiClient.defaults.headers.common['Authorization']
        }
        return Promise.reject(error)
    }
)

export default apiClient;
