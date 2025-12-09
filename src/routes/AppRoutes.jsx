import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { DosenLayout } from "../layouts/DosenLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { PimpinanLayout } from "../layouts/PimpinanLayout";

import DashboardDosen from "../pages/dosen/DashboardDosen";
import ActivityList from "../pages/dosen/ActivityList";
import ActivityForm from "../pages/dosen/ActivityForm";
import ActivityDetail from "../pages/dosen/ActivityDetail";

import DashboardAdmin from "../pages/admin/DashboardAdmin";
import ValidationQueue from "../pages/admin/ValidationQueue";
import ValidationDetail from "../pages/admin/ValidationDetail";

import DashboardPimpinan from "../pages/pimpinan/DashboardPimpinan";
import ReportAnalytics from "../pages/pimpinan/ReportAnalytics";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dosen */}
      <Route
        path="/dosen"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="dosen">
              <DosenLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardDosen />} />
        <Route path="activities" element={<ActivityList />} />
        <Route path="activities/new" element={<ActivityForm />} />
        <Route path="activities/:id" element={<ActivityDetail />} />
        <Route path="activities/:id/edit" element={<ActivityForm />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="admin">
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardAdmin />} />
        <Route path="validation" element={<ValidationQueue />} />
        <Route path="validation/:id" element={<ValidationDetail />} />
      </Route>

      {/* Pimpinan */}
      <Route
        path="/pimpinan"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole="pimpinan">
              <PimpinanLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPimpinan />} />
        <Route path="analytics" element={<ReportAnalytics />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
