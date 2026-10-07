import { request } from './client';

export const getOpenAuctions = (search = '') => {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
  return request(`/auctions${query}`);
};

export const getAuction = (id) => request(`/auctions/${id}`);

export const createAuction = (auction) =>
  request('/auctions', { method: 'POST', body: auction });

export const updateAuction = (id, auction) =>
  request(`/auctions/${id}`, { method: 'PUT', body: auction });

export const deleteAuction = (id, userId) =>
  request(`/auctions/${id}?userId=${userId}`, { method: 'DELETE' });
