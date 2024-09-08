import api from './api';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password }).then(res => res.data);
};

export const register = async (name, email, password) => {
  console.log('Making API call to register');
  try {
    const response = await api.post('/auth/register', { name, email, password });
    console.log('API response:', response);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};