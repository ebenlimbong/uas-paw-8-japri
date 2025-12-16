import { apiFetch } from './client';

export const getProfile = async () => {
  return apiFetch('/api/profile/me');
};

export const updateProfile = async (data) => {
  return apiFetch('/api/profile/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getCompanyProfile = async () => {
  return apiFetch('/api/company/me');
};

export const updateCompanyProfile = async (data) => {
  return apiFetch('/api/company/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getPublicCompanyProfile = async (id) => {
  return apiFetch(`/api/company/${id}`);
};
