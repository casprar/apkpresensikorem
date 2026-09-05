// src/pages/AdminQR.jsx
import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { QRDisplay } from "../components/QRDisplay";
import AdminHeader from "../components/AdminHeader";
import "./AdminQR.css";

export default function AdminQR() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId") || "session-1";

  const qrUrl = `${window.location.origin}/attendance/session/${sessionId}`;

  return (
    <div>
      <AdminHeader />
      <div className="container mt-4 text-center" style={{ maxWidth: "600px" }}>
        <h2>📱 Kode QR Presensi Acara</h2>
        <p style={{ color: "#6b7280" }}>
          Tampilkan Kode QR ini di layar / TV gereja agar peserta pemuda dapat memindai langsung menggunakan HP.
        </p>

        <div className="qr-card mt-3">
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#374151" }}>Sesi: {sessionId}</h3>
          <QRDisplay url={qrUrl} size={260} />
          
          <div className="qr-link-box mt-3">
            <span style={{ color: "#6b7280", fontSize: "0.8rem", display: "block" }}>URL Presensi Peserta:</span>
            <a href={qrUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#4f46e5", fontWeight: 600 }}>
              {qrUrl}
            </a>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.75rem 1.25rem",
                background: "#4f46e5",
                color: "#ffffff",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              🚀 Buka Form Presensi (Uji Coba Guest)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
