import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const PimpinanLayout = () => {
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="layout-root">
      <aside className="sidebar" style={{ background: "#1e293b" }}>
        <div className="sidebar-title">Dashboard Pimpinan</div>
        <div style={{ fontSize: "0.8rem", opacity: 0.85 }}>
          {user?.name} – Pimpinan
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/pimpinan"
            end
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Ringkasan
          </NavLink>
          <NavLink
            to="/pimpinan/analytics"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Analytics
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
