// src/pages/AdminSessions.jsx
import React, { useEffect, useState } from "react";
import MockRepo from "../repositories/MockAttendanceRepository";
import { PrimaryButton } from "../components/PrimaryButton";
import { TextInput } from "../components/Input";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import "./AdminSessions.css";

export default function AdminSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  // Form state for creating a new session
  const [name, setName] = useState("Youth Community Meeting");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("20:30");

  useEffect(() => {
    setSessions(MockRepo.listSessions());
  }, []);

  const attendeeCount = (sessionId) => {
    return MockRepo.listAttendance({ sessionId }).length;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newSession = MockRepo.createSession({ name, date, startTime, endTime });
    setSessions([...sessions, newSession]);
    navigate(`/admin/qr?sessionId=${newSession.id}`);
  };

  return (
    <div>
      <AdminHeader />
      <div className="container mt-4" style={{ maxWidth: "900px" }}>
        <h2 className="mb-3">📅 Kelola Sesi Presensi Pemuda</h2>

        {/* Session list */}
        <div className="grid">
          {sessions.map((s) => (
            <div key={s.id} className="card">
              <h3 style={{ fontSize: "1rem", color: "#111827", margin: "0 0 0.25rem 0" }}>{s.name}</h3>
              <p style={{ fontSize: "0.9rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>
                📅 {s.date} | 🕒 {s.startTime} – {s.endTime}
              </p>
              <p style={{ fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>
                Status: {s.status === "OPEN" ? <span style={{ color: "#16a34a", fontWeight: 700 }}>🟢 OPEN</span> : <span style={{ color: "#dc2626", fontWeight: 700 }}>🔴 CLOSED</span>}
              </p>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 1rem 0" }}>
                👥 {attendeeCount(s.id)} Peserta
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <PrimaryButton onClick={() => navigate(`/admin/qr?sessionId=${s.id}`)}>
                  📱 Tampilkan QR Code
                </PrimaryButton>
              </div>
            </div>
          ))}
        </div>

        {/* Create new session */}
        <div style={{ marginTop: "2.5rem", background: "#ffffff", padding: "1.5rem", borderRadius: "0.75rem", border: "1px solid #e5e7eb" }}>
          <h3 style={{ margin: "0 0 1rem 0" }}>➕ Buat Sesi Presensi Baru</h3>
          <form onSubmit={handleCreate} className="flex-col">
            <TextInput label="Nama Sesi" placeholder="Youth Community Meeting" value={name} onChange={setName} />
            <TextInput label="Tanggal (YYYY-MM-DD)" placeholder="2026-09-05" value={date} onChange={setDate} />
            <TextInput label="Jam Mulai" placeholder="18:00" value={startTime} onChange={setStartTime} />
            <TextInput label="Jam Selesai" placeholder="20:30" value={endTime} onChange={setEndTime} />
            <div style={{ marginTop: "1rem" }}>
              <PrimaryButton type="submit">Buat Sesi & Generasi QR Code</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
