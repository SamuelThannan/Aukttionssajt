using AuctionApi.DTOs;
using AuctionApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuctionApi.Controllers;

[Route("api/auctions/{auctionId:int}/bids")]
public class BidsController : ApiControllerBase
{
    private readonly IBidService _bidService;

    public BidsController(IBidService bidService)
    {
        _bidService = bidService;
    }

    // GET api/auctions/5/bids
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BidDto>>> GetBids(int auctionId)
    {
        var result = await _bidService.GetByAuctionAsync(auctionId);
        return result.Success ? Ok(result.Data) : ErrorResult(result);
    }

    // POST api/auctions/5/bids
    [HttpPost]
    public async Task<ActionResult<BidDto>> PlaceBid(int auctionId, CreateBidDto dto)
    {
        var result = await _bidService.CreateAsync(auctionId, dto);
        if (!result.Success)
        {
            return ErrorResult(result);
        }

        return StatusCode(StatusCodes.Status201Created, result.Data);
    }
}
