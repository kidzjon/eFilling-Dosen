import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export const DosenLayout = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navBase = "block px-4 py-2 rounded-lg text-sm font-medium transition";
  const navIdle = "text-gray-700 hover:bg-gray-100";
  const navActive = "bg-primary text-white";

  return (
    <div className="min-h-screen flex bg-background">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r flex flex-col">
        {/* Brand & User */}
        <div className="px-5 py-4 border-b">
          <h1 className="text-lg font-semibold text-primary">eFilling Dosen</h1>
          <p className="text-xs text-gray-600 mt-1">
            {user?.name || "User"} – Dosen
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/dosen"
            end
            className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navIdle}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dosen/activities"
            className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : navIdle}`
            }
          >
            Aktivitas
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-danger hover:bg-red-50 transition"
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
