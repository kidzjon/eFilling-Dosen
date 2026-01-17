// src/pages/dosen/DashboardDosen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { useAuth } from "@/hooks/useAuth";

const fmtDate = (value) => {
  if (!value) return "-";

  // Firestore Timestamp
  if (typeof value === "object" && value.seconds) {
    return new Date(value.seconds * 1000).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // Date object / ISO string
  const d = new Date(value);
  if (isNaN(d)) return "-";

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toDateObj = (value) => {
  if (!value) return null;
  if (typeof value === "object" && value.seconds)
    return new Date(value.seconds * 1000);
  const d = new Date(value);
  return isNaN(d) ? null : d;
};

const statusBadge = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "approved":
      return "badge badge-success badge-outline";
    case "rejected":
      return "badge badge-error badge-outline";
    default:
      return "badge badge-warning badge-outline";
  }
};

// Normalizer: BE -> UI model (biar aman kalau field beda)
const normalizeActivity = (a) => {
  const id = a?.id || a?.submissionId || a?.docId || a?._id;
  const title =
    a?.title || a?.judul || a?.activityTitle || a?.data?.title || "-";
  const type = a?.type || a?.jenis || a?.category || a?.data?.type || "-";
  const date =
    a?.date ||
    a?.tanggal ||
    a?.createdAt ||
    a?.submittedAt ||
    a?.data?.date ||
    null;

  const sks = Number(a?.sks ?? a?.credits ?? a?.data?.sks ?? 0) || 0;
  const status = String(a?.status || a?.state || a?.data?.status || "pending")
    .toLowerCase()
    .trim();

  const reviewNotes =
    a?.reviewNotes || a?.notes || a?.catatan || a?.data?.reviewNotes || "";

  return { id, title, type, date, sks, status, reviewNotes };
};

