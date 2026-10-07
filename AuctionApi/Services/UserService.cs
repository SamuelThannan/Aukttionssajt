using AuctionApi.Data;
using AuctionApi.DTOs;
using AuctionApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AuctionApi.Services;

public class UserService : IUserService
{
    private readonly AuctionDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;

    public UserService(AuctionDbContext context, IPasswordHasher<User> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<ServiceResult<UserDto>> RegisterAsync(RegisterUserDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();

        if (await _context.Users.AnyAsync(u => u.Email == email))
        {
            return ServiceResult<UserDto>.Fail(ServiceErrorType.Conflict,
                "Det finns redan ett konto med den e-postadressen.");
        }

        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = email
        };
        // Lösenordet sparas aldrig i klartext
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return ServiceResult<UserDto>.Ok(ToDto(user));
    }

    public async Task<UserDto?> LoginAsync(LoginDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null)
        {
            return null;
        }

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        return result == PasswordVerificationResult.Failed ? null : ToDto(user);
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        return user is null ? null : ToDto(user);
    }

    private static UserDto ToDto(User user) => new(user.Id, user.Name, user.Email);
}
