import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const RoleRoute = ({ allowedRole, children }) => {
  const user = useSelector((state) => state.auth.user);

  // Belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role tidak sesuai
  if (user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
