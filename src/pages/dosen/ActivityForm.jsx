import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import { ACTIVITY_TYPES } from "../../utils/constants";
import { validateActivity } from "../../utils/validators";
import { Input } from "../../components/Input";
import { FileUpload } from "../../components/FileUpload";
import { Button } from "../../components/Button";
import { useSelector } from "react-redux";

const ActivityForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [values, setValues] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
    sks: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      activityApi.getById(id).then((a) => {
        setValues({
          title: a.title,
          description: a.description || "",
          type: a.type,
          date: a.date.slice(0, 10),
          sks: a.sks,
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vErrors = validateActivity(values);
    setErrors(vErrors);
    if (Object.keys(vErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        ...values,
        sks: Number(values.sks),
        submittedBy: user.id,
        date: values.date,
        fileName: file?.name || null,
      };

      if (isEdit) await activityApi.update(id, payload);
      else await activityApi.create(payload);

      navigate("/dosen/activities");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">
            {isEdit ? "Edit Aktivitas" : "Tambah Aktivitas"}
          </div>
          <div className="page-description">
            Isi data aktivitas dan upload bukti kegiatan.
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Judul"
            value={values.title}
            onChange={handleChange("title")}
            error={errors.title}
          />
          <Input
            label="Deskripsi"
            as="textarea"
            value={values.description}
            onChange={handleChange("description")}
          />
          <div className="form-field">
            <label className="form-label">Jenis Aktivitas</label>
            <select
              className="form-select"
              value={values.type}
              onChange={handleChange("type")}
            >
              <option value="">Pilih jenis...</option>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.type && <div className="form-error">{errors.type}</div>}
          </div>
          <Input
            label="Tanggal"
            type="date"
            value={values.date}
            onChange={handleChange("date")}
            error={errors.date}
          />
          <Input
            label="SKS"
            type="number"
            value={values.sks}
            onChange={handleChange("sks")}
            error={errors.sks}
          />
          <FileUpload label="Upload Bukti (PDF/Gambar)" onChange={setFile} />
          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan & Ajukan"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/dosen/activities")}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ActivityForm;
