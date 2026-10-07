import { request } from './client';

export const getBids = (auctionId) => request(`/auctions/${auctionId}/bids`);

export const placeBid = (auctionId, bid) =>
  request(`/auctions/${auctionId}/bids`, { method: 'POST', body: bid });
