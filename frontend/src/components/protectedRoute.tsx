import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import LoadingSpinner from './loadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;