import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './AuthProvider.jsx';
import { Loading } from './Status.jsx';

export default function ProtectedRoute() {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return <Loading text="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
