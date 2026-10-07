using AuctionApi.Data;
using AuctionApi.DTOs;
using AuctionApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AuctionApi.Services;

public class AuctionService : IAuctionService
{
    private readonly AuctionDbContext _context;

    public AuctionService(AuctionDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AuctionDto>> GetOpenAsync(string? search)
    {
        var now = DateTime.Now;
        var query = _context.Auctions.Where(a => a.EndDate > now);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(a => a.Title.Contains(term));
        }

        return await ProjectToDto(query.OrderBy(a => a.EndDate), now).ToListAsync();
    }

    public async Task<IEnumerable<AuctionDto>> GetByUserAsync(int userId)
    {
        var now = DateTime.Now;
        var query = _context.Auctions.Where(a => a.UserId == userId);

        return await ProjectToDto(query.OrderByDescending(a => a.StartDate), now).ToListAsync();
    }

    public async Task<AuctionDto?> GetByIdAsync(int id)
    {
        var now = DateTime.Now;
        return await ProjectToDto(_context.Auctions.Where(a => a.Id == id), now)
            .FirstOrDefaultAsync();
    }

    public async Task<ServiceResult<AuctionDto>> CreateAsync(CreateAuctionDto dto)
    {
        if (!await _context.Users.AnyAsync(u => u.Id == dto.UserId))
        {
            return ServiceResult<AuctionDto>.Fail(ServiceErrorType.BadRequest, "Användaren finns inte.");
        }

        var dateError = ValidateDates(dto.StartDate, dto.EndDate);
        if (dateError is not null)
        {
            return ServiceResult<AuctionDto>.Fail(ServiceErrorType.BadRequest, dateError);
        }

        var auction = new Auction
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            StartingPrice = dto.StartingPrice,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            UserId = dto.UserId
        };

        _context.Auctions.Add(auction);
        await _context.SaveChangesAsync();

        var created = await GetByIdAsync(auction.Id);
        return ServiceResult<AuctionDto>.Ok(created!);
    }

    public async Task<ServiceResult<AuctionDto>> UpdateAsync(int id, UpdateAuctionDto dto)
    {
        var auction = await _context.Auctions.FindAsync(id);
        if (auction is null)
        {
            return ServiceResult<AuctionDto>.Fail(ServiceErrorType.NotFound, "Auktionen finns inte.");
        }

        if (auction.UserId != dto.UserId)
        {
            return ServiceResult<AuctionDto>.Fail(ServiceErrorType.Forbidden,
                "Du kan bara ändra dina egna auktioner.");
        }

        if (!auction.IsOpen)
        {
            return ServiceResult<AuctionDto>.Fail(ServiceErrorType.BadRequest,
                "Auktionen är avslutad och kan inte ändras.");
        }

        var dateError = ValidateDates(auction.StartDate, dto.EndDate);
        if (dateError is not null)
        {
            return ServiceResult<AuctionDto>.Fail(ServiceErrorType.BadRequest, dateError);
        }

        auction.Title = dto.Title.Trim();
        auction.Description = dto.Description.Trim();
        auction.EndDate = dto.EndDate;
        await _context.SaveChangesAsync();

        var updated = await GetByIdAsync(auction.Id);
        return ServiceResult<AuctionDto>.Ok(updated!);
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id, int userId)
    {
        var auction = await _context.Auctions.FindAsync(id);
        if (auction is null)
        {
            return ServiceResult<bool>.Fail(ServiceErrorType.NotFound, "Auktionen finns inte.");
        }

        if (auction.UserId != userId)
        {
            return ServiceResult<bool>.Fail(ServiceErrorType.Forbidden,
                "Du kan bara ta bort dina egna auktioner.");
        }

        _context.Auctions.Remove(auction);
        await _context.SaveChangesAsync();
        return ServiceResult<bool>.Ok(true);
    }

    private static string? ValidateDates(DateTime start, DateTime end)
    {
        if (end <= start)
        {
            return "Slutdatumet måste vara senare än startdatumet.";
        }

        if (end <= DateTime.Now)
        {
            return "Slutdatumet måste ligga i framtiden.";
        }

        return null;
    }

    // Gemensam projektion så att alla läsningar ger samma DTO
    private static IQueryable<AuctionDto> ProjectToDto(IQueryable<Auction> query, DateTime now) =>
        query.Select(a => new AuctionDto(
            a.Id,
            a.Title,
            a.Description,
            a.StartingPrice,
            a.Bids.Max(b => (decimal?)b.Amount),
            a.Bids.Count,
            a.StartDate,
            a.EndDate,
            a.EndDate > now,
            a.UserId,
            a.User!.Name));
}
