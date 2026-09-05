// src/components/PrimaryButton.jsx
import React from "react";
import "./PrimaryButton.css"; // optional styling file

export const PrimaryButton = ({ children, onClick, disabled, className = "" }) => {
  return (
    <button
      className={`primary-button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
