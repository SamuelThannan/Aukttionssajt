import AuctionCard from './AuctionCard';

export default function AuctionGrid({ auctions }) {
  return (
    <ul className="auction-grid">
      {auctions.map((auction) => (
        <li key={auction.id}>
          <AuctionCard auction={auction} />
        </li>
      ))}
    </ul>
  );
}
