import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.email.trim() || !values.password) {
      setError('Fyll i e-post och lösenord.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await login(values);
      navigate(location.state?.from ?? '/', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <section className="narrow">
      <h1 className="page-title">Logga in</h1>
      <form className="form" onSubmit={handleSubmit} noValidate>
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
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <Message type="error">{error}</Message>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Loggar in…' : 'Logga in'}
        </button>
      </form>
      <p className="form-footer">
        Inget konto? <Link to="/register">Skapa ett här</Link>
      </p>
    </section>
  );
}
