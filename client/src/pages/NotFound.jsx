import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Page not found</h1>
        <p className="muted">The page you are looking for does not exist.</p>
        <Link to="/">Go to your history</Link>
      </div>
    </div>
  );
}
