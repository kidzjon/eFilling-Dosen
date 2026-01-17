import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { activityApi } from "../../api/activityApi";

// ✅ PDF libs (Opsi 1)
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const normalizeStatus = (status) =>
  String(status || "")
    .toLowerCase()
    .trim();

const normalizeCategory = (raw) => {
  if (!raw) return "Lainnya";
  return String(raw).trim();
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// ===== helpers: download file =====
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// ===== helpers: CSV escape =====
const csvEscape = (v) => {
  const s = String(v ?? "");
  const escaped = s.replace(/"/g, '""');
  return `"${escaped}"`;
};

// ===== helpers: date =====
const todayISO = () => new Date().toISOString().slice(0, 10);
const todayLocale = () =>
  new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const ReportAnalytics = () => {
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setLoading(true);
      setErrMsg("");
      try {
        const list =
          (activityApi.getAllForPimpinan
            ? await activityApi.getAllForPimpinan()
            : await activityApi.getAllForAdmin?.()) || [];

        if (!mounted) return;
        setAllActivities(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
        if (!mounted) return;

        const msg = String(e?.message || e || "Gagal memuat data");
        setErrMsg(msg);
        setAllActivities([]);
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
  // AGREGASI SUMMARY
  // ===============================
  const summary = useMemo(() => {
    const totalAktivitas = allActivities.length;

    const disetujui = allActivities.filter(
      (a) => normalizeStatus(a.status) === "approved"
    ).length;

    const pending = allActivities.filter(
      (a) => normalizeStatus(a.status) === "pending"
    ).length;

    const ditolak = allActivities.filter(
      (a) => normalizeStatus(a.status) === "rejected"
    ).length;

    const totalSKSApproved = allActivities
      .filter((a) => normalizeStatus(a.status) === "approved")
      .reduce((sum, a) => sum + toNumber(a.sks), 0);

    const approvalRate = totalAktivitas
      ? Math.round((disetujui / totalAktivitas) * 100)
      : 0;

    return {
      totalAktivitas,
      disetujui,
      pending,
      ditolak,
      totalSKSApproved,
      approvalRate,
    };
  }, [allActivities]);

  // ===============================
  // REKAP PER JENIS (byJenis)
  // ===============================
  const byJenis = useMemo(() => {
    const map = new Map();

    for (const a of allActivities) {
      const jenis = normalizeCategory(a.category || a.type || "Lainnya");
      const status = normalizeStatus(a.status);
      const sks = toNumber(a.sks);

      if (!map.has(jenis)) {
        map.set(jenis, {
          jenis,
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          sksApproved: 0,
        });
      }

      const row = map.get(jenis);
      row.total += 1;

      if (status === "approved") {
        row.approved += 1;
        row.sksApproved += sks;
      } else if (status === "pending") {
        row.pending += 1;
      } else if (status === "rejected") {
        row.rejected += 1;
      } else {
        row.pending += 1; // unknown -> pending
      }
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [allActivities]);

  // ===============================
  // TOP DOSEN
  // ranking: sksApproved desc, lalu total desc
  // ===============================
  const topDosen = useMemo(() => {
    const map = new Map();

    for (const a of allActivities) {
      const dosenName = String(a.dosenName || a.dosen || "-").trim() || "-";
      const status = normalizeStatus(a.status);
      const sks = toNumber(a.sks);

      if (!map.has(dosenName)) {
        map.set(dosenName, {
          name: dosenName,
          total: 0,
          approved: 0,
          sksApproved: 0,
        });
      }

      const row = map.get(dosenName);
      row.total += 1;

      if (status === "approved") {
        row.approved += 1;
        row.sksApproved += sks;
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.sksApproved - a.sksApproved || b.total - a.total)
      .slice(0, 10);
  }, [allActivities]);

  // ===============================
  // INSIGHT
  // ===============================
  const mostJenis = useMemo(() => {
    const max = byJenis[0];
    return max ? `${max.jenis} (${max.total})` : "-";
  }, [byJenis]);

  const topSKS = useMemo(() => {
    const max = topDosen[0];
    return max ? `${max.name} (${max.sksApproved} SKS)` : "-";
  }, [topDosen]);

  // ===============================
  // EXPORTS (Aksi Cepat)
  // ===============================

  // 1) Unduh Rekap Jenis (CSV)
  const exportRekapJenisCsv = () => {
    const rows = [
      ["jenis", "total", "approved", "pending", "rejected", "sksApproved"],
      ...byJenis.map((r) => [
        r.jenis,
        r.total,
        r.approved,
        r.pending,
        r.rejected,
        r.sksApproved,
      ]),
      [
        "TOTAL",
        summary.totalAktivitas,
        summary.disetujui,
        summary.pending,
        summary.ditolak,
        summary.totalSKSApproved,
      ],
    ];

    const csv = rows
      .map((r) => r.map((x) => csvEscape(x)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const filename = `rekap_jenis_${todayISO()}.csv`;
    downloadBlob(blob, filename);
  };

  // 2) Unduh Top Dosen (CSV)
  const exportTopDosenCsv = () => {
    const rows = [
      ["name", "totalAktivitas", "approved", "sksApproved"],
      ...topDosen.map((d) => [d.name, d.total, d.approved, d.sksApproved]),
    ];

    const csv = rows
      .map((r) => r.map((x) => csvEscape(x)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const filename = `top_dosen_${todayISO()}.csv`;
    downloadBlob(blob, filename);
  };

  // 3) Arsipkan Laporan (JSON snapshot)
  const archiveReportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      summary,
      mostJenis,
      topSKS,
      byJenis,
      topDosen,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const filename = `arsip_laporan_${todayISO()}.json`;
    downloadBlob(blob, filename);
  };

  // ===============================
  // ✅ PDF EXPORT (Opsi 1)
  // ===============================

  // shared: header block
  const addPdfHeader = (doc, title) => {
    doc.setFontSize(14);
    doc.text(title, 14, 14);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${todayLocale()}`, 14, 20);
  };

  // shared: summary small text
  const addPdfSummary = (doc, startY = 26) => {
    doc.setFontSize(10);
    const lines = [
      `Total Aktivitas: ${summary.totalAktivitas}`,
      `Disetujui: ${summary.disetujui} | Pending: ${summary.pending} | Ditolak: ${summary.ditolak}`,
      `Approval Rate: ${summary.approvalRate}% | Total SKS Approved: ${summary.totalSKSApproved}`,
      `Highlight: Jenis terbanyak = ${mostJenis} | Top SKS = ${topSKS}`,
    ];
    lines.forEach((t, i) => doc.text(t, 14, startY + i * 5));
    return startY + lines.length * 5 + 4;
  };

  // 1) PDF: Rekap Jenis
  const exportRekapJenisPdf = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    addPdfHeader(doc, "Rekap Aktivitas per Jenis");
    const nextY = addPdfSummary(doc, 26);

    const head = [
      ["Jenis", "Total", "Approved", "Pending", "Rejected", "SKS Approved"],
    ];
    const body = byJenis.map((r) => [
      r.jenis,
      r.total,
      r.approved,
      r.pending,
      r.rejected,
      r.sksApproved,
    ]);

    // total row
    body.push([
      "TOTAL",
      summary.totalAktivitas,
      summary.disetujui,
      summary.pending,
      summary.ditolak,
      summary.totalSKSApproved,
    ]);

    autoTable(doc, {
      head,
      body,
      startY: nextY,
      styles: { fontSize: 9 },
    });

    doc.save(`rekap_jenis_${todayISO()}.pdf`);
  };

  // 2) PDF: Top Dosen
  const exportTopDosenPdf = () => {
    const doc = new jsPDF({ orientation: "portrait" });

    addPdfHeader(doc, "Top Dosen (berdasarkan SKS Approved)");
    const nextY = addPdfSummary(doc, 26);

    const head = [
      ["Nama Dosen", "Total Aktivitas", "Approved", "SKS Approved"],
    ];
    const body = topDosen.map((d) => [
      d.name,
      d.total,
      d.approved,
      d.sksApproved,
    ]);

    autoTable(doc, {
      head,
      body,
      startY: nextY,
      styles: { fontSize: 10 },
    });

    doc.save(`top_dosen_${todayISO()}.pdf`);
  };

  // 3) PDF: Arsip Laporan (ringkasan + 2 tabel)
  const archiveReportPdf = () => {
    const doc = new jsPDF({ orientation: "portrait" });

    addPdfHeader(doc, "Arsip Laporan Analytics");
    let cursorY = addPdfSummary(doc, 26);

    // Table 1: Rekap Jenis (ringkas)
    autoTable(doc, {
      head: [
        ["Jenis", "Total", "Approved", "Pending", "Rejected", "SKS Approved"],
      ],
      body: byJenis.map((r) => [
        r.jenis,
        r.total,
        r.approved,
        r.pending,
        r.rejected,
        r.sksApproved,
      ]),
      startY: cursorY,
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });

    cursorY = (doc.lastAutoTable?.finalY || cursorY) + 8;

    // Table 2: Top Dosen
    autoTable(doc, {
      head: [["Nama Dosen", "Total", "Approved", "SKS Approved"]],
      body: topDosen.map((d) => [d.name, d.total, d.approved, d.sksApproved]),
      startY: cursorY,
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });

    doc.save(`arsip_laporan_${todayISO()}.pdf`);
  };

  // ===============================
  // ACTIONS header (optional)
  // ===============================
  const handleExportPdf = () => {
    alert("Export PDF - nanti dihubungkan ke fitur export.");
  };

  const handleExportExcel = () => {
    alert("Export Excel - nanti dihubungkan ke fitur export.");
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
            Ringkasan aktivitas dosen (real data dari DB). Fokus tabel rekap,
            tanpa chart.
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

      {/* ================= ERROR ================= */}
      {errMsg ? (
        <div className="alert alert-error shadow">
          <div>
            <b>Gagal memuat data:</b> {errMsg}
          </div>
        </div>
      ) : null}

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="card bg-white shadow lg:col-span-2">
          <div className="card-body">
            <p className="text-sm text-gray-600">Total Aktivitas</p>
            <h2 className="text-3xl font-bold text-primary">
              {loading ? "..." : summary.totalAktivitas}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Ringkasan keseluruhan</p>
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <p className="text-sm text-gray-600">Disetujui</p>
            <h2 className="text-3xl font-bold text-success">
              {loading ? "..." : summary.disetujui}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Approval: {loading ? "..." : summary.approvalRate}%
            </p>
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <p className="text-sm text-gray-600">Pending</p>
            <h2 className="text-3xl font-bold text-warning">
              {loading ? "..." : summary.pending}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Menunggu review</p>
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <p className="text-sm text-gray-600">Ditolak</p>
            <h2 className="text-3xl font-bold text-danger">
              {loading ? "..." : summary.ditolak}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Perlu perbaikan</p>
          </div>
        </div>

        <div className="card bg-white shadow">
          <div className="card-body">
            <p className="text-sm text-gray-600">SKS (Approved)</p>
            <h2 className="text-3xl font-bold text-gray-800">
              {loading ? "..." : summary.totalSKSApproved}
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
                <p className="mt-1 font-semibold text-gray-800">
                  {loading ? "..." : mostJenis}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Top SKS Disetujui</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {loading ? "..." : topSKS}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Catatan</p>
                <p className="mt-1 text-sm text-gray-700">
                  Data dihitung otomatis dari seluruh aktivitas yang ada.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-500">Rekomendasi</p>
                <p className="mt-1 text-sm text-gray-700">
                  Pantau status pending & rejected untuk tindak lanjut.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {!loading && summary.ditolak > 0 ? (
            <div className="alert alert-error shadow">
              Ada <b>{summary.ditolak}</b> aktivitas ditolak. Perlu tindak
              lanjut.
            </div>
          ) : null}

          {!loading && summary.pending > 0 ? (
            <div className="alert alert-warning shadow">
              Ada <b>{summary.pending}</b> aktivitas pending. Prioritaskan
              review.
            </div>
          ) : null}

          {!loading && summary.pending === 0 && summary.ditolak === 0 ? (
            <div className="alert alert-success shadow">
              Semua aman 🎉 Tidak ada pending/ditolak.
            </div>
          ) : null}

          {/* ✅ AKSI CEPAT: CSV + PDF + Arsip */}
          <div className="card bg-white shadow">
            <div className="card-body">
              <h3 className="text-sm font-semibold text-gray-700">
                Aksi Cepat
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-2">
                {/* Rekap Jenis */}
                <button
                  className="btn btn-outline btn-sm"
                  type="button"
                  onClick={exportRekapJenisCsv}
                  disabled={loading || byJenis.length === 0}
                >
                  Unduh Rekap Jenis (CSV)
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  type="button"
                  onClick={exportRekapJenisPdf}
                  disabled={loading || byJenis.length === 0}
                >
                  Unduh Rekap Jenis (PDF)
                </button>

                {/* Top Dosen */}
                <button
                  className="btn btn-outline btn-sm"
                  type="button"
                  onClick={exportTopDosenCsv}
                  disabled={loading || topDosen.length === 0}
                >
                  Unduh Top Dosen (CSV)
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  type="button"
                  onClick={exportTopDosenPdf}
                  disabled={loading || topDosen.length === 0}
                >
                  Unduh Top Dosen (PDF)
                </button>

                {/* Arsip */}
                <button
                  className="btn btn-outline btn-sm"
                  type="button"
                  onClick={archiveReportJson}
                  disabled={loading || allActivities.length === 0}
                >
                  Arsipkan Laporan (JSON)
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  type="button"
                  onClick={archiveReportPdf}
                  disabled={loading || allActivities.length === 0}
                >
                  Arsipkan Laporan (PDF)
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                * Export berjalan di browser (download file). Tidak butuh akses
                Firebase tambahan.
              </p>
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
                Breakdown status per kategori.
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center text-sm py-6">
                      Memuat...
                    </td>
                  </tr>
                ) : byJenis.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-sm text-gray-500 py-6"
                    >
                      Belum ada data aktivitas
                    </td>
                  </tr>
                ) : (
                  byJenis.map((row, idx) => (
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
                  ))
                )}
              </tbody>

              {!loading && byJenis.length > 0 ? (
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
              ) : null}
            </table>
          </div>
        </div>
      </div>

      {/* ================= TABLE: TOP DOSEN ================= */}
      <div className="card bg-white shadow">
        <div className="card-body">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Top Dosen
          </h2>
          <p className="text-xs text-gray-500">
            Ranking berdasarkan SKS approved (utama), lalu total aktivitas.
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
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center text-sm py-6">
                      Memuat...
                    </td>
                  </tr>
                ) : topDosen.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-sm text-gray-500 py-6"
                    >
                      Belum ada data dosen
                    </td>
                  </tr>
                ) : (
                  topDosen.map((d, idx) => (
                    <tr key={idx}>
                      <td className="font-medium text-center">{d.name}</td>
                      <td>{d.total}</td>
                      <td className="text-success font-semibold">
                        {d.approved}
                      </td>
                      <td className="font-semibold">{d.sksApproved}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Data dihitung otomatis dari collection <b>activities</b>.
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
