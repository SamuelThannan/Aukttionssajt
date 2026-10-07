import { useState } from 'react';
import Message from './Message';
import { toDateTimeLocal } from '../utils/format';

function defaultValues() {
  const start = new Date();
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  return {
    title: '',
    description: '',
    startingPrice: '',
    startDate: toDateTimeLocal(start),
    endDate: toDateTimeLocal(end),
  };
}

// Används både för att skapa och ändra en auktion.
// Vid ändring (isEdit) kan utropspris och startdatum inte ändras.
export default function AuctionForm({ initialValues, isEdit = false, submitLabel, onSubmit }) {
  const [values, setValues] = useState(initialValues ?? defaultValues());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!values.title.trim()) return 'Ange en titel.';
    if (!values.description.trim()) return 'Ange en beskrivning.';
    if (!isEdit && (values.startingPrice === '' || Number(values.startingPrice) < 0))
      return 'Ange ett utropspris på 0 kr eller mer.';
    if (new Date(values.endDate) <= new Date(values.startDate))
      return 'Slutdatumet måste vara senare än startdatumet.';
    if (new Date(values.endDate) <= new Date()) return 'Slutdatumet måste ligga i framtiden.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">Titel</label>
        <input id="title" name="title" value={values.title} onChange={handleChange} maxLength={120} required />
      </div>

      <div className="field">
        <label htmlFor="description">Beskrivning</label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={values.description}
          onChange={handleChange}
          maxLength={2000}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="startingPrice">Utropspris (kr)</label>
        <input
          id="startingPrice"
          name="startingPrice"
          type="number"
          min="0"
          step="1"
          value={values.startingPrice}
          onChange={handleChange}
          disabled={isEdit}
          required
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="startDate">Startar</label>
          <input
            id="startDate"
            name="startDate"
            type="datetime-local"
            value={values.startDate}
            onChange={handleChange}
            disabled={isEdit}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="endDate">Slutar</label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            value={values.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {isEdit && <p className="muted">Utropspris och startdatum kan inte ändras efter att auktionen skapats.</p>}

      <Message type="error">{error}</Message>

      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Sparar…' : submitLabel}
      </button>
    </form>
  );
}
