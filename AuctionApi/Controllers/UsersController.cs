using AuctionApi.DTOs;
using AuctionApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionApi.Controllers;

[Route("api/users")]
public class UsersController : ApiControllerBase
{
    private readonly IUserService _userService;
    private readonly IAuctionService _auctionService;

    public UsersController(IUserService userService, IAuctionService auctionService)
    {
        _userService = userService;
        _auctionService = auctionService;
    }

    // POST api/users/register
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterUserDto dto)
    {
        var result = await _userService.RegisterAsync(dto);
        if (!result.Success)
        {
            return ErrorResult(result);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    // POST api/users/login
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await _userService.LoginAsync(dto);
        if (user is null)
        {
            return Unauthorized(new { message = "Fel e-post eller lösenord." });
        }

        return Ok(user);
    }

    // GET api/users/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        return user is null ? NotFound(new { message = "Användaren finns inte." }) : Ok(user);
    }

    // GET api/users/5/auctions – alla auktioner en användare skapat, även avslutade
    [HttpGet("{id:int}/auctions")]
    public async Task<ActionResult<IEnumerable<AuctionDto>>> GetAuctions(int id)
    {
        if (await _userService.GetByIdAsync(id) is null)
        {
            return NotFound(new { message = "Användaren finns inte." });
        }

        return Ok(await _auctionService.GetByUserAsync(id));
    }
}
