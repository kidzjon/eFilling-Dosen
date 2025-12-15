import React from "react";

export const Input = ({
  label,
  error,
  as = "input",
  children,
  className = "",
  ...props
}) => {
  const Component = as;

  const baseClass =
    as === "textarea"
      ? "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      : as === "select"
      ? "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      : "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Component className={`${baseClass} ${className}`} {...props}>
        {children}
      </Component>

      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
};
