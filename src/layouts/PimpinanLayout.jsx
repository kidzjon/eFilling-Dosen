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

  const navBase =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition";
  const navIdle = "text-slate-200 hover:bg-slate-700/70";
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
            {/* icon ringkasan (home/dashboard) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5V15a1 1 0 011-1h2a1 1 0 011 1v6h5a1 1 0 001-1V10"
              />
            </svg>
            <span>Ringkasan</span>
          </NavLink>

          <NavLink
            to="/pimpinan/analytics"
            className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navIdle}`
            }
          >
            {/* icon analytics (chart) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 19V5M20 19H4M8 17v-6M12 17V9M16 17v-3"
              />
            </svg>
            <span>Analytics</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="mt-auto px-3 py-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3
              px-4 py-2.5 rounded-lg
              text-sm font-semibold
              text-red-500
              hover:bg-red-500/10
              transition
            "
          >
            {/* icon logout */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
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
