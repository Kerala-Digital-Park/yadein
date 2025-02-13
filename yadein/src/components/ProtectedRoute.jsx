import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('token'); // Check if admin is logged in
  return isAuthenticated ? children : <Navigate to="/admin/" />;
};

export default ProtectedRoute;