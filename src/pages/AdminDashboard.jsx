// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MockRepo from "../repositories/MockAttendanceRepository";
import AdminHeader from "../components/AdminHeader";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, session: null, recent: [] });

  useEffect(() => {
    const loadStats = () => {
      const total = MockRepo.countToday();
      const male = MockRepo.countByGender("Male");
      const female = MockRepo.countByGender("Female");
      const activeSession = MockRepo.listSessions().find((s) => s.status === "OPEN");
      const allAttendance = MockRepo.listAttendance();
      allAttendance.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setStats({ total, male, female, session: activeSession, recent: allAttendance.slice(0, 5) });
    };

    loadStats();
    const interval = setInterval(loadStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <AdminHeader />
      <div className="container mt-4" style={{ maxWidth: "1000px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2>📊 Ringkasan Dashboard Admin</h2>
          <Link to="/admin/attendance" style={{ padding: "0.5rem 1rem", background: "#4f46e5", color: "#fff", textDecoration: "none", borderRadius: "0.5rem", fontWeight: 600 }}>
            Lihat Semua Data (Live) →
          </Link>
        </div>

        <div className="grid">
          <div className="card">
            <h3>TOTAL PRESENSI HARI INI</h3>
            <p style={{ color: "#4f46e5" }}>{stats.total} Orang</p>
          </div>
          <div className="card">
            <h3>LAKI-LAKI</h3>
            <p style={{ color: "#2563eb" }}>{stats.male} Orang</p>
          </div>
          <div className="card">
            <h3>PEREMPUAN</h3>
            <p style={{ color: "#db2777" }}>{stats.female} Orang</p>
          </div>
          <div className="card">
            <h3>STATUS SESI AKTIF</h3>
            <p style={{ fontSize: "1.2rem", color: stats.session ? "#16a34a" : "#dc2626" }}>
              {stats.session ? `🟢 OPEN (${stats.session.id})` : `🔴 CLOSED`}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "2rem", background: "#ffffff", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid #e5e7eb" }}>
          <h3 style={{ marginTop: 0, fontSize: "1.1rem", marginBottom: "1rem" }}>⚡ Data Presensi Terbaru (Live Feed)</h3>
          {stats.recent.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Belum ada data presensi yang masuk.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                  <th style={{ padding: "0.5rem" }}>Waktu</th>
                  <th style={{ padding: "0.5rem" }}>Nama</th>
                  <th style={{ padding: "0.5rem" }}>Kelas</th>
                  <th style={{ padding: "0.5rem" }}>Gender</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.5rem", fontSize: "0.9rem", color: "#4f46e5", fontWeight: 600 }}>
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td style={{ padding: "0.5rem", fontWeight: 600 }}>{item.name}</td>
                    <td style={{ padding: "0.5rem" }}>{item.class}</td>
                    <td style={{ padding: "0.5rem" }}>{item.gender === "Male" ? "Laki-laki" : "Perempuan"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
