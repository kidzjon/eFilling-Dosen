import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "@/services/auth.service";
import { auth, db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // ✅ HARUS async
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginWithEmail(form.email, form.password);
      await redirectByRole();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      await redirectByRole();
    } catch (err) {
      alert(err.message);
    }
  };

  const redirectByRole = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    const role = snap.data()?.role;

    if (role === "dosen") navigate("/dosen");
    else if (role === "admin") navigate("/admin");
    else if (role === "pimpinan") navigate("/pimpinan");
    else navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-success px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-7">
        <h2 className="text-2xl font-semibold mb-1">Login eFilling Dosen</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Password"
              required
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Masuk
          </button>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border py-2.5 rounded-lg font-medium mt-2"
          >
            Login dengan Google
          </button>

          {/* Register */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium"
          >
            Register
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
