import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const DosenLayout = () => {
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="layout-root">
      <aside className="sidebar">
        <div className="sidebar-title">eFilling Dosen</div>
        <div style={{ fontSize: "0.8rem", opacity: 0.85 }}>
          {user?.name} – Dosen
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/dosen"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/dosen/activities"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Aktivitas
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
