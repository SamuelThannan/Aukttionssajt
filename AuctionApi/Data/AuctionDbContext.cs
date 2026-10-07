using AuctionApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AuctionApi.Data;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions<AuctionDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Auction> Auctions => Set<Auction>();
    public DbSet<Bid> Bids => Set<Bid>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<Auction>(entity =>
        {
            entity.Property(a => a.Title).IsRequired().HasMaxLength(120);
            entity.Property(a => a.Description).IsRequired().HasMaxLength(2000);
            entity.Property(a => a.StartingPrice).HasPrecision(18, 2);
            entity.Ignore(a => a.IsOpen);

            entity.HasOne(a => a.User)
                  .WithMany(u => u.Auctions)
                  .HasForeignKey(a => a.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Bid>(entity =>
        {
            entity.Property(b => b.Amount).HasPrecision(18, 2);

            // Tas en auktion bort försvinner dess bud
            entity.HasOne(b => b.Auction)
                  .WithMany(a => a.Bids)
                  .HasForeignKey(b => b.AuctionId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Restrict för att undvika flera kaskadvägar i SQL Server
            entity.HasOne(b => b.User)
                  .WithMany(u => u.Bids)
                  .HasForeignKey(b => b.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
