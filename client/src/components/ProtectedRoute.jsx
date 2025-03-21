import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute check:', {
    user: user?.email,
    userRole: user?.role,
    requireAdmin,
    isAdmin: user?.role === 'admin',
    loading
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    console.log('Admin access required but user is not admin');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
