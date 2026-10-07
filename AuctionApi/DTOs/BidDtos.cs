using System.ComponentModel.DataAnnotations;

namespace AuctionApi.DTOs;

public record CreateBidDto(
    [Range(0.01, 100_000_000, ErrorMessage = "Budet måste vara större än 0")]
    decimal Amount,

    [Range(1, int.MaxValue, ErrorMessage = "Användare måste anges")]
    int UserId);

public record BidDto(int Id, decimal Amount, DateTime BidDate, int UserId, string BidderName);
