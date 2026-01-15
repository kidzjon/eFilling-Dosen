import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const RoleRoute = ({ allowedRole, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    // Redirect ke dashboard sesuai role
    if (user.role === "dosen") return <Navigate to="/dosen" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "pimpinan") return <Navigate to="/pimpinan" replace />;

    return <Navigate to="/login" replace />;
  }

  return children;
};
