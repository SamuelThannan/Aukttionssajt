using System.ComponentModel.DataAnnotations;

namespace AuctionApi.DTOs;

public record CreateAuctionDto(
    [Required(ErrorMessage = "Titel måste anges")]
    [StringLength(120, ErrorMessage = "Titeln får vara högst 120 tecken")]
    string Title,

    [Required(ErrorMessage = "Beskrivning måste anges")]
    [StringLength(2000, ErrorMessage = "Beskrivningen får vara högst 2000 tecken")]
    string Description,

    [Range(0, 100_000_000, ErrorMessage = "Priset kan inte vara negativt")]
    decimal StartingPrice,

    DateTime StartDate,
    DateTime EndDate,

    [Range(1, int.MaxValue, ErrorMessage = "Användare måste anges")]
    int UserId);

public record UpdateAuctionDto(
    [Required(ErrorMessage = "Titel måste anges")]
    [StringLength(120, ErrorMessage = "Titeln får vara högst 120 tecken")]
    string Title,

    [Required(ErrorMessage = "Beskrivning måste anges")]
    [StringLength(2000, ErrorMessage = "Beskrivningen får vara högst 2000 tecken")]
    string Description,

    DateTime EndDate,

    [Range(1, int.MaxValue, ErrorMessage = "Användare måste anges")]
    int UserId);

public record AuctionDto(
    int Id,
    string Title,
    string Description,
    decimal StartingPrice,
    decimal? HighestBid,
    int BidCount,
    DateTime StartDate,
    DateTime EndDate,
    bool IsOpen,
    int UserId,
    string SellerName);
