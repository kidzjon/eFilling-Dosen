import React from "react";

export const Table = ({ columns, data, renderActions }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key}>{c.label}</th>
          ))}
          {renderActions && <th>Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length + (renderActions ? 1 : 0)}>
              Tidak ada data
            </td>
          </tr>
        )}
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((c) => (
              <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
            ))}
            {renderActions && <td>{renderActions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
