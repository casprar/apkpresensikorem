// src/components/AdminHeader.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminHeader.css";

export default function AdminHeader() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-brand">
          <span className="admin-logo">⚡</span>
          <span className="admin-title">Admin Attendance</span>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-link">📊 Dashboard</Link>
          <Link to="/admin/attendance" className="admin-link">📋 Data Presensi (Live)</Link>
          <Link to="/admin/sessions" className="admin-link">📅 Sesi Presensi</Link>
          <Link to="/admin/qr?sessionId=session-1" className="admin-link">📱 QR Code</Link>
          <button onClick={handleLogout} className="admin-logout-btn">Keluar</button>
        </nav>
      </div>
    </header>
  );
}
