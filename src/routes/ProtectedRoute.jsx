import { Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !hasRole(...roles)) return <Navigate to="/forbidden" replace />;

  return children;
};

export default ProtectedRoute;