const DashboardDosen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchFromBE = async () => {
      setLoading(true);
      try {
        const list = await activityApi.getByDosen();
        const normalized = (Array.isArray(list) ? list : [])
          .map(normalizeActivity)
          .filter((x) => x.id);

        if (!mounted) return;
        setActivities(normalized);
      } catch (err) {
        console.error("Failed to load dashboard activities:", err);
        if (!mounted) return;
        setActivities([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFromBE();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = activities.length;
    const pending = activities.filter((x) => x.status === "pending").length;
    const approved = activities.filter((x) => x.status === "approved").length;
    const rejected = activities.filter((x) => x.status === "rejected").length;

    const sksApproved = activities
      .filter((x) => x.status === "approved")
      .reduce((sum, x) => sum + (Number(x.sks) || 0), 0);

    const latest = [...activities].sort((a, b) => {
      const da = toDateObj(a.date)?.getTime() || 0;
      const db = toDateObj(b.date)?.getTime() || 0;
      return db - da;
    })[0];

    return {
      total,
      pending,
      approved,
      rejected,
      sksApproved,
      latestUpdatedAt: latest?.date || null,
      needsFix: rejected,
    };
  }, [activities]);

  const recentList = useMemo(() => {
    return [...activities]
      .sort((a, b) => {
        const da = toDateObj(a.date)?.getTime() || 0;
        const db = toDateObj(b.date)?.getTime() || 0;
        return db - da;
      })
      .slice(0, 5);
  }, [activities]);

  const firstRejected = useMemo(() => {
    return activities.find((x) => x.status === "rejected") || null;
  }, [activities]);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Dashboard Dosen
          </h1>
          <p className="text-sm text-gray-600">
            Ringkasan aktivitas dan status validasi.
            {user?.name ? (
              <span className="text-xs text-gray-500"> • {user.name}</span>
            ) : null}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/dosen/activities")}
          >
            Lihat Aktivitas
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/dosen/activities/new")}
          >
            Tambah Aktivitas
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="card bg-white shadow">
              <div className="card-body">
                <p className="text-sm text-gray-600">Total Aktivitas</p>
                <div className="mt-1 flex items-end justify-between">
                  <h2 className="text-3xl font-bold text-primary">
                    {stats.total}
                  </h2>
                  <span className="badge badge-ghost">Semua</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Update terakhir:{" "}
                  {stats.latestUpdatedAt ? fmtDate(stats.latestUpdatedAt) : "-"}
                </p>
              </div>
            </div>

            <div className="card bg-white shadow">
              <div className="card-body">
                <p className="text-sm text-gray-600">Pending</p>
                <div className="mt-1 flex items-end justify-between">
                  <h2 className="text-3xl font-bold text-warning">
                    {stats.pending}
                  </h2>
                  <span className="badge badge-warning badge-outline">
                    Menunggu
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Sedang diproses admin
                </p>
              </div>
            </div>

            <div className="card bg-white shadow">
              <div className="card-body">
                <p className="text-sm text-gray-600">Disetujui</p>
                <div className="mt-1 flex items-end justify-between">
                  <h2 className="text-3xl font-bold text-success">
                    {stats.approved}
                  </h2>
                  <span className="badge badge-success badge-outline">
                    Approved
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  SKS disetujui:{" "}
                  <span className="font-semibold">{stats.sksApproved}</span>
                </p>
              </div>
            </div>

            <div className="card bg-white shadow">
              <div className="card-body">
                <p className="text-sm text-gray-600">Ditolak</p>
                <div className="mt-1 flex items-end justify-between">
                  <h2 className="text-3xl font-bold text-danger">
                    {stats.rejected}
                  </h2>
                  <span className="badge badge-error badge-outline">
                    Rejected
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Perlu revisi & ajukan ulang
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PROGRESS / TARGET ================= */}
        <div className="lg:col-span-3">
          <div className="card bg-white shadow h-full">
            <div className="card-body">
              <p className="text-sm text-gray-600">Progress SKS </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-700">Target</span>
                <span className="text-sm font-semibold text-gray-800">
                  12 SKS
                </span>
              </div>

              <progress
                className="progress progress-success w-full mt-2"
                value={Math.min(stats.sksApproved, 12)}
                max={12}
              />

              <p className="text-xs text-gray-500 mt-2">
                Disetujui:{" "}
                <span className="font-semibold">{stats.sksApproved}</span> / 12
              </p>

              <div className="mt-4 text-xs text-gray-500">
                <div className="flex items-start gap-2">
                  <span className="badge badge-ghost badge-sm mt-0.5">
                    Info
                  </span>
                  <p>
                    File bukti: PDF/JPG/PNG (maks 10MB). Nama file disarankan:
                    <span className="font-medium"> Tahun_Jenis_Judul.pdf</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= NEED ATTENTION ================= */}
      {stats.needsFix > 0 ? (
        <div className="alert alert-error shadow">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              Ada {stats.needsFix} aktivitas ditolak.
            </span>
            <span className="text-sm opacity-90">
              Silakan perbaiki dan ajukan ulang agar bisa divalidasi.
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => navigate("/dosen/activities")}
            >
              Lihat Semua
            </button>

            {firstRejected?.id && (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() =>
                  navigate(`/dosen/activities/${firstRejected.id}/edit`)
                }
              >
                Perbaiki Sekarang
              </button>
            )}
          </div>
        </div>
      ) : stats.pending > 0 ? (
        <div className="alert alert-warning shadow">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              Ada {stats.pending} aktivitas yang masih pending.
            </span>
            <span className="text-sm opacity-90">
              Kamu bisa menunggu proses validasi admin.
            </span>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => navigate("/dosen/activities")}
          >
            Lihat Aktivitas
          </button>
        </div>
      ) : (
        <div className="alert alert-success shadow">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Semua aman 🎉</span>
            <span className="text-sm opacity-90">
              Tidak ada aktivitas yang pending/ditolak saat ini.
            </span>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => navigate("/dosen/activities/new")}
          >
            Tambah Aktivitas
          </button>
        </div>
      )}

      {/* ================= RECENT ACTIVITIES ================= */}
      <div className="card bg-white shadow">
        <div className="card-body">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Aktivitas Terbaru
              </h2>
              <p className="text-sm text-gray-600">
                Menampilkan 5 pengajuan terakhir.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => navigate("/dosen/activities")}
            >
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table table-zebra text-center">
              <thead>
                <tr>
                  <th className="text-center">Judul</th>
                  <th className="text-center">Jenis</th>
                  <th className="text-center">Tanggal</th>
                  <th className="text-center">SKS</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {recentList.map((row) => (
                  <tr key={row.id}>
                    <td className="font-medium text-center">{row.title}</td>
                    <td>{row.type}</td>
                    <td>{fmtDate(row.date)}</td>
                    <td>{row.sks}</td>
                    <td>
                      <span className={statusBadge(row.status)}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() =>
                            navigate(`/dosen/activities/${row.id}`)
                          }
                        >
                          Detail
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          disabled={row.status === "approved"}
                          onClick={() =>
                            navigate(`/dosen/activities/${row.id}/edit`)
                          }
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && recentList.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-sm text-gray-500 py-6"
                    >
                      Belum ada aktivitas. Klik <b>Tambah Aktivitas</b> untuk
                      membuat pengajuan.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-sm text-gray-500 py-6"
                    >
                      Memuat data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {firstRejected?.reviewNotes ? (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <span className="font-semibold">
                Catatan terakhir dari Admin:
              </span>{" "}
              {firstRejected.reviewNotes}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DashboardDosen;
