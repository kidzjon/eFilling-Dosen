import React, { useMemo } from "react";
import { Button } from "../../components/Button";

const ReportAnalytics = () => {
  // ===============================
  // DUMMY DATA (tanpa chart)
  // ===============================
  const summary = {
    totalAktivitas: 24,
    disetujui: 18,
    pending: 4,
    ditolak: 2,
    totalSKSApproved: 56,
    approvalRate: 75, // %
  };

  const byJenis = [
    {
      jenis: "Pendidikan & Pengajaran",
      total: 10,
      approved: 8,
      pending: 1,
      rejected: 1,
      sksApproved: 24,
    },
    {
      jenis: "Penelitian",
      total: 7,
      approved: 5,
      pending: 2,
      rejected: 0,
      sksApproved: 18,
    },
    {
      jenis: "Pengabdian",
      total: 5,
      approved: 4,
      pending: 0,
      rejected: 1,
      sksApproved: 10,
    },
    {
      jenis: "Penunjang",
      total: 2,
      approved: 1,
      pending: 1,
      rejected: 0,
      sksApproved: 4,
    },
  ];

  const topDosen = [
    { name: "Krisna Firdiawan", total: 6, approved: 5, sksApproved: 12 },
    { name: "Aulia Rahman", total: 5, approved: 4, sksApproved: 10 },
    { name: "Sinta Lestari", total: 4, approved: 3, sksApproved: 8 },
    { name: "Doni Saputra", total: 3, approved: 2, sksApproved: 6 },
    { name: "Nadia Putri", total: 2, approved: 1, sksApproved: 4 },
  ];

  const mostJenis = useMemo(() => {
    const max = [...byJenis].sort((a, b) => b.total - a.total)[0];
    return max ? `${max.jenis} (${max.total})` : "-";
  }, [byJenis]);

  const topSKS = useMemo(() => {
    const max = [...topDosen].sort((a, b) => b.sksApproved - a.sksApproved)[0];
    return max ? `${max.name} (${max.sksApproved} SKS)` : "-";
  }, [topDosen]);

  const handleExportPdf = () => {
    // dummy action
    alert("Export PDF (dummy) - nanti dihubungkan ke fitur export.");
  };

  const handleExportExcel = () => {
    // dummy action
    alert("Export Excel (dummy) - nanti dihubungkan ke fitur export.");
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Analytics & Laporan
          </h1>
          <p className="text-sm text-gray-600">
            Ringkasan aktivitas dosen (dummy). Fokus tabel rekap, tanpa chart.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExportPdf}>
            Export PDF
          </Button>
          <Button variant="secondary" onClick={handleExportExcel}>
            Export Excel
          </Button>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="card bg-white shadow lg:col-span-2">
          <div className="card-body">
            <p className="text-sm text-gray-600">Total Aktivitas</p>
            <h2 className="text-3xl font-bold text-primary">
              {summary.totalAktivitas}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Ringkasan keseluruhan (dummy)
            </p>
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <p className="text-sm text-gray-600">Disetujui</p>
            <h2 className="text-3xl font-bold text-success">
              {summary.disetujui}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Approval: {summary.approvalRate}%
            </p>
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <p className="text-sm text-gray-600">Pending</p>
            <h2 className="text-3xl font-bold text-warning">
              {summary.pending}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Menunggu review</p>
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <p className="text-sm text-gray-600">Ditolak</p>
            <h2 className="text-3xl font-bold text-danger">
              {summary.ditolak}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Perlu perbaikan</p>
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <p className="text-sm text-gray-600">SKS (Approved)</p>
            <h2 className="text-3xl font-bold text-gray-800">
              {summary.totalSKSApproved}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Akumulasi SKS disetujui
            </p>
          </div>
        </div>
      </div>

      {/* ================= QUICK INSIGHTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card bg-white shadow lg:col-span-2">
          <div className="card-body">
            <h2 className="text-sm font-semibold text-gray-700">
              Highlight Ringkasan
            </h2>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Jenis Terbanyak</p>
                <p className="mt-1 font-semibold text-gray-800">{mostJenis}</p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Top SKS Disetujui</p>
                <p className="mt-1 font-semibold text-gray-800">{topSKS}</p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Catatan</p>
                <p className="mt-1 text-sm text-gray-700">
                  Data dummy, nanti diisi dari agregasi Firestore/API.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Rekomendasi</p>
                <p className="mt-1 text-sm text-gray-700">
                  Prioritaskan review untuk status pending & rejected.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {summary.ditolak > 0 ? (
            <div className="alert alert-error shadow">
              Ada <b>{summary.ditolak}</b> aktivitas ditolak. Perlu tindak
              lanjut.
            </div>
          ) : null}

          {summary.pending > 0 ? (
            <div className="alert alert-warning shadow">
              Ada <b>{summary.pending}</b> aktivitas pending. Prioritaskan
              review.
            </div>
          ) : null}

          {!summary.pending && !summary.ditolak ? (
            <div className="alert alert-success shadow">
              Semua aman 🎉 Tidak ada pending/ditolak.
            </div>
          ) : null}

          <div className="card bg-white shadow">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-gray-700">
                Aksi Cepat (Dummy)
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <button className="btn btn-outline btn-sm">
                  Unduh Rekap Jenis
                </button>
                <button className="btn btn-outline btn-sm">
                  Unduh Top Dosen
                </button>
                <button className="btn btn-outline btn-sm">
                  Arsipkan Laporan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE: REKAP PER JENIS ================= */}
      <div className="card bg-white shadow">
        <div className="card-body">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">
                Rekap Aktivitas per Jenis
              </h2>
              <p className="text-xs text-gray-500">
                Breakdown status per kategori (dummy).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table table-zebra text-sm text-center">
              <thead>
                <tr>
                  <th className="text-center">Jenis</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Approved</th>
                  <th className="text-center">Pending</th>
                  <th className="text-center">Rejected</th>
                  <th className="text-center">SKS Approved</th>
                </tr>
              </thead>
              <tbody>
                {byJenis.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-medium text-center">{row.jenis}</td>
                    <td>{row.total}</td>
                    <td className="text-success font-semibold">
                      {row.approved}
                    </td>
                    <td className="text-warning font-semibold">
                      {row.pending}
                    </td>
                    <td className="text-danger font-semibold">
                      {row.rejected}
                    </td>
                    <td className="font-semibold">{row.sksApproved}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th className="text-center">TOTAL</th>
                  <th className="text-center">{summary.totalAktivitas}</th>
                  <th className="text-center">{summary.disetujui}</th>
                  <th className="text-center">{summary.pending}</th>
                  <th className="text-center">{summary.ditolak}</th>
                  <th className="text-center">{summary.totalSKSApproved}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* ================= TABLE: TOP DOSEN ================= */}
      <div className="card bg-white shadow">
        <div className="card-body">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Top Dosen (Dummy)
          </h2>
          <p className="text-xs text-gray-500">
            Ranking sederhana berdasarkan SKS approved & total aktivitas.
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="table table-zebra text-sm text-center">
              <thead>
                <tr>
                  <th className="text-center">Nama Dosen</th>
                  <th className="text-center">Total Aktivitas</th>
                  <th className="text-center">Approved</th>
                  <th className="text-center">SKS Approved</th>
                </tr>
              </thead>
              <tbody>
                {topDosen.map((d, idx) => (
                  <tr key={idx}>
                    <td className="font-medium text-center">{d.name}</td>
                    <td>{d.total}</td>
                    <td className="text-success font-semibold">{d.approved}</td>
                    <td className="font-semibold">{d.sksApproved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Data di halaman ini bersifat dummy. Nanti bisa diisi dari agregasi
            collection submissions/activities (Firestore) atau endpoint
            statistik.
          </div>
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div className="alert alert-info">
        Halaman ini bersifat ringkasan strategis. Tidak ada aksi approve/edit.
      </div>
    </div>
  );
};

export default ReportAnalytics;
