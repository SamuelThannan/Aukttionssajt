using AuctionApi.DTOs;

namespace AuctionApi.Services;

public interface IBidService
{
    Task<ServiceResult<IEnumerable<BidDto>>> GetByAuctionAsync(int auctionId);
    Task<ServiceResult<BidDto>> CreateAsync(int auctionId, CreateBidDto dto);
}
