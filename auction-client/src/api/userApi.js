import { request } from './client';

export const registerUser = (user) =>
  request('/users/register', { method: 'POST', body: user });

export const loginUser = (credentials) =>
  request('/users/login', { method: 'POST', body: credentials });

export const getUserAuctions = (userId) => request(`/users/${userId}/auctions`);
