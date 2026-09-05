// src/pages/AdminAttendance.jsx
import React, { useEffect, useState } from "react";
import MockRepo from "../repositories/MockAttendanceRepository";
import { DataTable } from "../components/DataTable";
import { TextInput } from "../components/Input";
import { Select } from "../components/Select";
import { PrimaryButton } from "../components/PrimaryButton";
import AdminHeader from "../components/AdminHeader";
import "./AdminAttendance.css";

export default function AdminAttendance() {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterSession, setFilterSession] = useState("");
  const [data, setData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Load sessions for filter dropdown
  const sessions = MockRepo.listSessions();

  const loadData = () => {
    const filters = {
      search: search.trim() || undefined,
      class: filterClass || undefined,
      gender: filterGender || undefined,
      date: filterDate || undefined,
      sessionId: filterSession || undefined,
    };
    let result = MockRepo.listAttendance(filters);
    // Sort by newest first (descending timestamp)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setData(result);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 2 seconds so admin sees newly scanned attendance live!
    const interval = setInterval(() => {
      loadData();
    }, 2000);
    return () => clearInterval(interval);
  }, [search, filterClass, filterGender, filterDate, filterSession]);

  const columns = [
    { header: "Nama Lengkap", accessor: "name" },
    { header: "Kelas / Angkatan", accessor: "class" },
    { header: "Gender", accessor: "gender" },
    { header: "Waktu Masuk", accessor: "createdAt" },
    { header: "Sesi ID", accessor: "sessionId" },
  ];

  return (
    <div>
      <AdminHeader />
      <div className="container mt-4" style={{ maxWidth: "1000px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>📋 Data Presensi Pemuda (Live)</h2>
            <p style={{ margin: "0.25rem 0 0 0", color: "#6b7280", fontSize: "0.9rem" }}>
              Total Presensi: <strong>{data.length} Orang</strong> | Terakhir diperbarui: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span className="live-badge">
              <span className="pulse-dot" /> Auto-Sync Active (2s)
            </span>
            <button
              onClick={loadData}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                background: "#ffffff",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              🔄 Refresh Manual
            </button>
          </div>
        </div>

        <div className="filters">
          <h3 style={{ fontSize: "1rem", marginTop: 0, marginBottom: "0.75rem", color: "#374151" }}>🔍 Filter Data</h3>
          <div className="filters-grid">
            <TextInput
              label="Cari Nama"
              placeholder="Ketik nama..."
              value={search}
              onChange={setSearch}
            />
            <TextInput
              label="Cari Kelas"
              placeholder="Ketik kelas..."
              value={filterClass}
              onChange={setFilterClass}
            />
            <Select
              label="Jenis Kelamin"
              options={["Male", "Female"]}
              value={filterGender}
              onChange={setFilterGender}
              placeholder="Semua Gender"
            />
            <Select
              label="Sesi"
              options={sessions.map((s) => s.id)}
              value={filterSession}
              onChange={setFilterSession}
              placeholder="Semua Sesi"
            />
          </div>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
