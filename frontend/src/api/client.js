import axios from 'axios';
import { API_URL } from '@env';

const apiClient = axios.create({
    baseURL: API_URL, 
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT 
apiClient.interceptors.request.use(
    async (config) => {
        // const token = await AsyncStorage.getItem('userToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;