import React from "react";

export const Table = ({ columns, data = [], renderActions }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full border-collapse">
        {/* ===== TABLE HEADER ===== */}
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
              >
                {c.label}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Aksi
              </th>
            )}
          </tr>
        </thead>

        {/* ===== TABLE BODY ===== */}
        <tbody className="divide-y">
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          )}

          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-sm text-gray-700">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}

              {renderActions && (
                <td className="px-4 py-3 text-sm">{renderActions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
