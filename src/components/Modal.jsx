import React from "react";
import { Button } from "./Button";

export const Modal = ({ open, title, children, onClose, footer }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        )}

        {/* Body */}
        <div className="mt-3">{children}</div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          {footer || (
            <Button variant="ghost" onClick={onClose}>
              Tutup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
