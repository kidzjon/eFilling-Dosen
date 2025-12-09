import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    role: "dosen",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a56db 0%, #0e9f6e 100%)",
      }}
    >
      <div
        className="card"
        style={{ maxWidth: 420, width: "100%", padding: "1.5rem 1.75rem" }}
      >
        <h2 style={{ marginBottom: "0.5rem" }}>Login eFilling Dosen</h2>
        <p className="page-description">
          Gunakan role untuk testing: <b>dosen, admin, pimpinan</b>.
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Nama lengkap"
          />
          <Input
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="email@kampus.ac.id"
          />
          <div className="form-field">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={form.role}
              onChange={handleChange("role")}
            >
              <option value="dosen">Dosen</option>
              <option value="admin">Admin</option>
              <option value="pimpinan">Pimpinan</option>
            </select>
          </div>
          <Button type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
