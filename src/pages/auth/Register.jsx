import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmail } from "@/services/auth.service";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // modal sukses
  const [successOpen, setSuccessOpen] = useState(false);

  // modal error (opsional biar gak alert)
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const modalId = useMemo(() => "register-success-modal", []);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await registerWithEmail(form.email, form.password, form.name);

      // buka modal sukses
      setSuccessOpen(true);
    } catch (err) {
      setErrorMsg(err?.message || "Terjadi kesalahan saat register.");
    } finally {
      setLoading(false);
    }
  };

  const handleOkSuccess = () => {
    setSuccessOpen(false);
    navigate("/login");
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
                {/* Sign in (inactive di halaman register) */}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="
                  flex-1 rounded-full py-2 text-sm font-medium
                  text-gray-600 hover:text-primary
                  hover:bg-white/70
                  transition-all duration-200 ease-out
                  active:scale-[0.98]
                "
                >
                  Sign in
                </button>
                {/* Sign up (active di halaman register) */}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="
                  flex-1 rounded-full py-2 text-sm font-semibold
                  bg-white text-primary shadow
                  transition-all duration-200 ease-out
                  active:scale-[0.98]
                "
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Register eFilling Dosen
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Buat akun untuk mulai mengisi dan mengajukan aktivitas.
              </p>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="alert alert-error">
                <span className="text-sm">{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Nama</span>
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  {/* user icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 opacity-60"
                  >
                    <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 1.5c-4.41 0-8 2.239-8 5v1h16v-1c0-2.761-3.59-5-8-5Z" />
                  </svg>

                  <input
                    type="text"
                    className="grow"
                    placeholder="Nama lengkap"
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                  />
                </label>
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  {/* mail icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 opacity-60"
                  >
                    <path d="M1.5 6.75A3.75 3.75 0 0 1 5.25 3h13.5A3.75 3.75 0 0 1 22.5 6.75v10.5A3.75 3.75 0 0 1 18.75 21H5.25A3.75 3.75 0 0 1 1.5 17.25V6.75Zm3.44-.69 6.62 5.1a.75.75 0 0 0 .88 0l6.62-5.1a2.25 2.25 0 0 0-.31-.02H5.25c-.1 0-.2.01-.31.02Z" />
                    <path d="M21 8.02 13.35 13.9a2.25 2.25 0 0 1-2.7 0L3 8.02v9.23A2.25 2.25 0 0 0 5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V8.02Z" />
                  </svg>

                  <input
                    type="email"
                    className="grow"
                    placeholder="email@kampus.ac.id"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                </label>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  {/* lock icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 opacity-60"
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
                  />
                </label>
              </div>

              {/* Confirm */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Konfirmasi Password
                  </span>
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  {/* lock icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 opacity-60"
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
                    placeholder="Ulangi password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    required
                  />
                </label>
              </div>

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
                  "Create account"
                )}
              </button>
            </form>

            {/* Footer link */}
            <p className="text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <button
                type="button"
                className="link link-primary"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ================= MODAL SUKSES (DaisyUI) ================= */}
      <input
        id={modalId}
        type="checkbox"
        className="modal-toggle"
        checked={successOpen}
        onChange={(e) => setSuccessOpen(e.target.checked)}
      />
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-box text-center max-w-sm">
          {/* icon success */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-success flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-8 h-8 text-success"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 6 9 17l-5-5"
                />
              </svg>
            </div>
          </div>

          <h3 className="font-bold text-xl mt-4">Berhasil!</h3>
          <p className="text-sm text-gray-600 mt-1">
            Akun berhasil dibuat. Silakan login.
          </p>

          <div className="modal-action justify-center mt-6">
            <button className="btn btn-primary px-10" onClick={handleOkSuccess}>
              OK
            </button>
          </div>
        </div>

        {/* klik backdrop = tutup */}
        <label
          className="modal-backdrop"
          htmlFor={modalId}
          onClick={() => setSuccessOpen(false)}
        >
          Close
        </label>
      </div>
    </div>
  );
};

export default Register;
