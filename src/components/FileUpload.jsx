import React from "react";

export const FileUpload = ({ label, onChange, error, accept, helperText }) => {
  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    onChange && onChange(file);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="
            block w-full text-sm text-gray-600
            file:mr-4 file:rounded-lg file:border-0
            file:bg-primary file:px-4 file:py-2
            file:text-sm file:font-medium file:text-white
            hover:file:bg-blue-700
            focus:outline-none
          "
        />
      </div>

      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};
