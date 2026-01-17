import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "@/services/auth.service";
import { auth, db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // modal error (samain style dengan Register)
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const modalId = useMemo(() => "login-error-modal", []);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
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

  const openErrorModal = (message) => {
    setErrorMsg(message || "Email atau password salah. Silakan coba lagi.");
    setErrorOpen(true);
  };

  const closeErrorModal = () => {
    setErrorOpen(false);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await loginWithEmail(form.email, form.password);
      await redirectByRole();
    } catch (err) {
      // popup modal (bukan alert)
      openErrorModal(
        err?.code === "auth/invalid-credential" ||
          err?.code === "auth/wrong-password" ||
          err?.code === "auth/user-not-found"
          ? "Email atau password salah. Silakan periksa kembali."
          : err?.message || "Gagal login. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      await loginWithGoogle();
      await redirectByRole();
    } catch (err) {
      openErrorModal(err?.message || "Gagal login dengan Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary to-success">
      {/* Card */}
      <div className="w-full max-w-md">
        <div className="card bg-white shadow-2xl rounded-xl">
          <div className="card-body p-8 space-y-6">
            {/* Auth Switch */}
            <div className="flex justify-center">
              <div className="flex w-64 rounded-full bg-gray-100 p-1 shadow-inner">
                {/* Sign in */}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="
                    flex-1 rounded-full py-2 text-sm font-semibold
                    bg-white text-primary shadow
                    transition-all
                  "
                >
                  Sign in
                </button>

                {/* Sign up */}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="
                    flex-1 rounded-full py-2 text-sm font-medium
                    text-gray-500 hover:text-primary
                    transition-all
                  "
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">
                Login eFilling Dosen
              </h2>
              <p className="text-sm text-gray-500">
                Silakan masuk menggunakan akun Anda.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Email</span>
                </label>

                <label className="input input-bordered flex items-center gap-2 bg-white">
                  {/* mail icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 opacity-50"
                  >
                    <path d="M1.5 6.75A3.75 3.75 0 0 1 5.25 3h13.5A3.75 3.75 0 0 1 22.5 6.75v10.5A3.75 3.75 0 0 1 18.75 21H5.25A3.75 3.75 0 0 1 1.5 17.25V6.75Z" />
                    <path d="M21 8.02 13.35 13.9a2.25 2.25 0 0 1-2.7 0L3 8.02v9.23A2.25 2.25 0 0 0 5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V8.02Z" />
                  </svg>

                  <input
                    type="email"
                    className="grow"
                    placeholder="email@kampus.ac.id"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                    disabled={loading}
                  />
                </label>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Password</span>
                </label>

                <label className="input input-bordered flex items-center gap-2 bg-white">
                  {/* lock icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 opacity-50"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25V9H6a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V12a3 3 0 0 0-3-3h-.75V6.75A5.25 5.25 0 0 0 12 1.5Zm3.75 7.5V6.75a3.75 3.75 0 1 0-7.5 0V9h7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <input
                    type="password"
                    className="grow"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange("password")}
                    required
                    disabled={loading}
                  />
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Memproses...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-xs text-gray-400">or sign in with</div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn btn-outline w-full"
              disabled={loading}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.824 32.657 29.351 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.051 6.053 29.241 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.051 6.053 29.241 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.134 0 9.86-1.964 13.389-5.167l-6.19-5.238C29.235 35.091 26.715 36 24 36c-5.329 0-9.787-3.318-11.28-7.946l-6.52 5.02C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-.72 2.048-2.043 3.806-3.814 5.133l.003-.002 6.19 5.238C36.997 39.015 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500">
              Belum punya akun?{" "}
              <button
                type="button"
                className="link link-primary font-medium"
                onClick={() => navigate("/register")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ================= MODAL ERROR (DaisyUI, sama seperti Register) ================= */}
      <input
        id={modalId}
        type="checkbox"
        className="modal-toggle"
        checked={errorOpen}
        onChange={(e) => setErrorOpen(e.target.checked)}
      />
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-box text-center max-w-sm">
          {/* icon error (X merah) */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-error flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-8 h-8 text-error"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6l-12 12"
                />
              </svg>
            </div>
          </div>

          <h3 className="font-bold text-xl mt-4">Login Gagal</h3>
          <p className="text-sm text-gray-600 mt-1">{errorMsg}</p>

          <div className="modal-action justify-center mt-6">
            <button className="btn btn-primary px-10" onClick={closeErrorModal}>
              OK
            </button>
          </div>
        </div>

        {/* klik backdrop = tutup */}
        <label
          className="modal-backdrop"
          htmlFor={modalId}
          onClick={closeErrorModal}
        >
          Close
        </label>
      </div>
    </div>
  );
};

export default Login;
