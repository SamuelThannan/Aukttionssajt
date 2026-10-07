import { useNavigate } from 'react-router-dom';
import AuctionForm from '../components/AuctionForm';
import { createAuction } from '../api/auctionApi';
import { useAuth } from '../hooks/useAuth';

export default function CreateAuctionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreate = async (values) => {
    const created = await createAuction({
      title: values.title,
      description: values.description,
      startingPrice: Number(values.startingPrice),
      startDate: values.startDate,
      endDate: values.endDate,
      userId: user.id,
    });
    navigate(`/auctions/${created.id}`);
  };

  return (
    <section className="narrow">
      <h1 className="page-title">Skapa auktion</h1>
      <AuctionForm submitLabel="Skapa auktion" onSubmit={handleCreate} />
    </section>
  );
}
