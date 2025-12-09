import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { activityApi } from "../../api/activityApi";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";

const DashboardDosen = () => {
  const user = useSelector((s) => s.auth.user);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    activityApi.getByDosen(user.id).then((res) => {
      const s = { pending: 0, approved: 0, rejected: 0 };
      res.forEach((a) => {
        if (a.status === "pending") s.pending++;
        if (a.status === "approved") s.approved++;
        if (a.status === "rejected") s.rejected++;
      });
      setStats(s);
    });
  }, [user]);

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Dashboard Dosen</div>
          <div className="page-description">
            Ringkasan aktivitas dan status validasi.
          </div>
        </div>
        <Button onClick={() => navigate("/dosen/activities/new")}>
          + Tambah Aktivitas
        </Button>
      </div>

      <div className="cards-grid">
        <div className="card">
          <div>Status Pending</div>
          <h2>{stats.pending}</h2>
        </div>
        <div className="card">
          <div>Disetujui</div>
          <h2>{stats.approved}</h2>
        </div>
        <div className="card">
          <div>Ditolak</div>
          <h2>{stats.rejected}</h2>
        </div>
      </div>
    </>
  );
};

export default DashboardDosen;
