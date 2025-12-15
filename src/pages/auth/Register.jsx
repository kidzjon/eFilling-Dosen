import React from "react";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold text-gray-800">Registrasi</h1>

        <p className="text-sm text-gray-600">
          Untuk saat ini, fitur registrasi belum diimplementasikan. Silakan
          login menggunakan akun yang sudah tersedia.
        </p>

        <Button onClick={() => navigate("/login")} className="w-full">
          Kembali ke Login
        </Button>
      </div>
    </div>
  );
};

export default Register;
