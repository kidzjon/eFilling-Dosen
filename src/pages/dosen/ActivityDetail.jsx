import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../../components/Button";

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    activityApi
      .getById(id)
      .then(setActivity)
      .catch(() => {
        alert("Data tidak ditemukan");
        navigate("/dosen/activities");
      });
  }, [id, navigate]);

  if (!activity) return <div>Memuat...</div>;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Detail Aktivitas</div>
          <div className="page-description">{activity.title}</div>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
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
          <b>Status:</b> {activity.status}
        </p>
        {activity.notes && (
          <p style={{ color: "#b91c1c" }}>
            <b>Catatan Admin:</b> {activity.notes}
          </p>
        )}
        <p>
          <b>Deskripsi:</b>
        </p>
        <p>{activity.description || "-"}</p>
      </div>
    </>
  );
};

export default ActivityDetail;
