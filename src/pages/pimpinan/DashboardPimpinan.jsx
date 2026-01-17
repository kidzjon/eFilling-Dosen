import React, { useEffect, useMemo, useState } from "react";
import { activityApi } from "../../api/activityApi";

const normalizeStatus = (status) =>
  String(status || "")
    .toLowerCase()
    .trim();

const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const DashboardPimpinan = () => {
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const all = await activityApi.getAllForPimpinan();
        if (!mounted) return;
        setAllActivities(Array.isArray(all) ? all : []);
      } catch (err) {
        if (!mounted) return;
        setAllActivities([]);
        setErrorMsg(err?.message || "Gagal memuat data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  // ===============================
  // KPI STATS
  // ===============================
  const stats = useMemo(() => {
    const total = allActivities.length;

    const approved = allActivities.filter(
      (a) => normalizeStatus(a.status) === "approved"
    ).length;

    const pending = allActivities.filter(
      (a) => normalizeStatus(a.status) === "pending"
    ).length;

    const rejected = allActivities.filter(
      (a) => normalizeStatus(a.status) === "rejected"
    ).length;

    const totalSKSApproved = allActivities
      .filter((a) => normalizeStatus(a.status) === "approved")
      .reduce((sum, a) => sum + safeNum(a.sks), 0);

    // avg sks approved per dosen (hanya dosen yang punya approved)
    const mapApproved = new Map();
    allActivities
      .filter((a) => normalizeStatus(a.status) === "approved")
      .forEach((a) => {
        const name = a?.dosenName || "-";
        mapApproved.set(name, (mapApproved.get(name) || 0) + safeNum(a.sks));
      });

    const dosenCount = mapApproved.size || 0;
    const avgSKS = dosenCount ? Math.round(totalSKSApproved / dosenCount) : 0;

    const approvalRate = total ? Math.round((approved / total) * 100) : 0;

    return {
      total,
      approved,
      pending,
      rejected,
      approvalRate,
      totalSKSApproved,
      avgSKS,
    };
  }, [allActivities]);

  // ===============================
  // DISTRIBUTION
  // ===============================
  const distribution = useMemo(() => {
    const map = {};
    allActivities.forEach((a) => {
      const label = String(a?.category || "Lainnya").trim() || "Lainnya";
      map[label] = (map[label] || 0) + 1;
    });

    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [allActivities]);

  // ===============================
  // TOP DOSEN
  // ===============================
  const topDosen = useMemo(() => {
    const map = {};
    allActivities.forEach((a) => {
      const name = a?.dosenName || "-";
      if (!map[name]) map[name] = { name, total: 0, sksApproved: 0 };

      map[name].total += 1;
      if (normalizeStatus(a.status) === "approved") {
        map[name].sksApproved += safeNum(a.sks);
      }
    });

    return Object.values(map)
      .sort((a, b) => b.sksApproved - a.sksApproved || b.total - a.total)
      .slice(0, 5);
  }, [allActivities]);

  // ===============================
  // INSIGHT
  // ===============================
  const insight = useMemo(() => {
    const mostType = distribution[0];
    const top = topDosen[0];

    return {
      mostType: mostType?.label || "-",
      mostTypeCount: mostType?.value || 0,
      topDosen: top?.name || "-",
      topDosenSKS: top?.sksApproved || 0,
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
          Tampilan ringkas capaian aktivitas dosen (real data dari DB).
        </p>
      </div>

      {/* ================= ERROR INFO ================= */}
      {!loading && errorMsg ? (
        <div className="alert alert-error">
          <span className="font-semibold">Gagal memuat data:</span>{" "}
          <span>{errorMsg}</span>
        </div>
      ) : null}

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Total Aktivitas</p>
          <h2 className="mt-2 text-3xl font-bold text-primary">
            {loading ? "..." : stats.total}
          </h2>
          <p className="text-xs text-gray-500 mt-1">Ringkasan keseluruhan</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Disetujui</p>
          <h2 className="mt-2 text-3xl font-bold text-success">
            {loading ? "..." : stats.approved}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Approval rate: {loading ? "..." : stats.approvalRate}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-warning">
            {loading ? "..." : stats.pending}
          </h2>
          <p className="mt-1 text-xs text-gray-500">Menunggu review admin</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Ditolak</p>
          <h2 className="mt-2 text-3xl font-bold text-danger">
            {loading ? "..." : stats.rejected}
          </h2>
          <p className="mt-1 text-xs text-gray-500">Perlu perbaikan dosen</p>
        </div>
      </div>

      {/* ================= QUICK INSIGHTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card bg-white shadow lg:col-span-2">
          <div className="card-body">
            <h2 className="text-sm font-semibold text-gray-700">
              Insight Singkat
            </h2>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Jenis Terbanyak</p>
                <p className="mt-1 font-semibold">
                  {loading
                    ? "Memuat..."
                    : `${insight.mostType} (${insight.mostTypeCount})`}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Top SKS Disetujui</p>
                <p className="mt-1 font-semibold">
                  {loading
                    ? "Memuat..."
                    : `${insight.topDosen} (${insight.topDosenSKS} SKS)`}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Total SKS (Approved)</p>
                <p className="mt-1 font-semibold">
                  {loading ? "..." : `${stats.totalSKSApproved} SKS`}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Rata-rata SKS / Dosen</p>
                <p className="mt-1 font-semibold">
                  {loading ? "..." : `${stats.avgSKS} SKS`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ALERT */}
        <div className="space-y-3">
          {loading ? (
            <div className="alert alert-info">Memuat ringkasan...</div>
          ) : insight.warnRejected ? (
            <div className="alert alert-error">
              Ada {stats.rejected} aktivitas ditolak. Perlu tindak lanjut.
            </div>
          ) : insight.warnPending ? (
            <div className="alert alert-warning">
              Ada {stats.pending} aktivitas pending.
            </div>
          ) : (
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

            {loading ? (
              <div className="text-sm text-gray-500">Memuat...</div>
            ) : distribution.length === 0 ? (
              <div className="text-sm text-gray-500">
                Belum ada data aktivitas
              </div>
            ) : (
              distribution.map((item) => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full"
                    value={item.value}
                    max={stats.total || 1}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <h2 className="text-sm font-semibold mb-3">Top Dosen</h2>

            {loading ? (
              <div className="text-sm text-gray-500">Memuat...</div>
            ) : topDosen.length === 0 ? (
              <div className="text-sm text-gray-500">Belum ada data dosen</div>
            ) : (
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
                      <td className="text-center">{d.sksApproved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        Dashboard ini bersifat ringkasan strategis untuk pimpinan.
      </div>
    </div>
  );
};

export default DashboardPimpinan;
