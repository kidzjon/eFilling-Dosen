import React, { useMemo } from "react";

const DashboardPimpinan = () => {
  // ===============================
  // DUMMY DATA
  // ===============================
  const stats = {
    total: 24,
    approved: 18,
    pending: 4,
    rejected: 2,
    approvalRate: 75, // %
    totalSKS: 56,
    avgSKS: 7,
  };

  const distribution = [
    { label: "Pendidikan", value: 10 },
    { label: "Penelitian", value: 7 },
    { label: "Pengabdian", value: 5 },
    { label: "Penunjang", value: 2 },
  ];

  const topDosen = [
    { name: "Krisna Firdiawan", total: 6, sks: 12 },
    { name: "Aulia Rahman", total: 5, sks: 10 },
    { name: "Sinta Lestari", total: 4, sks: 8 },
    { name: "Doni Saputra", total: 3, sks: 6 },
    { name: "Nadia Putri", total: 2, sks: 4 },
  ];

  // ===============================
  // INSIGHT (DUMMY)
  // ===============================
  const insight = useMemo(() => {
    const mostType = [...distribution].sort((a, b) => b.value - a.value)[0];
    const top = [...topDosen].sort((a, b) => b.sks - a.sks)[0];

    return {
      mostType: mostType?.label || "-",
      mostTypeCount: mostType?.value || 0,
      topDosen: top?.name || "-",
      topDosenSKS: top?.sks || 0,
      warnPending: stats.pending > 0,
      warnRejected: stats.rejected > 0,
    };
  }, [distribution, topDosen, stats.pending, stats.rejected]);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Ringkasan Pimpinan
        </h1>
        <p className="text-sm text-gray-600">
          Tampilan singkat capaian aktivitas dosen (Dummy – siap ke API
          statistik).
        </p>
      </div>

      {/* ================= KPI CARDS (FIXED) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Total Aktivitas</p>
          <h2 className="mt-2 text-3xl font-bold text-primary">
            {stats.total}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Ringkasan keseluruhan (dummy)
          </p>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Disetujui</p>
          <h2 className="mt-2 text-3xl font-bold text-success">
            {stats.approved}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Approval rate: {stats.approvalRate}%
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-warning">
            {stats.pending}
          </h2>
          <p className="mt-1 text-xs text-gray-500">Menunggu review admin</p>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Ditolak</p>
          <h2 className="mt-2 text-3xl font-bold text-danger">
            {stats.rejected}
          </h2>
          <p className="mt-1 text-xs text-gray-500">Perlu perbaikan dosen</p>
        </div>
      </div>

      {/* ================= QUICK INSIGHTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card bg-white shadow lg:col-span-2">
          <div className="card-body">
            <h2 className="text-sm font-semibold text-gray-700">
              Insight Singkat (Dummy)
            </h2>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Jenis Terbanyak</p>
                <p className="mt-1 font-semibold">
                  {insight.mostType} ({insight.mostTypeCount})
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Top SKS Disetujui</p>
                <p className="mt-1 font-semibold">
                  {insight.topDosen} ({insight.topDosenSKS} SKS)
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Total SKS</p>
                <p className="mt-1 font-semibold">{stats.totalSKS} SKS</p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Rata-rata SKS / Dosen</p>
                <p className="mt-1 font-semibold">{stats.avgSKS} SKS</p>
              </div>
            </div>
          </div>
        </div>

        {/* ALERT */}
        <div className="space-y-3">
          {insight.warnRejected && (
            <div className="alert alert-error">
              Ada {stats.rejected} aktivitas ditolak. Perlu tindak lanjut.
            </div>
          )}

          {insight.warnPending && (
            <div className="alert alert-warning">
              Ada {stats.pending} aktivitas pending.
            </div>
          )}

          {!insight.warnPending && !insight.warnRejected && (
            <div className="alert alert-success">
              Semua aman 🎉 Tidak ada pending/ditolak.
            </div>
          )}
        </div>
      </div>

      {/* ================= DISTRIBUTION + TOP DOSEN ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-white shadow">
          <div className="card-body">
            <h2 className="text-sm font-semibold mb-4">
              Distribusi Jenis Aktivitas
            </h2>

            {distribution.map((item) => (
              <div key={item.label} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={item.value}
                  max={stats.total}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <h2 className="text-sm font-semibold mb-3">Top Dosen (Dummy)</h2>

            <table className="table table-zebra text-sm">
              <thead>
                <tr>
                  <th className="text-center">Nama Dosen</th>
                  <th className="text-center">Total Aktivitas</th>
                  <th className="text-center">SKS Disetujui</th>
                </tr>
              </thead>
              <tbody>
                {topDosen.map((d, i) => (
                  <tr key={i}>
                    <td className="text-center font-medium">{d.name}</td>
                    <td className="text-center">{d.total}</td>
                    <td className="text-center">{d.sks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div className="alert alert-info">
        Dashboard ini bersifat ringkasan strategis untuk pimpinan.
      </div>
    </div>
  );
};

export default DashboardPimpinan;
