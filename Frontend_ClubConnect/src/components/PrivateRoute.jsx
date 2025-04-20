// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const PrivateRoute = ({ children, adminOnly = false, sponsorOnly = false }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && currentUser.role !== 'club-admin') {
    return <Navigate to="/unauthorized" />;
  }
  
  if (sponsorOnly && currentUser.role !== 'sponsor') {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default PrivateRoute;
