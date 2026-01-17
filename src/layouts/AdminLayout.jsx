import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth.service";

export const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navBase =
    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition";
  const navIdle = "text-slate-200 hover:bg-slate-800";
  const navActive = "bg-primary text-white shadow-sm";

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-700">
          <h1 className="text-lg font-semibold">Admin eFilling</h1>
          <p className="text-xs text-slate-400 mt-1">
            {user?.name || "User"} – Admin
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navIdle}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/validation"
            className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navIdle}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 4h-2.18C16.4 2.84 15.3 2 14 2h-4c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 0h4v2h-4V4zm8 18H6V6h2v2h8V6h2v16z" />
              <path d="M10.2 14.6 8.4 12.8l-1.4 1.4 3.2 3.2 6-6-1.4-1.4z" />
            </svg>
            Validasi
          </NavLink>
        </nav>

        <div className="mt-auto px-3 py-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 7V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H3m0 0 3-3m-3 3 3 3"
              />
            </svg>
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};
