import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

const ValidationDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

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

  if (!activity) return <div>Memuat...</div>;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Review Aktivitas</div>
          <div className="page-description">{activity.title}</div>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        <p>
          <b>Jenis:</b> {activity.type}
        </p>
        <p>
          <b>Tanggal:</b> {formatDate(activity.date)}
        </p>
        <p>
          <b>SKS:</b> {activity.sks}
        </p>
        <p>
          <b>Deskripsi:</b>
        </p>
        <p>{activity.description || "-"}</p>

        <Input
          label="Catatan (wajib jika ditolak)"
          as="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
          <Button variant="success" onClick={handleApprove}>
            Approve
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Reject
          </Button>
        </div>
      </div>
    </>
  );
};

export default ValidationDetail;
