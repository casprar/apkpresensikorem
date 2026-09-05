// src/components/Input.jsx
import React from "react";

export const TextInput = ({ label, placeholder, value, onChange, error }) => (
  <label className="mt-2">
    <span className="label">{label}</span>
    <input
      type="text"
      className="input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="error">{error}</p>}
  </label>
);
