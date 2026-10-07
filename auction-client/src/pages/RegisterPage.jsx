import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!values.name.trim()) return 'Ange ditt namn.';
    if (!/^\S+@\S+\.\S+$/.test(values.email)) return 'Ange en giltig e-postadress.';
    if (values.password.length < 6) return 'Lösenordet måste vara minst 6 tecken.';
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
      await register(values);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <section className="narrow">
      <h1 className="page-title">Skapa konto</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Namn</label>
          <input id="name" name="name" autoComplete="name" value={values.name} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="email">E-post</label>
          <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="password">Lösenord</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
          />
          <small className="muted">Minst 6 tecken</small>
        </div>
        <Message type="error">{error}</Message>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Skapar konto…' : 'Skapa konto'}
        </button>
      </form>
      <p className="form-footer">
        Har du redan ett konto? <Link to="/login">Logga in</Link>
      </p>
    </section>
  );
}
