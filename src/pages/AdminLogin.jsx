// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PrimaryButton } from "../components/PrimaryButton";
import { TextInput } from "../components/Input";
import "./AdminLogin.css";

// Hard‑coded admin credentials (prototype only)
const ADMIN_CRED = {
  email: "admin@example.com",
  password: "admin123",
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === ADMIN_CRED.email && password === ADMIN_CRED.password) {
      auth.login();
      navigate(from, { replace: true });
    } else {
      setError("Email atau Password salah!");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "420px" }}>
      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "2.5rem" }}>⚡</span>
          <h2 style={{ margin: "0.5rem 0 0 0", color: "#111827" }}>Admin Login</h2>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Youth Community Attendance</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-col">
          <TextInput
            label="Email Admin"
            placeholder="admin@example.com"
            value={email}
            onChange={setEmail}
          />
          <div style={{ marginTop: "0.75rem" }}>
            <label className="label" style={{ fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>Password Admin</label>
            <input
              type="password"
              className="input"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error mt-2" style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</p>}

          <div style={{ marginTop: "1.25rem" }}>
            <PrimaryButton type="submit">
              Masuk Portal Admin
            </PrimaryButton>
          </div>

          <div style={{ marginTop: "1rem", background: "#f3f4f6", padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem", color: "#4b5563" }}>
            <strong>Demo Admin Account:</strong><br />
            Email: <code>admin@example.com</code><br />
            Password: <code>admin123</code>
          </div>
        </form>
      </div>
    </div>
  );
}
