import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequiredAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/admin/login" />;
  }
  return children;
};

export default RequiredAuth;
