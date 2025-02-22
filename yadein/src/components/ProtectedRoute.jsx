import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('adminToken'); // Check if admin is logged in
  return isAuthenticated ? children : <Navigate to="/admin/" />;
};

export const UserProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('token'); // Check if user is logged in
  return isAuthenticated ? children : <Navigate to="/login/" />;
};
