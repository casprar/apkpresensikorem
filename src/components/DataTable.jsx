// src/components/DataTable.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { PrimaryButton } from "./PrimaryButton";

export const DataTable = ({ columns, data, onSort }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (col) => {
    const direction =
      sortConfig.key === col.accessor && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: col.accessor, direction });
    if (onSort) onSort(col.accessor, direction);
  };

  const exportFile = (type) => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diexport.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const fname = `presensi_${new Date().toISOString().split("T")[0]}`;
    if (type === "csv") {
      XLSX.writeFile(wb, `${fname}.csv`);
    } else {
      XLSX.writeFile(wb, `${fname}.xlsx`);
    }
  };

  return (
    <div className="data-table" style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #e5e7eb" }}>
      <div className="export-buttons flex" style={{ gap: "0.5rem", marginBottom: "1rem" }}>
        <PrimaryButton onClick={() => exportFile("csv")}>📥 Export CSV</PrimaryButton>
        <PrimaryButton onClick={() => exportFile("excel")}>📥 Export Excel</PrimaryButton>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc", textAlign: "left" }}>
            {columns.map((col) => (
              <th
                key={col.accessor}
                onClick={() => handleSort(col)}
                style={{ cursor: "pointer", padding: "0.75rem", borderBottom: "2px solid #e2e8f0", fontSize: "0.85rem", color: "#475569" }}
              >
                {col.header}
                {sortConfig.key === col.accessor && (
                  <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                📜 Belum ada data presensi yang masuk.<br />
                <small style={{ color: "#cbd5e1" }}>Silakan isi form presensi dari sisi guest / scan QR untuk menambahkan data real.</small>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                {columns.map((col) => (
                  <td key={col.accessor} style={{ padding: "0.75rem", fontSize: "0.9rem" }}>
                    {row[col.accessor] instanceof Date
                      ? row[col.accessor].toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "medium" })
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
