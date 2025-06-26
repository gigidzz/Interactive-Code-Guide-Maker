import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import LoadingSpinner from './loadingSpinner';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;