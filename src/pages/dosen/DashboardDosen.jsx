import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";

// ===============================
// DUMMY DATA (fallback)
// ===============================
const DUMMY_RECENT = [
  {
    id: "a1",
    title: "Mengajar Grafika Komputer",
    type: "Pendidikan & Pengajaran",
    date: "2026-01-05",
    sks: 3,
    status: "approved",
    reviewNotes: "",
  },
  {
    id: "a2",
    title: "Penelitian MediaPipe Pose",
    type: "Penelitian",
    date: "2026-01-08",
    sks: 2,
    status: "pending",
    reviewNotes: "",
  },
  {
    id: "a3",
    title: "Pengabdian: Workshop AI untuk Siswa",
    type: "Pengabdian",
    date: "2026-01-10",
    sks: 2,
    status: "rejected",
    reviewNotes:
      "Bukti kegiatan kurang jelas. Mohon upload surat tugas + dokumentasi.",
  },
  {
    id: "a4",
    title: "Penunjang: Reviewer Jurnal Internal",
    type: "Penunjang",
    date: "2026-01-12",
    sks: 1,
    status: "approved",
    reviewNotes: "",
  },
  {
    id: "a5",
    title: "Mengajar Basis Data",
    type: "Pendidikan & Pengajaran",
    date: "2026-01-14",
    sks: 3,
    status: "pending",
    reviewNotes: "",
  },
];

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const statusBadge = (status) => {
  switch (status) {
    case "approved":
      return "badge badge-success badge-outline";
    case "rejected":
      return "badge badge-error badge-outline";
    default:
      return "badge badge-warning badge-outline";
  }
};

// ===============================
// Normalizer: BE -> UI model
// (biar aman meski field teman beda)
// ===============================
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
  const status = (
    a?.status ||
    a?.state ||
    a?.data?.status ||
    "pending"
  ).toLowerCase();
  const reviewNotes =
    a?.reviewNotes || a?.notes || a?.catatan || a?.data?.reviewNotes || "";

  return { id, title, type, date, sks, status, reviewNotes };
};

const DashboardDosen = () => {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  // data utama dashboard (BE kalau ada, fallback dummy)
  const [activities, setActivities] = useState(DUMMY_RECENT);
  const [source, setSource] = useState("dummy"); // "be" | "dummy"

  useEffect(() => {
    const fetchFromBE = async () => {
      try {
        const list = await activityApi.getByDosen(); // versi BE teman kamu
        const normalized = (Array.isArray(list) ? list : [])
          .map(normalizeActivity)
          .filter((x) => x.id); // minimal punya id

        if (normalized.length > 0) {
          setActivities(normalized);
          setSource("be");
        } else {
          // kalau BE kosong, biarin dummy biar UI tetap kelihatan
          setActivities(DUMMY_RECENT);
          setSource("dummy");
        }
      } catch (err) {
        console.error(
          "Failed to load dashboard activities (fallback dummy):",
          err
        );
        setActivities(DUMMY_RECENT);
        setSource("dummy");
      }
    };

    fetchFromBE();
  }, []);

  // ===============================
  // HITUNG STATS DARI activities (BE atau dummy)
  // ===============================
  const stats = useMemo(() => {
    const total = activities.length;
    const pending = activities.filter((x) => x.status === "pending").length;
    const approved = activities.filter((x) => x.status === "approved").length;
    const rejected = activities.filter((x) => x.status === "rejected").length;

    const sksApproved = activities
      .filter((x) => x.status === "approved")
      .reduce((sum, x) => sum + (Number(x.sks) || 0), 0);

    const latest = [...activities].sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    )[0];

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
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
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
            Ringkasan aktivitas dan status validasi{" "}
            <span className="text-xs opacity-60">
              ({source === "be" ? "data BE" : "dummy"})
            </span>
            .
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

        {/* ================= PROGRESS / TARGET (dummy logic tetap) ================= */}
        <div className="lg:col-span-3">
          <div className="card bg-white shadow h-full">
            <div className="card-body">
              <p className="text-sm text-gray-600">Progress SKS (Dummy)</p>

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
                Menampilkan 5 pengajuan terakhir (
                {source === "be" ? "BE" : "dummy"}).
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
