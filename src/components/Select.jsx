// src/components/Select.jsx
import React from "react";

export const Select = ({ label, options, value, onChange, error, placeholder }) => (
  <label className="mt-2">
    <span className="label">{label}</span>
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder || "Select"}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="error">{error}</p>}
  </label>
);
