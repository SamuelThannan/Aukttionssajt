import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BidForm from '../components/BidForm';
import BidList from '../components/BidList';
import Message from '../components/Message';
import { deleteAuction, getAuction } from '../api/auctionApi';
import { getBids, placeBid } from '../api/bidApi';
import { useAuth } from '../hooks/useAuth';
import { formatDate, formatPrice, formatTimeLeft } from '../utils/format';

export default function AuctionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    const [auctionData, bidData] = await Promise.all([getAuction(id), getBids(id)]);
    setAuction(auctionData);
    setBids(bidData);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    loadData()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadData]);

  if (loading) return <p className="muted">Hämtar auktionen…</p>;

  if (!auction) {
    return (
      <div className="empty-state">
        <Message type="error">{error || 'Auktionen finns inte.'}</Message>
        <Link to="/" className="button">
          Tillbaka till auktionerna
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === auction.userId;
  const hasStarted = new Date(auction.startDate) <= new Date();
  const hasBids = bids.length > 0;
  const minimumBid = hasBids ? bids[0].amount : auction.startingPrice;

  const handlePlaceBid = async (amount) => {
    await placeBid(auction.id, { amount, userId: user.id });
    await loadData();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Ta bort auktionen "${auction.title}"? Alla bud tas också bort.`)) return;
    try {
      await deleteAuction(auction.id, user.id);
      navigate('/my-auctions');
    } catch (err) {
      setError(err.message);
    }
  };

  const renderBidArea = () => {
    if (!auction.isOpen) {
      return <p className="muted">Auktionen är avslutad. Det går inte längre att lägga bud.</p>;
    }
    if (!hasStarted) {
      return <p className="muted">Auktionen startar {formatDate(auction.startDate)}.</p>;
    }
    if (!isLoggedIn) {
      return (
        <p className="muted">
          <Link to="/login" state={{ from: `/auctions/${auction.id}` }}>
            Logga in
          </Link>{' '}
          för att lägga bud.
        </p>
      );
    }
    // Säljaren får inte se budformuläret på sin egen auktion
    if (isOwner) {
      return <p className="muted">Det här är din auktion, så du kan inte lägga bud på den.</p>;
    }
    return <BidForm minimumBid={minimumBid} mustExceed={hasBids} onSubmit={handlePlaceBid} />;
  };

  return (
    <article className="details">
      <Link to="/" className="back-link">
        Alla auktioner
      </Link>

      <div className="details__layout">
        <div className="details__main">
          <span className="details__lot">Nr {auction.id}</span>
          <h1 className="details__title">{auction.title}</h1>
          <p className="details__seller">Säljs av {auction.sellerName}</p>
          <p className="details__description">{auction.description}</p>

          <dl className="details__facts">
            <div>
              <dt>Utropspris</dt>
              <dd>{formatPrice(auction.startingPrice)}</dd>
            </div>
            <div>
              <dt>Startade</dt>
              <dd>{formatDate(auction.startDate)}</dd>
            </div>
            <div>
              <dt>Slutar</dt>
              <dd>{formatDate(auction.endDate)}</dd>
            </div>
          </dl>

          {isOwner && (
            <div className="owner-actions">
              {auction.isOpen && (
                <Link to={`/auctions/${auction.id}/edit`} className="button button--secondary">
                  Ändra auktion
                </Link>
              )}
              <button type="button" className="button button--danger" onClick={handleDelete}>
                Ta bort auktion
              </button>
            </div>
          )}
          <Message type="error">{error}</Message>
        </div>

        <aside className="bid-panel" aria-label="Bud">
          <div className="bid-panel__status">
            <span className={auction.isOpen ? 'status status--open' : 'status status--closed'}>
              {auction.isOpen ? formatTimeLeft(auction.endDate) : 'Avslutad'}
            </span>
          </div>
          <p className="bid-panel__label">{hasBids ? 'Högsta bud' : 'Utropspris'}</p>
          <p className="bid-panel__price">{formatPrice(minimumBid)}</p>

          {renderBidArea()}

          <h2 className="bid-panel__heading">Bud ({bids.length})</h2>
          <BidList bids={bids} currentUserId={user?.id} />
        </aside>
      </div>
    </article>
  );
}
