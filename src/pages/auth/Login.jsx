import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    role: "dosen",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      id: "dummy-" + form.role,
      email: form.email,
      name: form.name || "User " + form.role,
      role: form.role,
    };

    dispatch(loginSuccess(user));

    if (form.role === "dosen") navigate("/dosen");
    else if (form.role === "admin") navigate("/admin");
    else navigate("/pimpinan");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-success px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-7">
        <h2 className="text-2xl font-semibold mb-1">Login eFilling Dosen</h2>
        <p className="text-sm text-gray-500 mb-6">
          Gunakan role untuk testing:{" "}
          <span className="font-medium">dosen, admin, pimpinan</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Nama lengkap"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="email@kampus.ac.id"
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={form.role}
              onChange={handleChange("role")}
              className="w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="dosen">Dosen</option>
              <option value="admin">Admin</option>
              <option value="pimpinan">Pimpinan</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
