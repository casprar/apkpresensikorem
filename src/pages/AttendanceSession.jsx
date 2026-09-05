// src/pages/AttendanceSession.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MockRepo from "../repositories/MockAttendanceRepository";
import { PrimaryButton } from "../components/PrimaryButton";
import { useLocale } from "../context/LocaleContext";
import "./AttendanceSession.css";

export default function AttendanceSession() {
  const { sessionId } = useParams();
  const { t } = useLocale();
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, open, closed, notfound
  const [form, setForm] = useState({ name: "", class: "", gender: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const s = MockRepo.getSession(sessionId);
    if (!s) {
      setStatus("notfound");
    } else if (s.status === "CLOSED") {
      setStatus("closed");
    } else {
      setSession(s);
      setStatus("open");
    }
  }, [sessionId]);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = t("error_name");
    if (!form.class.trim()) err.class = t("error_class");
    if (!form.gender) err.gender = t("error_gender");
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = MockRepo.addAttendance({
      sessionId,
      name: form.name.trim(),
      className: form.class.trim(),
      gender: form.gender,
    });
    if (result.duplicate) {
      setSuccess({ duplicate: true, record: result.record });
    } else {
      setSuccess({ duplicate: false, record: result.record });
    }
    setSubmitting(false);
  };

  if (status === "loading") return <div className="container mt-4 text-center">Loading…</div>;

  if (status === "notfound")
    return (
      <div className="container mt-4 text-center">
        <h1>{t("session_not_found")}</h1>
        <p>{t("session_not_found_msg")}</p>
      </div>
    );

  if (status === "closed")
    return (
      <div className="container mt-4 text-center">
        <h1>🔒 {t("attendance_closed")}</h1>
        <p>
          {t("closed_msg", { date: session.date, time: session.endTime })}
        </p>
      </div>
    );

  if (success) {
    const { record, duplicate } = success;
    return (
      <div className="container mt-4 text-center">
        {duplicate ? (
          <>
            <h1 style={{ color: "#d97706" }}>⚠️ {t("attendance_already_recorded")}</h1>
            <p style={{ color: "#4b5563" }}>Anda sudah melakukan presensi pada sesi ini.</p>
          </>
        ) : (
          <>
            <h1 style={{ color: "#059669" }}>✅ {t("attendance_recorded")}</h1>
            <p style={{ color: "#1f2937", fontSize: "1.1rem" }}>{t("thank_you", { name: record.name })}</p>
          </>
        )}
        <div className="success-message mt-3">
          <p><strong>Tanggal:</strong> {session.date}</p>
          <p><strong>Waktu:</strong> {new Date(record.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
          <p><strong>Nama:</strong> {record.name}</p>
          <p><strong>Kelas:</strong> {record.class}</p>
          <p><strong>Gender:</strong> {record.gender === "Male" ? t("male") : t("female")}</p>
        </div>
        <div className="mt-4">
          <PrimaryButton onClick={() => { setSuccess(null); setForm({ name: "", class: "", gender: "" }); }}>
            {t("done")} / Input Lagi
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <h1 className="text-center mb-3">{t("title")}</h1>
      <div className="session-info text-center mb-4" style={{ background: "#ffffff", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: "1.1rem", margin: "0 0 0.25rem 0", color: "#374151" }}>{session.name}</h2>
        <p style={{ margin: "0.25rem 0", color: "#6b7280", fontSize: "0.9rem" }}>{session.date} | {session.startTime} – {session.endTime}</p>
        <div style={{ marginTop: "0.5rem" }}>
          <span className="live-badge">
            <span className="pulse-dot" /> {t("attendance_open")}
          </span>
        </div>
      </div>

      <div className="attendance-form">
        <label>
          <span className="label" style={{ fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>{t("full_name")}</span>
          <input
            type="text"
            placeholder={t("enter_name_placeholder")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
          {errors.name && <p className="error" style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem" }}>{errors.name}</p>}
        </label>

        <label style={{ marginTop: "0.75rem" }}>
          <span className="label" style={{ fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>{t("class")}</span>
          <input
            type="text"
            placeholder={t("enter_class_placeholder")}
            value={form.class}
            onChange={(e) => setForm({ ...form, class: e.target.value })}
            className="input"
          />
          {errors.class && <p className="error" style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem" }}>{errors.class}</p>}
        </label>

        <div style={{ marginTop: "0.75rem" }}>
          <span className="label" style={{ fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>{t("gender")}</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: form.gender === "Male" ? "2px solid #6366f1" : "1px solid #d1d5db",
                background: form.gender === "Male" ? "#eef2ff" : "#ffffff",
                color: form.gender === "Male" ? "#4f46e5" : "#374151",
                fontWeight: 600,
                cursor: "pointer"
              }}
              onClick={() => setForm({ ...form, gender: "Male" })}
            >
              {t("male")}
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: form.gender === "Female" ? "2px solid #ec4899" : "1px solid #d1d5db",
                background: form.gender === "Female" ? "#fdf2f8" : "#ffffff",
                color: form.gender === "Female" ? "#db2777" : "#374151",
                fontWeight: 600,
                cursor: "pointer"
              }}
              onClick={() => setForm({ ...form, gender: "Female" })}
            >
              {t("female")}
            </button>
          </div>
          {errors.gender && <p className="error" style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "0.25rem" }}>{errors.gender}</p>}
        </div>

        <div style={{ marginTop: "1.25rem" }}>
          <PrimaryButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("recording_attendance") : t("submit_attendance")}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
