import React from "react";

const baseClass =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantClass = {
  primary: "bg-primary text-white hover:bg-blue-700 focus:ring-primary",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  danger: "bg-danger text-white hover:bg-red-600 focus:ring-danger",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
};

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${baseClass} ${
        variantClass[variant] || variantClass.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
