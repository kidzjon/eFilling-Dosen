import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const RoleRoute = ({ allowedRole, children }) => {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to="/login" replace />;
  return children;
};
