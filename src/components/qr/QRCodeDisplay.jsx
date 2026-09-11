import { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';

/**
 * QR Code display component
 * @param {Object} props
 * @param {string} props.value - URL or text to encode
 * @param {number} props.size - QR code size in pixels (default 300)
 * @param {string} props.sessionName - Session name to display
 * @param {string} props.date - Date to display
 * @param {string} props.time - Time to display
 */
export default function QRCodeDisplay({ value, size = 300, sessionName, date, time }) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: {
        dark: '#12131A',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    }).catch(err => {
      console.error('QR generation error:', err);
      setError('Failed to generate QR code');
    });
  }, [value, size]);

  if (error) {
    return (
      <div style={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.qrContainer}>
        <canvas ref={canvasRef} style={styles.canvas} />
      </div>
      {!value && (
        <p style={styles.placeholder}>Select a session to generate QR code</p>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  qrContainer: {
    background: 'var(--korem-white)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-md)',
    display: 'inline-flex',
  },
  canvas: {
    borderRadius: '4px',
  },
  placeholder: {
    color: 'var(--text-tertiary)',
    fontSize: 'var(--font-size-sm)',
  },
  error: {
    color: 'var(--color-danger)',
    padding: '16px',
    textAlign: 'center',
  },
};
