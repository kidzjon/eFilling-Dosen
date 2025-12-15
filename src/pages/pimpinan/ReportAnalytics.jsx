import React from "react";
import { Button } from "../../components/Button";

const ReportAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Analytics & Laporan
          </h1>
          <p className="text-sm text-gray-600">
            Di sini nanti bisa ditambahkan grafik, filter periode, dan ekspor
            laporan.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary">Export PDF</Button>
          <Button variant="secondary">Export Excel</Button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-gray-700">
          Placeholder untuk grafik dan tabel ringkasan.
          <br />
          Nanti bisa diisi menggunakan library chart (Recharts / Chart.js) dan
          data dari API.
        </p>
      </div>
    </div>
  );
};

export default ReportAnalytics;
