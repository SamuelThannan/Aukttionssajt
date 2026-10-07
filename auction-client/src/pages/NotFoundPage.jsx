import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="empty-state">
      <h1 className="page-title">Sidan finns inte</h1>
      <p>Adressen du försökte nå finns inte.</p>
      <Link to="/" className="button">
        Gå till auktionerna
      </Link>
    </div>
  );
}
