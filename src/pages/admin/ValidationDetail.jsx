import React, { useEffect, useMemo, useState } from "react";
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
    activityApi.getById(id).then((res) => {
      setActivity(res);
      // kalau sudah ada reviewNotes lama, tampilkan sebagai referensi
      setNotes(res?.reviewNotes || "");
    });
  }, [id]);

  const attachment = useMemo(() => {
    if (!activity) return null;
    if (activity.attachment?.url) return activity.attachment;
    if (activity.file?.downloadUrl) {
      return {
        name: activity.file.name || "File",
        url: activity.file.downloadUrl,
        size: activity.file.size,
        contentType: activity.file.contentType,
        path: activity.file.path,
      };
    }
    return null;
  }, [activity]);

  if (!activity) {
    return <div className="text-sm text-gray-500">Memuat...</div>;
  }

  const isFinal = activity.status === "approved";

  const handleApprove = async () => {
    try {
      await activityApi.setStatus(id, "approved", notes || "");
      navigate("/admin/validation");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      alert("Catatan penolakan wajib diisi");
      return;
    }

    try {
      await activityApi.setStatus(id, "rejected", notes);
      navigate("/admin/validation");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="bg-white rounded-xl shadow p-6 max-w-3xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <p>
            <span className="font-medium">Jenis:</span> {activity.category}
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

          {attachment?.url && (
            <div className="mt-3">
              <p className="font-medium text-sm mb-1">Bukti Kegiatan</p>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline text-sm"
              >
                {attachment.name || "Lihat File"}
              </a>
            </div>
          )}
        </div>

        <Input
          label="Catatan (wajib jika ditolak)"
          as="textarea"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex gap-2 pt-2">
          <Button onClick={handleApprove} disabled={isFinal}>
            Approve
          </Button>
          <Button variant="danger" onClick={handleReject} disabled={isFinal}>
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValidationDetail;
