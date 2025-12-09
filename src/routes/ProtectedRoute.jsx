import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children }) => {
  const user = useSelector((s) => s.auth.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
