import axios from 'axios';

const API_URL = 'https://www.cheapshark.com/api/1.0';

const api = axios.create({
    baseURL: API_URL,
});

export default api;
