using AuctionApi.DTOs;

namespace AuctionApi.Services;

public interface IUserService
{
    Task<ServiceResult<UserDto>> RegisterAsync(RegisterUserDto dto);
    Task<UserDto?> LoginAsync(LoginDto dto);
    Task<UserDto?> GetByIdAsync(int id);
}
