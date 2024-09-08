import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor for adding the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const handleApiError = (error) => {
  console.error('API Error:', error.response || error);
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location = '/login';
  } else if (error.response && error.response.status === 500) {
    console.error('Server error:', error.response.data);
  }
  throw error;
};

// Auth related API calls
export const login = (email, password) => api.post('/auth/login', { email, password }).then(res => res.data).catch(handleApiError);
export const register = (name, email, password) => api.post('/auth/register', { name, email, password }).then(res => res.data).catch(handleApiError);
export const getUserData = () => api.get('/auth/user').then(res => res.data).catch(handleApiError);

// Habit related API calls
export const fetchHabits = () => api.get('/habits').then(res => res.data).catch(handleApiError);
export const createHabit = (habitData) => api.post('/habits', habitData).then(res => res.data).catch(handleApiError);
export const fetchHabitDetails = (id) => api.get(`/habits/${id}`).then(res => res.data).catch(handleApiError);
export const updateHabitProgress = (id, progressData) => api.post(`/habits/${id}/progress`, progressData).then(res => res.data).catch(handleApiError);
export const updateHabit = (id, habitData) => api.put(`/habits/${id}`, habitData).then(res => res.data).catch(handleApiError);
export const deleteHabit = (id) => api.delete(`/habits/${id}`).then(res => res.data).catch(handleApiError);

// Statistics API call
export const getHabitStatistics = () => api.get('/habits/statistics').then(res => res.data).catch(handleApiError);

export default api;