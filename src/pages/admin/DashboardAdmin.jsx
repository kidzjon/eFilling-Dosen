import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { Button } from "../../components/Button";

const badgeClass = (status) => {
  switch (status) {
    case "approved":
      return "badge badge-success badge-outline";
    case "rejected":
      return "badge badge-error badge-outline";
    default:
      return "badge badge-warning badge-outline";
  }
};

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  // ===============================
  // DUMMY DATA (tanpa BE)
  // ===============================
  const dummy = useMemo(
    () => ({
      stats: {
        pending: 3,
        approvedToday: 5,
        rejectedToday: 1,
        totalToday: 9,
      },
      alerts: {
        overduePending: 1, // pending > 3 hari (dummy)
      },
      recentQueue: [
        {
          id: "sub_001",
          dosenName: "Krisna Firdiawan",
          title: "Mengajar Basis Data",
          type: "Pendidikan & Pengajaran",
          date: "14 Jan 2026",
          sks: 3,
          status: "pending",
        },
        {
          id: "sub_002",
          dosenName: "Aulia Rahman",
          title: "Penelitian MediaPipe Pose",
          type: "Penelitian",
          date: "13 Jan 2026",
          sks: 2,
          status: "pending",
        },
        {
          id: "sub_003",
          dosenName: "Sinta Lestari",
          title: "Pengabdian: Workshop AI untuk Siswa",
          type: "Pengabdian",
          date: "12 Jan 2026",
          sks: 2,
          status: "pending",
        },
        {
          id: "sub_004",
          dosenName: "Doni Saputra",
          title: "Penunjang: Reviewer Jurnal Internal",
          type: "Penunjang",
          date: "12 Jan 2026",
          sks: 1,
          status: "approved",
        },
        {
          id: "sub_005",
          dosenName: "Nadia Putri",
          title: "Pengabdian: Pelatihan Canva",
          type: "Pengabdian",
          date: "11 Jan 2026",
          sks: 1,
          status: "rejected",
        },
      ],
      notes:
        "Contoh catatan: Pastikan bukti PDF jelas, nama file disarankan Tahun_Jenis_Judul.pdf",
    }),
    []
  );

  // ===============================
  // OPTIONAL: Kalau activityApi.getPendingForAdmin() sudah ada dan aman,
  // tetap dipanggil untuk sinkron pendingCount (fallback ke dummy kalau error)
  // ===============================
  useEffect(() => {
    let mounted = true;

    Promise.resolve()
      .then(() => activityApi?.getPendingForAdmin?.())
      .then((list) => {
        if (!mounted) return;
        if (Array.isArray(list)) setPendingCount(list.length);
        else setPendingCount(dummy.stats.pending);
      })
      .catch(() => {
        if (!mounted) return;
        setPendingCount(dummy.stats.pending);
      });

    return () => {
      mounted = false;
    };
  }, [dummy.stats.pending]);

  const stats = {
    pending: pendingCount || dummy.stats.pending,
    approvedToday: dummy.stats.approvedToday,
    rejectedToday: dummy.stats.rejectedToday,
    totalToday: dummy.stats.totalToday,
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Dashboard Admin
          </h1>
          <p className="text-sm text-gray-600">
            Kelola dan validasi aktivitas dosen.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refresh
          </Button>
          <Button onClick={() => navigate("/admin/validation")}>
            Lihat Antrian Validasi
          </Button>
        </div>
      </div>

      {/* ================= SUMMARY (DaisyUI Stats) ================= */}
      <div className="stats stats-vertical lg:stats-horizontal bg-white shadow rounded-xl w-full">
        <div className="stat">
          <div className="stat-title text-gray-600">Pending</div>
          <div className="stat-value text-warning">{stats.pending}</div>
          <div className="stat-desc text-gray-500">Menunggu review admin</div>
        </div>

        <div className="stat">
          <div className="stat-title text-gray-600">Disetujui (Hari ini)</div>
          <div className="stat-value text-success">{stats.approvedToday}</div>
          <div className="stat-desc text-gray-500">
            Keputusan approve hari ini
          </div>
        </div>

        <div className="stat">
          <div className="stat-title text-gray-600">Ditolak (Hari ini)</div>
          <div className="stat-value text-danger">{stats.rejectedToday}</div>
          <div className="stat-desc text-gray-500">
            Keputusan reject hari ini
          </div>
        </div>

        <div className="stat">
          <div className="stat-title text-gray-600">Total Masuk (Hari ini)</div>
          <div className="stat-value text-primary">{stats.totalToday}</div>
          <div className="stat-desc text-gray-500">Total submit (dummy)</div>
        </div>
      </div>

      {/* ================= ALERT ================= */}
      {(dummy.alerts.overduePending > 0 || stats.pending > 0) && (
        <div className="alert alert-warning shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
            />
          </svg>

          <div>
            <h3 className="font-semibold">Perhatian</h3>
            <p className="text-sm opacity-80">
              Ada{" "}
              <span className="font-semibold">
                {dummy.alerts.overduePending}
              </span>{" "}
              aktivitas pending yang sudah lebih dari 3 hari (dummy).
              Prioritaskan review.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-outline"
              type="button"
              onClick={() => navigate("/admin/validation")}
            >
              Lihat Semua
            </button>
            <button
              className="btn btn-sm btn-primary"
              type="button"
              onClick={() => navigate("/admin/validation")}
            >
              Review Sekarang
            </button>
          </div>
        </div>
      )}

      {/* ================= RECENT QUEUE TABLE ================= */}
      <div className="card bg-white shadow rounded-xl">
        <div className="card-body">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Antrian Terbaru
              </h2>
              <p className="text-sm text-gray-600">
                Menampilkan {dummy.recentQueue.length} data terbaru (dummy).
              </p>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/admin/validation")}
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center">Dosen</th>
                  <th className="text-center">Judul</th>
                  <th className="text-center">Jenis</th>
                  <th className="text-center">Tanggal</th>
                  <th className="text-center">SKS</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {dummy.recentQueue.map((row) => (
                  <tr key={row.id} className="hover">
                    <td className="text-center">{row.dosenName}</td>
                    <td className="text-center font-medium">{row.title}</td>
                    <td className="text-center">{row.type}</td>
                    <td className="text-center">{row.date}</td>
                    <td className="text-center">{row.sks}</td>
                    <td className="text-center">
                      <span className={badgeClass(row.status)}>
                        {row.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/admin/validation/${row.id}`)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= INFO NOTE ================= */}
          <div className="mt-5">
            <div className="alert bg-base-200">
              <div>
                <h3 className="font-semibold">Info</h3>
                <p className="text-sm opacity-80">{dummy.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= QUICK MINI STATS (DUMMY) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card bg-white shadow rounded-xl">
          <div className="card-body">
            <h3 className="font-semibold text-gray-800">
              Performa Mingguan (Dummy)
            </h3>
            <p className="text-sm text-gray-600">
              Validasi selesai: <span className="font-semibold">18</span>
            </p>
            <progress
              className="progress progress-primary w-full mt-3"
              value={75}
              max="100"
            />
            <p className="text-xs text-gray-500 mt-2">
              Target internal: 24 validasi/minggu
            </p>
          </div>
        </div>

        <div className="card bg-white shadow rounded-xl">
          <div className="card-body">
            <h3 className="font-semibold text-gray-800">
              Rata-rata Waktu Review (Dummy)
            </h3>
            <div className="flex items-end gap-2 mt-2">
              <div className="text-4xl font-bold text-primary">1.8</div>
              <div className="text-sm text-gray-600 mb-1">hari</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Semakin cepat semakin baik untuk dosen.
            </p>
          </div>
        </div>

        <div className="card bg-white shadow rounded-xl">
          <div className="card-body">
            <h3 className="font-semibold text-gray-800">
              Kategori Terbanyak (Dummy)
            </h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Pendidikan</span>
                <span className="badge badge-primary badge-outline">45%</span>
              </div>
              <progress
                className="progress progress-primary w-full"
                value={45}
                max="100"
              />

              <div className="flex items-center justify-between text-sm">
                <span>Penelitian</span>
                <span className="badge badge-secondary badge-outline">30%</span>
              </div>
              <progress
                className="progress progress-secondary w-full"
                value={30}
                max="100"
              />

              <div className="flex items-center justify-between text-sm">
                <span>Pengabdian</span>
                <span className="badge badge-accent badge-outline">25%</span>
              </div>
              <progress
                className="progress progress-accent w-full"
                value={25}
                max="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
