import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { Button } from "../../components/Button";

const DashboardAdmin = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    activityApi.getPendingForAdmin().then((list) => {
      setPendingCount(list.length);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Dashboard Admin
          </h1>
          <p className="text-sm text-gray-600">
            Kelola dan validasi aktivitas dosen.
          </p>
        </div>

        <Button onClick={() => navigate("/admin/validation")}>
          Lihat Antrian Validasi
        </Button>
      </div>

      {/* ================= STATS CARD ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-600">Antrian Pending</p>
          <h2 className="mt-2 text-3xl font-bold text-warning">
            {pendingCount}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
