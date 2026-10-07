import { useState } from 'react';
import Message from './Message';
import { formatPrice } from '../utils/format';

export default function BidForm({ minimumBid, mustExceed, onSubmit }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const value = Number(amount);
    if (!value || value <= 0) {
      setError('Ange ett belopp större än 0.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(value);
      setSuccess(`Ditt bud på ${formatPrice(value)} är lagt.`);
      setAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="bid-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="bid-amount">Ditt bud (kr)</label>
      <p className="bid-form__hint">
        {mustExceed
          ? `Måste vara högre än ${formatPrice(minimumBid)}`
          : `Minst ${formatPrice(minimumBid)}`}
      </p>
      <div className="bid-form__row">
        <input
          id="bid-amount"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Lägger bud…' : 'Lägg bud'}
        </button>
      </div>
      <Message type="error">{error}</Message>
      <Message type="success">{success}</Message>
    </form>
  );
}
