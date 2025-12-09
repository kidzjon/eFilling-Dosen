import React from "react";

export const FileUpload = ({ label, onChange, error }) => {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    onChange && onChange(file || null);
  };

  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <input type="file" onChange={handleChange} />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};
