import { formatDate, formatPrice } from '../utils/format';

export default function BidList({ bids, currentUserId }) {
  if (bids.length === 0) {
    return <p className="muted">Inga bud ännu. Det första budet måste vara minst utropspriset.</p>;
  }

  return (
    <ol className="bid-list">
      {bids.map((bid, index) => (
        <li key={bid.id} className={index === 0 ? 'bid-list__item bid-list__item--top' : 'bid-list__item'}>
          <span className="bid-list__amount">{formatPrice(bid.amount)}</span>
          <span className="bid-list__bidder">
            {bid.bidderName}
            {bid.userId === currentUserId && ' (du)'}
          </span>
          <time className="bid-list__date" dateTime={bid.bidDate}>
            {formatDate(bid.bidDate)}
          </time>
        </li>
      ))}
    </ol>
  );
}
