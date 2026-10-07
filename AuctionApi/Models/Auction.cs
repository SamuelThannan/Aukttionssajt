namespace AuctionApi.Models;

public class Auction
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal StartingPrice { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public ICollection<Bid> Bids { get; set; } = new List<Bid>();

    // En auktion är öppen om slutdatumet är senare än aktuellt datum och klockslag
    public bool IsOpen => EndDate > DateTime.Now;
}
