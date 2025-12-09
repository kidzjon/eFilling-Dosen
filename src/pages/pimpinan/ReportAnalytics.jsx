import React from "react";
import { Button } from "../../components/Button";

const ReportAnalytics = () => {
  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Analytics & Laporan</div>
          <div className="page-description">
            Di sini nanti bisa ditambahkan grafik, filter periode, dan ekspor
            laporan.
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="secondary">Export PDF</Button>
          <Button variant="secondary">Export Excel</Button>
        </div>
      </div>

      <div className="card">
        <p>
          Placeholder untuk grafik dan tabel ringkasan. Nanti bisa diisi
          menggunakan library chart (Recharts/Chart.js) dan data dari API.
        </p>
      </div>
    </>
  );
};

export default ReportAnalytics;
