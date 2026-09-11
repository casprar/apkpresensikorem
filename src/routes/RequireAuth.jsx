import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

/**
 * Route guard that requires admin authentication.
 * Redirects to /admin/login if not authenticated or not admin.
 */
export default function RequireAuth({ children }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
      }}>
        <LoadingSpinner size="lg" message="Verifying access..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (profile && profile.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
