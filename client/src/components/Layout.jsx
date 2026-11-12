import { Link, NavLink, Outlet } from 'react-router';
import { useAuth } from './AuthProvider.jsx';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            InterviewIQ
          </Link>
          <nav className="nav">
            <NavLink to="/" end>
              History
            </NavLink>
            <NavLink to="/analyze">Analyze resume</NavLink>
            <NavLink to="/interview">Mock interview</NavLink>
          </nav>
          <div className="topbar-user">
            <span className="muted">{user.name}</span>
            <button className="btn btn-small" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}
