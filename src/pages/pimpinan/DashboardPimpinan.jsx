import React from "react";

const DashboardPimpinan = () => {
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Ringkasan Pimpinan
        </h1>
        <p className="text-sm text-gray-600">
          Tampilan singkat capaian aktivitas dosen. (Dummy UI – bisa
          disambungkan ke API statistik nanti.)
        </p>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Total Aktivitas</p>
          <h2 className="mt-2 text-3xl font-bold text-primary">24</h2>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Disetujui</p>
          <h2 className="mt-2 text-3xl font-bold text-success">18</h2>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-warning">4</h2>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Ditolak</p>
          <h2 className="mt-2 text-3xl font-bold text-danger">2</h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardPimpinan;
