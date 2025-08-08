import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Use an interceptor to dynamically set the Authorization header
// before each request is sent. This is the most reliable way to handle auth.
api.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
        }
    } catch (error) {
        console.error("Could not parse user from localStorage", error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- Trip-related API calls ---
export const getAllTrips = () => api.get('/trips');
export const getTripById = (id) => api.get(`/trips/${id}`);
export const createTrip = (tripData) => api.post('/trips', tripData);
export const updateTrip = (id, tripData) => api.patch(`/trips/${id}`, tripData);
export const deleteTrip = (id) => api.delete(`/trips/${id}`);

// --- Auth-related API calls ---
// These don't need the interceptor but it doesn't hurt
export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = (username, email, password) => api.post('/auth/register', { username, email, password });

export default api;