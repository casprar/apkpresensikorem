import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} color="var(--color-success, #10B981)" />;
      case 'error': return <AlertCircle size={20} color="var(--color-danger, #F43F5E)" />;
      case 'warning': return <AlertTriangle size={20} color="var(--color-warning, #FF6B00)" />;
      case 'info':
      default: return <Info size={20} color="var(--korem-blue, #2563EB)" />;
    }
  };

  const toastStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'var(--korem-white, #FFFFFF)',
    padding: '1rem',
    borderRadius: 'var(--border-radius-md, 0.375rem)',
    boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05))',
    borderLeft: `4px solid ${
      type === 'success' ? 'var(--color-success, #10B981)' :
      type === 'error' ? 'var(--color-danger, #F43F5E)' :
      type === 'warning' ? 'var(--color-warning, #FF6B00)' :
      'var(--korem-blue, #2563EB)'
    }`,
    minWidth: '300px',
    pointerEvents: 'auto',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    transition: 'all 0.3s ease-in-out',
  };

  const messageStyles = {
    flex: 1,
    fontSize: 'var(--font-size-sm, 0.875rem)',
    color: 'var(--gray-800, #1F2937)',
    margin: 0
  };

  const closeButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--gray-400, #9CA3AF)',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div style={toastStyles} role="alert">
      {getIcon()}
      <p style={messageStyles}>{message}</p>
      <button style={closeButtonStyles} onClick={handleClose} aria-label="Close toast">
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts }) => {
  const containerStyles = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyles}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default Toast;
