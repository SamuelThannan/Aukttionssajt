using System.ComponentModel.DataAnnotations;

namespace AuctionApi.DTOs;

public record RegisterUserDto(
    [Required(ErrorMessage = "Namn måste anges")]
    [StringLength(100, ErrorMessage = "Namnet får vara högst 100 tecken")]
    string Name,

    [Required(ErrorMessage = "E-post måste anges")]
    [EmailAddress(ErrorMessage = "Ogiltig e-postadress")]
    string Email,

    [Required(ErrorMessage = "Lösenord måste anges")]
    [MinLength(6, ErrorMessage = "Lösenordet måste vara minst 6 tecken")]
    string Password);

public record LoginDto(
    [Required(ErrorMessage = "E-post måste anges")] string Email,
    [Required(ErrorMessage = "Lösenord måste anges")] string Password);

public record UserDto(int Id, string Name, string Email);
