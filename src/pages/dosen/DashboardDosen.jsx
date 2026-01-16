import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { Button } from "../../components/Button";

const DashboardDosen = () => {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const activities = await activityApi.getByDosen();

        console.log("ACTIVITIES FOR DASHBOARD:", activities);

        const result = {
          pending: 0,
          approved: 0,
          rejected: 0,
        };

        activities.forEach((a) => {
          if (a.status === "approved") result.approved++;
          else if (a.status === "rejected") result.rejected++;
          else if (a.status === "pending") result.pending++;
        });

        setStats(result);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);


  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Dashboard Dosen
          </h1>
          <p className="text-sm text-gray-600">
            Ringkasan aktivitas dan status validasi.
          </p>
        </div>

        <Button onClick={() => navigate("/dosen/activities/new")}>
          + Tambah Aktivitas
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Status Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-warning">
            {stats.pending}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Disetujui</p>
          <h2 className="mt-2 text-3xl font-bold text-success">
            {stats.approved}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Ditolak</p>
          <h2 className="mt-2 text-3xl font-bold text-danger">
            {stats.rejected}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardDosen;
