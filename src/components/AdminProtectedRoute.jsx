import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
