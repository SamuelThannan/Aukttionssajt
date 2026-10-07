import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuctionGrid from '../components/AuctionGrid';
import SearchBar from '../components/SearchBar';
import Message from '../components/Message';
import { getOpenAuctions } from '../api/auctionApi';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const [search, setSearch] = useState('');
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Söker automatiskt en kort stund efter att användaren slutat skriva
  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await getOpenAuctions(search);
        if (!ignore) {
          setAuctions(result);
          setError('');
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">Pågående auktioner</h1>
        <p className="hero__lead">Hitta något du vill ha och lägg ditt bud innan klubban faller.</p>
        <SearchBar value={search} onChange={setSearch} />
      </section>

      <Message type="error">{error}</Message>

      {loading && auctions.length === 0 ? (
        <p className="muted">Hämtar auktioner…</p>
      ) : auctions.length > 0 ? (
        <>
          <p className="result-count">
            {auctions.length} {auctions.length === 1 ? 'öppen auktion' : 'öppna auktioner'}
            {search.trim() && ` som matchar "${search.trim()}"`}
          </p>
          <AuctionGrid auctions={auctions} />
        </>
      ) : (
        !error && (
          <div className="empty-state">
            {search.trim() ? (
              <p>Inga öppna auktioner matchar "{search.trim()}". Prova ett annat sökord.</p>
            ) : (
              <p>Det finns inga öppna auktioner just nu.</p>
            )}
            {isLoggedIn ? (
              <Link to="/auctions/new" className="button">
                Skapa en auktion
              </Link>
            ) : (
              <Link to="/register" className="button">
                Skapa konto och sälj något
              </Link>
            )}
          </div>
        )
      )}
    </>
  );
}
