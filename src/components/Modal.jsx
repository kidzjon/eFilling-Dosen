import React from "react";
import { Button } from "./Button";

export const Modal = ({ open, title, children, onClose, footer }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="page-title">{title}</h3>}
        <div style={{ marginTop: "0.5rem" }}>{children}</div>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
          }}
        >
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
