import React, { useEffect, useState } from "react";
import { activityApi } from "../../api/activityApi";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    activityApi.getPendingForAdmin().then((list) => {
      setPendingCount(list.length);
    });
  }, []);

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Dashboard Admin</div>
          <div className="page-description">
            Kelola dan validasi aktivitas dosen.
          </div>
        </div>
        <Button onClick={() => navigate("/admin/validation")}>
          Lihat Antrian Validasi
        </Button>
      </div>

      <div className="card" style={{ maxWidth: 300 }}>
        <div>Antrian Pending</div>
        <h2>{pendingCount}</h2>
      </div>
    </>
  );
};

export default DashboardAdmin;
