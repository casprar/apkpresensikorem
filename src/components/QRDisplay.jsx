// src/components/QRDisplay.jsx
import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

export const QRDisplay = ({ url, size = 256 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, { width: size, margin: 1 }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [url, size]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "attendance_qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="qr-container text-center mt-4">
      <canvas ref={canvasRef} />
      <div className="mt-2">
        <button className="primary-btn" onClick={download} type="button">
          Download QR Code
        </button>
      </div>
    </div>
  );
};
