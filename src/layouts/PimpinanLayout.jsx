import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export const PimpinanLayout = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navBase = "block px-4 py-2 rounded-lg text-sm font-medium transition";
  const navIdle = "text-slate-200 hover:bg-slate-700";
  const navActive = "bg-primary text-white";

  return (
    <div className="min-h-screen flex bg-background">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-slate-800 text-slate-100 flex flex-col">
        {/* Brand & User */}
        <div className="px-5 py-4 border-b border-slate-700">
          <h1 className="text-lg font-semibold">Dashboard Pimpinan</h1>
          <p className="text-xs text-slate-400 mt-1">
            {user?.name || "User"} – Pimpinan
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/pimpinan"
            end
            className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navIdle}`
            }
          >
            Ringkasan
          </NavLink>

          <NavLink
            to="/pimpinan/analytics"
            className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navIdle}`
            }
          >
            Analytics
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 transition"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};
