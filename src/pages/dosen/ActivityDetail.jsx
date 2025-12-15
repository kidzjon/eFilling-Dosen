import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../../components/Button";

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    activityApi
      .getById(id)
      .then(setActivity)
      .catch(() => {
        alert("Data tidak ditemukan");
        navigate("/dosen/activities");
      });
  }, [id, navigate]);

  if (!activity) {
    return <div className="text-sm text-gray-500">Memuat...</div>;
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Detail Aktivitas
          </h1>
          <p className="text-sm text-gray-600">{activity.title}</p>
        </div>

        <Button variant="ghost" onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>

      {/* ================= DETAIL CARD ================= */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <p>
            <span className="font-medium">Jenis:</span> {activity.type}
          </p>
          <p>
            <span className="font-medium">Tanggal:</span>{" "}
            {formatDate(activity.date)}
          </p>
          <p>
            <span className="font-medium">SKS:</span> {activity.sks}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className="capitalize">{activity.status}</span>
          </p>
        </div>

        {/* ================= ADMIN NOTES ================= */}
        {activity.notes && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            <span className="font-medium">Catatan Admin:</span> {activity.notes}
          </div>
        )}

        {/* ================= DESCRIPTION ================= */}
        <div>
          <p className="font-medium text-sm mb-1">Deskripsi</p>
          <p className="text-sm text-gray-700">{activity.description || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
