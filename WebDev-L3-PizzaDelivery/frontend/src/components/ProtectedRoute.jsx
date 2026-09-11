import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Basic ProtectedRoute wrapper component.
 * Redirects to "/login" if no auth token exists in localStorage.
 */
export default function ProtectedRoute() {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
