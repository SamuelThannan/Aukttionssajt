import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuctionGrid from '../components/AuctionGrid';
import Message from '../components/Message';
import { getUserAuctions } from '../api/userApi';
import { useAuth } from '../hooks/useAuth';

export default function MyAuctionsPage() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserAuctions(user.id)
      .then(setAuctions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  const open = auctions.filter((a) => a.isOpen);
  const closed = auctions.filter((a) => !a.isOpen);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Mina auktioner</h1>
        <Link to="/auctions/new" className="button">
          Skapa auktion
        </Link>
      </div>

      <Message type="error">{error}</Message>

      {loading ? (
        <p className="muted">Hämtar dina auktioner…</p>
      ) : auctions.length === 0 ? (
        !error && (
          <div className="empty-state">
            <p>Du har inte skapat några auktioner än.</p>
            <Link to="/auctions/new" className="button">
              Skapa din första auktion
            </Link>
          </div>
        )
      ) : (
        <>
          <h2 className="section-title">Pågående ({open.length})</h2>
          {open.length > 0 ? <AuctionGrid auctions={open} /> : <p className="muted">Inga pågående auktioner.</p>}

          {closed.length > 0 && (
            <>
              <h2 className="section-title">Avslutade ({closed.length})</h2>
              <AuctionGrid auctions={closed} />
            </>
          )}
        </>
      )}
    </>
  );
}
