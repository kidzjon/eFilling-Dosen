import React from "react";

export const Input = ({ label, error, as = "input", ...props }) => {
  const Component = as;
  const baseClass =
    as === "textarea"
      ? "form-textarea"
      : props.type === "select"
      ? "form-select"
      : "form-input";

  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <Component className={baseClass} {...props} />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};
