using AuctionApi.Data;
using AuctionApi.DTOs;
using AuctionApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AuctionApi.Services;

public class BidService : IBidService
{
    private readonly AuctionDbContext _context;

    public BidService(AuctionDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult<IEnumerable<BidDto>>> GetByAuctionAsync(int auctionId)
    {
        if (!await _context.Auctions.AnyAsync(a => a.Id == auctionId))
        {
            return ServiceResult<IEnumerable<BidDto>>.Fail(ServiceErrorType.NotFound, "Auktionen finns inte.");
        }

        var bids = await _context.Bids
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.Amount)
            .Select(b => new BidDto(b.Id, b.Amount, b.BidDate, b.UserId, b.User!.Name))
            .ToListAsync();

        return ServiceResult<IEnumerable<BidDto>>.Ok(bids);
    }

    public async Task<ServiceResult<BidDto>> CreateAsync(int auctionId, CreateBidDto dto)
    {
        var auction = await _context.Auctions.FindAsync(auctionId);
        if (auction is null)
        {
            return ServiceResult<BidDto>.Fail(ServiceErrorType.NotFound, "Auktionen finns inte.");
        }

        var bidder = await _context.Users.FindAsync(dto.UserId);
        if (bidder is null)
        {
            return ServiceResult<BidDto>.Fail(ServiceErrorType.BadRequest, "Användaren finns inte.");
        }

        if (auction.UserId == dto.UserId)
        {
            return ServiceResult<BidDto>.Fail(ServiceErrorType.Forbidden,
                "Du kan inte lägga bud på din egen auktion.");
        }

        var now = DateTime.Now;
        if (auction.EndDate <= now)
        {
            return ServiceResult<BidDto>.Fail(ServiceErrorType.BadRequest, "Auktionen är avslutad.");
        }

        if (auction.StartDate > now)
        {
            return ServiceResult<BidDto>.Fail(ServiceErrorType.BadRequest, "Auktionen har inte startat ännu.");
        }

        var highestBid = await _context.Bids
            .Where(b => b.AuctionId == auctionId)
            .MaxAsync(b => (decimal?)b.Amount);

        if (highestBid.HasValue && dto.Amount <= highestBid.Value)
        {
            return ServiceResult<BidDto>.Fail(ServiceErrorType.BadRequest,
                $"Budet är för lågt. Det måste vara högre än {highestBid.Value:0.##} kr.");
        }

        if (!highestBid.HasValue && dto.Amount < auction.StartingPrice)
        {
            return ServiceResult<BidDto>.Fail(ServiceErrorType.BadRequest,
                $"Budet är för lågt. Det måste vara minst utropspriset {auction.StartingPrice:0.##} kr.");
        }

        var bid = new Bid
        {
            Amount = dto.Amount,
            BidDate = now,
            AuctionId = auctionId,
            UserId = dto.UserId
        };

        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();

        return ServiceResult<BidDto>.Ok(new BidDto(bid.Id, bid.Amount, bid.BidDate, bid.UserId, bidder.Name));
    }
}
