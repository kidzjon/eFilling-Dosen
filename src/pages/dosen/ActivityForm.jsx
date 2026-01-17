import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { activityApi } from "@/api/activityApi";
import { useAuth } from "@/hooks/useAuth";

import { Input } from "../../components/Input";
import { FileUpload } from "../../components/FileUpload";
import { Button } from "../../components/Button";
import { ACTIVITY_TYPES } from "../../utils/constants";
import { validateActivity } from "../../utils/validators";

const ActivityForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);

  const { user } = useAuth();

  const [values, setValues] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    sks: "",
    year: "",
  });

  const [file, setFile] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

  // load data saat edit
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!isEdit) return;
      try {
        const data = await activityApi.getById(id);

        // attachment standar + fallback legacy
        const att =
          data?.attachment ||
          (data?.file?.downloadUrl
            ? {
                name: data.file.name || "File",
                url: data.file.downloadUrl,
                size: data.file.size,
                contentType: data.file.contentType,
                path: data.file.path,
              }
            : null);

        if (!mounted) return;

        setExistingAttachment(att);

        setValues({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          date: data.date || "",
          sks: data.sks ?? "",
          year:
            data.year ?? (data.date ? new Date(data.date).getFullYear() : ""),
        });
      } catch (e) {
        alert(e.message || "Gagal memuat data");
        navigate("/dosen/activities");
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vErrors = validateActivity({
      title: values.title,
      category: values.category,
      date: values.date,
      sks: values.sks,
    });
    setErrors(vErrors);
    if (Object.keys(vErrors).length > 0) return;

    // create wajib file, edit optional file (kalau gak ganti)
    if (!isEdit && !file) {
      alert("File wajib diupload");
      return;
    }

    setLoading(true);
    try {
      const payloadData = {
        title: values.title,
        description: values.description || "",
        category: values.category,
        date: values.date,
        sks: Number(values.sks) || 0,
        year: values.year ? Number(values.year) : undefined,
        dosenName: user?.name || "Dosen",
      };

      if (!isEdit) {
        await activityApi.createActivity({
          data: payloadData,
          file,
        });
      } else {
        await activityApi.updateActivity({
          id,
          data: payloadData,
          file: file || null,
        });
      }

      navigate("/dosen/activities");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Edit Aktivitas" : "Tambah Aktivitas Baru"}
        </h1>
        <p className="text-sm text-gray-600">
          {isEdit
            ? "Perbarui data. Setelah simpan, status akan kembali menjadi pending."
            : "Isi data aktivitas dan upload bukti kegiatan."}
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul"
            value={values.title}
            onChange={handleChange("title")}
            error={errors.title}
            required
          />

          <Input
            label="Deskripsi"
            as="textarea"
            rows={3}
            value={values.description}
            onChange={handleChange("description")}
          />

          <Input
            label="Jenis Aktivitas"
            as="select"
            value={values.category}
            onChange={handleChange("category")}
            error={errors.category}
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
            error={errors.date}
            required
          />

          <Input
            label="SKS"
            type="number"
            value={values.sks}
            onChange={handleChange("sks")}
            error={errors.sks}
            required
          />

          <Input
            label="Tahun"
            type="number"
            value={values.year}
            onChange={handleChange("year")}
            helperText="Boleh kosong, akan diambil dari tanggal."
          />

          {isEdit && existingAttachment?.url ? (
            <div className="text-sm">
              <p className="font-medium text-gray-700">File saat ini:</p>
              <a
                className="text-primary underline"
                href={existingAttachment.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {existingAttachment.name || "Lihat File"}
              </a>
              <p className="text-xs text-gray-500 mt-1">
                Jika ingin mengganti file, upload file baru di bawah.
              </p>
            </div>
          ) : null}

          <FileUpload
            label={
              isEdit ? "Upload File Baru (opsional)" : "Upload Bukti (wajib)"
            }
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={setFile}
            helperText="PDF/JPG/PNG maks 10MB"
          />

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Menyimpan..."
                : isEdit
                ? "Simpan & Ajukan Ulang"
                : "Simpan & Ajukan"}
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
