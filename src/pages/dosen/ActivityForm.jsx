import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { activityApi } from "../../api/activityApi";
import { ACTIVITY_TYPES } from "../../utils/constants";
import { validateActivity } from "../../utils/validators";
import { Input } from "../../components/Input";
import { FileUpload } from "../../components/FileUpload";
import { Button } from "../../components/Button";

const ActivityForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

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

  const handleChange = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

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

      if (isEdit) {
        await activityApi.update(id, payload);
      } else {
        await activityApi.create(payload);
      }

      navigate("/dosen/activities");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Edit Aktivitas" : "Tambah Aktivitas"}
        </h1>
        <p className="text-sm text-gray-600">
          Isi data aktivitas dan upload bukti kegiatan.
        </p>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul"
            value={values.title}
            onChange={handleChange("title")}
            error={errors.title}
          />

          <Input
            label="Deskripsi"
            as="textarea"
            rows={3}
            value={values.description}
            onChange={handleChange("description")}
          />

          {/* Jenis Aktivitas */}
          <Input
            label="Jenis Aktivitas"
            as="select"
            value={values.type}
            onChange={handleChange("type")}
            error={errors.type}
          >
            <option value="">Pilih jenis...</option>
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Input>

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

          <FileUpload
            label="Upload Bukti (PDF / Gambar)"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={setFile}
          />

          {/* ================= ACTIONS ================= */}
          <div className="flex gap-2 pt-2">
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
    </div>
  );
};

export default ActivityForm;
