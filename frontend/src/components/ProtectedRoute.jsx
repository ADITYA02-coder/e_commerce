import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (roles.length && !roles.some((role) => currentUser.roles?.includes(role))) {
    return <Navigate to="/account" replace />;
  }

  return children;
};
