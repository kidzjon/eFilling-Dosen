import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const AdminLayout = () => {
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="layout-root">
      <aside className="sidebar" style={{ background: "#0f172a" }}>
        <div className="sidebar-title">Admin eFilling</div>
        <div style={{ fontSize: "0.8rem", opacity: 0.85 }}>
          {user?.name} – Admin
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/validation"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Validasi
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
