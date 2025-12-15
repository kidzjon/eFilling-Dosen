import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

const ValidationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    activityApi.getById(id).then(setActivity);
  }, [id]);

  const handleApprove = async () => {
    await activityApi.setStatus(id, "approved");
    navigate("/admin/validation");
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      alert("Catatan penolakan wajib diisi");
      return;
    }
    await activityApi.setStatus(id, "rejected", notes);
    navigate("/admin/validation");
  };

  if (!activity) {
    return <div className="text-sm text-gray-500">Memuat...</div>;
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Review Aktivitas
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
        </div>

        <div>
          <p className="font-medium text-sm mb-1">Deskripsi</p>
          <p className="text-sm text-gray-700">{activity.description || "-"}</p>
        </div>

        {/* ================= NOTES ================= */}
        <Input
          label="Catatan (wajib jika ditolak)"
          as="textarea"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* ================= ACTIONS ================= */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleApprove}>Approve</Button>
          <Button variant="danger" onClick={handleReject}>
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValidationDetail;
