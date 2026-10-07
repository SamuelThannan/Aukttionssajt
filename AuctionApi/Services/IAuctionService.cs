using AuctionApi.DTOs;

namespace AuctionApi.Services;

public interface IAuctionService
{
    Task<IEnumerable<AuctionDto>> GetOpenAsync(string? search);
    Task<IEnumerable<AuctionDto>> GetByUserAsync(int userId);
    Task<AuctionDto?> GetByIdAsync(int id);
    Task<ServiceResult<AuctionDto>> CreateAsync(CreateAuctionDto dto);
    Task<ServiceResult<AuctionDto>> UpdateAsync(int id, UpdateAuctionDto dto);
    Task<ServiceResult<bool>> DeleteAsync(int id, int userId);
}
