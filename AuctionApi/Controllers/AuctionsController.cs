using AuctionApi.DTOs;
using AuctionApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionApi.Controllers;

[Route("api/auctions")]
public class AuctionsController : ApiControllerBase
{
    private readonly IAuctionService _auctionService;

    public AuctionsController(IAuctionService auctionService)
    {
        _auctionService = auctionService;
    }

    // GET api/auctions?search=cykel – endast öppna auktioner
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuctionDto>>> GetOpen([FromQuery] string? search)
    {
        return Ok(await _auctionService.GetOpenAsync(search));
    }

    // GET api/auctions/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<AuctionDto>> GetById(int id)
    {
        var auction = await _auctionService.GetByIdAsync(id);
        return auction is null ? NotFound(new { message = "Auktionen finns inte." }) : Ok(auction);
    }

    // POST api/auctions
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> Create(CreateAuctionDto dto)
    {
        var result = await _auctionService.CreateAsync(dto);
        if (!result.Success)
        {
            return ErrorResult(result);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    // PUT api/auctions/5
    [HttpPut("{id:int}")]
    public async Task<ActionResult<AuctionDto>> Update(int id, UpdateAuctionDto dto)
    {
        var result = await _auctionService.UpdateAsync(id, dto);
        return result.Success ? Ok(result.Data) : ErrorResult(result);
    }

    // DELETE api/auctions/5?userId=1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromQuery] int userId)
    {
        var result = await _auctionService.DeleteAsync(id, userId);
        return result.Success ? NoContent() : ErrorResult(result);
    }
}
