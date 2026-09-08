import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, hasRole, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return children;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && !hasRole(...roles)) return <Navigate to="/forbidden" replace />;

  return children;
};

export default ProtectedRoute;
