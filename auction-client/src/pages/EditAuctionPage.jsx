import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuctionForm from '../components/AuctionForm';
import Message from '../components/Message';
import { getAuction, updateAuction } from '../api/auctionApi';
import { useAuth } from '../hooks/useAuth';
import { toDateTimeLocal } from '../utils/format';

export default function EditAuctionPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAuction(id)
      .then(setAuction)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <Message type="error">{error}</Message>;
  if (!auction) return <p className="muted">Hämtar auktionen…</p>;

  if (auction.userId !== user.id) {
    return (
      <div className="empty-state">
        <p>Du kan bara ändra dina egna auktioner.</p>
        <Link to={`/auctions/${id}`} className="button">
          Tillbaka till auktionen
        </Link>
      </div>
    );
  }

  const handleUpdate = async (values) => {
    await updateAuction(id, {
      title: values.title,
      description: values.description,
      endDate: values.endDate,
      userId: user.id,
    });
    navigate(`/auctions/${id}`);
  };

  return (
    <section className="narrow">
      <Link to={`/auctions/${id}`} className="back-link">
        Tillbaka till auktionen
      </Link>
      <h1 className="page-title">Ändra auktion</h1>
      <AuctionForm
        isEdit
        submitLabel="Spara ändringar"
        onSubmit={handleUpdate}
        initialValues={{
          title: auction.title,
          description: auction.description,
          startingPrice: auction.startingPrice,
          startDate: toDateTimeLocal(auction.startDate),
          endDate: toDateTimeLocal(auction.endDate),
        }}
      />
    </section>
  );
}
