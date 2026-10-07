import { Link } from 'react-router-dom';
import { formatPrice, formatTimeLeft, isEndingSoon } from '../utils/format';

export default function AuctionCard({ auction }) {
  const hasBids = auction.bidCount > 0;
  const currentPrice = hasBids ? auction.highestBid : auction.startingPrice;
  const endingSoon = auction.isOpen && isEndingSoon(auction.endDate);

  return (
    <article className={`auction-card${auction.isOpen ? '' : ' auction-card--closed'}`}>
      <Link to={`/auctions/${auction.id}`} className="auction-card__link">
        <span className="auction-card__lot">Nr {auction.id}</span>
        <h3 className="auction-card__title">{auction.title}</h3>
        <p className="auction-card__description">{auction.description}</p>

        <div className="auction-card__price">
          <span className="auction-card__price-label">{hasBids ? 'Högsta bud' : 'Utropspris'}</span>
          <span className="auction-card__price-value">{formatPrice(currentPrice)}</span>
        </div>

        <footer className="auction-card__footer">
          <span>{hasBids ? `${auction.bidCount} bud` : 'Inga bud än'}</span>
          <span className={endingSoon ? 'auction-card__time--soon' : undefined}>
            {formatTimeLeft(auction.endDate)}
          </span>
        </footer>
      </Link>
    </article>
  );
}
