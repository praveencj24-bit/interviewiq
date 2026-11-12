import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../components/AuthProvider.jsx';

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Name
            <input value={form.name} onChange={update('name')} maxLength={60} required autoFocus />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={update('email')} required />
          </label>
          <label>
            Password <span className="muted">(at least 8 characters)</span>
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              minLength={8}
              maxLength={72}
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
