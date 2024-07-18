import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.droit < requiredRole) {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default ProtectedRoute;
