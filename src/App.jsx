// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import AttendanceSession from "./pages/AttendanceSession";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAttendance from "./pages/AdminAttendance";
import AdminSessions from "./pages/AdminSessions";
import AdminQR from "./pages/AdminQR";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public attendee check-in page */}
        <Route path="/attendance/session/:sessionId" element={<AttendanceSession />} />

        {/* Public Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <RequireAuth>
              <AdminAttendance />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/sessions"
          element={
            <RequireAuth>
              <AdminSessions />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/qr"
          element={
            <RequireAuth>
              <AdminQR />
            </RequireAuth>
          }
        />

        {/* Root landing page */}
        <Route
          path="/"
          element={
            <div className="container mt-4 text-center">
              <h1>Youth Community Attendance</h1>
              <p style={{ color: "#4b5563" }}>Pilih menu untuk melanjutkan prototype:</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
                <Link
                  to="/attendance/session/session-1"
                  style={{
                    padding: "1rem",
                    background: "#4f46e5",
                    color: "#ffffff",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "1.1rem"
                  }}
                >
                  📱 Halaman Presensi Peserta (Guest Scan)
                </Link>

                <Link
                  to="/admin/login"
                  style={{
                    padding: "1rem",
                    background: "#1e293b",
                    color: "#ffffff",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "1.1rem"
                  }}
                >
                  ⚡ Portal Admin (Cek Data Real-time & QR)
                </Link>
              </div>
            </div>
          }
        />

        {/* Catch-all redirect to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
