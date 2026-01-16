import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createActivity } from "@/services/activity.service";
import { useAuth } from "@/hooks/useAuth";

import { Input } from "../../components/Input";
import { FileUpload } from "../../components/FileUpload";
import { Button } from "../../components/Button";
import { ACTIVITY_TYPES } from "../../utils/constants";

const ActivityForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ SOURCE OF TRUTH

  const [values, setValues] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    sks: "",
    year: "",
  });


  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("File wajib diupload");
      return;
    }

    setLoading(true);
    try {
      await createActivity({
        title: values.title,
        description: values.description,
        category: values.category,
        date: values.date,
        sks: Number(values.sks),
        year: Number(values.year),
        file,
        dosen: user,
      });

      navigate("/dosen/activities");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Tambah Aktivitas Baru
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
            required
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
            value={values.category}
            onChange={handleChange("category")}
            required
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
            required
          />

          <Input
            label="SKS"
            type="number"
            value={values.sks}
            onChange={handleChange("sks")}
            required
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
