import { apiFetch } from './client';

export const loginAPI = async (email, password) => {
  return apiFetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerAPI = async (name, email, password, role) => {
  return apiFetch('/api/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
};
