import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000', // Default base URL
    timeout: 5000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default axiosInstance;