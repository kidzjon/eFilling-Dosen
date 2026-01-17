export const validateActivity = (values) => {
  const errors = {};
  if (!values.title) errors.title = "Judul wajib diisi";
  if (!values.category) errors.category = "Jenis aktivitas wajib diisi";
  if (!values.date) errors.date = "Tanggal wajib diisi";
  if (!values.sks) errors.sks = "SKS wajib diisi";
  return errors;
};
