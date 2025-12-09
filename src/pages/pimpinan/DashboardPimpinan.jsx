import React from "react";

const DashboardPimpinan = () => {
  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Ringkasan Pimpinan</div>
          <div className="page-description">
            Tampilan singkat capaian aktivitas dosen. (Dummy UI – bisa
            disambungkan ke API statistik nanti.)
          </div>
        </div>
      </div>

      <div className="cards-grid">
        <div className="card">
          <div>Total Aktivitas</div>
          <h2>24</h2>
        </div>
        <div className="card">
          <div>Disetujui</div>
          <h2>18</h2>
        </div>
        <div className="card">
          <div>Pending</div>
          <h2>4</h2>
        </div>
        <div className="card">
          <div>Ditolak</div>
          <h2>2</h2>
        </div>
      </div>
    </>
  );
};

export default DashboardPimpinan;
