import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { Button } from "../../components/Button";

const badgeClass = (status) => {
  switch (String(status || "").toLowerCase()) {
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

  const [allActivities, setAllActivities] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeTimestamp = (value) => {
    if (!value) return null;

    // Firestore Timestamp
    if (value.seconds) return new Date(value.seconds * 1000);

    // ISO string / date string
    const d = new Date(value);
    if (!isNaN(d)) return d;

    return null;
  };

  const normalizeStatus = (status) =>
    String(status || "")
      .toLowerCase()
      .trim();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [all, pending] = await Promise.all([
          activityApi.getAllForAdmin(),
          activityApi.getPendingForAdmin(),
        ]);

        if (!mounted) return;

        setAllActivities(all || []);
        setPendingActivities(pending || []);
      } catch (err) {
        console.error(err);
        if (mounted) {
          setAllActivities([]);
          setPendingActivities([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, []);

  const recentSubmissions = useMemo(() => {
    return [...pendingActivities]
      .sort(
        (a, b) =>
          (normalizeTimestamp(b.createdAt) || 0) -
          (normalizeTimestamp(a.createdAt) || 0)
      )
      .slice(0, 5);
  }, [pendingActivities]);

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const approvedLast7Days = useMemo(() => {
    return allActivities.filter((a) => {
      const status = normalizeStatus(a.status);
      const d = normalizeTimestamp(a.updatedAt || a.createdAt);
      return status === "approved" && d && d >= sevenDaysAgo;
    }).length;
  }, [allActivities]);

  const rejectedLast7Days = useMemo(() => {
    return allActivities.filter((a) => {
      const status = normalizeStatus(a.status);
      const d = normalizeTimestamp(a.updatedAt || a.createdAt);
      return status === "rejected" && d && d >= sevenDaysAgo;
    }).length;
  }, [allActivities]);

  const totalLast7Days = useMemo(() => {
    return allActivities.filter((a) => {
      const d = normalizeTimestamp(a.createdAt);
      return d && d >= sevenDaysAgo && d <= now;
    }).length;
  }, [allActivities]);

  const stats = useMemo(
    () => ({
      pending: allActivities.filter(
        (a) => normalizeStatus(a.status) === "pending"
      ).length,
      approvedLast7Days,
      rejectedLast7Days,
      totalLast7Days,
      recentQueue: recentSubmissions.length,
      notes: "Data diperbarui otomatis berdasarkan aktivitas terbaru.",
    }),
    [
      allActivities,
      approvedLast7Days,
      rejectedLast7Days,
      totalLast7Days,
      recentSubmissions.length,
    ]
  );

  const CATEGORY_LABEL = {
    education: "Pendidikan",
    research: "Penelitian",
    service: "Pengabdian",
    support: "Penunjang",
    other: "Lainnya",
  };

  const normalizeCategory = (raw) => {
    if (!raw || typeof raw !== "string") return "other";

    const v = raw.toLowerCase().trim();

    if (v === "" || v === "lainnya" || v === "other" || v === "-")
      return "other";

    // kalau data kamu sudah pakai label lengkap (contoh: "Penelitian"),
    // tetap aman karena kita pakai key sesuai input.
    return v;
  };

  const categoryStats = useMemo(() => {
    const map = {};

    pendingActivities.forEach((s) => {
      const category = normalizeCategory(s.category);
      map[category] = (map[category] || 0) + 1;
    });

    const total = Object.values(map).reduce((a, b) => a + b, 0);

    return Object.entries(map).map(([key, count]) => ({
      key,
      count,
      percent: total ? Math.round((count / total) * 100) : 0,
    }));
  }, [pendingActivities]);

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
          <div className="stat-title text-gray-600">
            Disetujui (7 Hari Terakhir)
          </div>
          <div className="stat-value text-success">
            {stats.approvedLast7Days}
          </div>
          <div className="stat-desc text-gray-500">
            Keputusan approve 7 hari terakhir
          </div>
        </div>

        <div className="stat">
          <div className="stat-title text-gray-600">
            Ditolak (7 Hari Terakhir)
          </div>
          <div className="stat-value text-danger">
            {stats.rejectedLast7Days}
          </div>
          <div className="stat-desc text-gray-500">
            Keputusan reject 7 hari terakhir
          </div>
        </div>

        <div className="stat">
          <div className="stat-title text-gray-600">
            Total Masuk (7 Hari Terakhir)
          </div>
          <div className="stat-value text-primary">{stats.totalLast7Days}</div>
          <div className="stat-desc text-gray-500">
            Jumlah pengajuan 7 hari terakhir
          </div>
        </div>
      </div>

      {/* ================= KATEGORI TERBANYAK ================= */}
      <div className="stats bg-white shadow rounded-xl w-full">
        <div className="stat">
          <div className="stat-title text-gray-600">
            Kategori Terbanyak (Pending)
          </div>

          {loading ? (
            <div className="mt-2 text-sm text-gray-500">Memuat...</div>
          ) : categoryStats.length === 0 ? (
            <div className="mt-2 text-sm text-gray-500">
              Belum ada data pending
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {categoryStats
                .sort((a, b) => b.count - a.count)
                .map((c) => (
                  <div key={c.key}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{CATEGORY_LABEL[c.key] || c.key}</span>
                      <span className="badge badge-outline">{c.percent}%</span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value={c.percent}
                      max="100"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= ALERT ================= */}
      {stats.pending > 0 && (
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
              Ada <span className="font-semibold">{stats.pending}</span>{" "}
              aktivitas pending. Prioritaskan review.
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
                Menampilkan {stats.recentQueue} data terbaru.
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
                {recentSubmissions.map((row) => (
                  <tr key={row.id} className="hover">
                    <td className="text-center">{row.dosenName || "-"}</td>
                    <td className="text-center font-medium">
                      {row.title || "-"}
                    </td>
                    <td className="text-center">{row.category || "-"}</td>
                    <td className="text-center">
                      {row.createdAt?.toDate
                        ? row.createdAt.toDate().toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="text-center">{row.sks ?? 0}</td>
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

                {!loading && recentSubmissions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-sm text-gray-500 py-6"
                    >
                      Tidak ada antrian pending
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ================= INFO NOTE ================= */}
          <div className="mt-5">
            <div className="alert bg-base-200">
              <div>
                <h3 className="font-semibold">Info</h3>
                <p className="text-sm opacity-80">{stats.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
