import React from "react";

const variantClass = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  danger: "btn btn-danger",
  ghost: "btn btn-ghost",
};

export const Button = ({ children, variant = "primary", ...props }) => {
  return (
    <button
      className={variantClass[variant] || variantClass.primary}
      {...props}
    >
      {children}
    </button>
  );
};
