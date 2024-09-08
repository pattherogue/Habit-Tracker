import api from './api';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password }).then(res => res.data);
};

export const register = (name, email, password) => {
  return api.post('/auth/register', { name, email, password });
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};