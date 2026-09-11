import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen = true, onClose, title, children, actions, className = '' }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (isOpen === false) return null;

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '1rem'
  };

  const modalStyles = {
    backgroundColor: 'var(--korem-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-lg, 0.5rem)',
    boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04))',
    width: '100%',
    maxWidth: '28rem',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    transform: 'scale(1)',
    animation: 'modalScaleIn 0.2s ease-out',
    overflow: 'hidden'
  };

  const headerStyles = {
    padding: '1.25rem',
    borderBottom: '1px solid var(--gray-200, #E5E7EB)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const titleStyles = {
    margin: 0,
    fontSize: 'var(--font-size-lg, 1.125rem)',
    fontWeight: 'var(--font-weight-semibold, 600)',
    color: 'var(--gray-900, #111827)'
  };

  const closeButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--gray-500, #6B7280)',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--border-radius-sm, 0.25rem)'
  };

  const contentStyles = {
    padding: '1.25rem',
    overflowY: 'auto'
  };

  const actionsStyles = {
    padding: '1.25rem',
    borderTop: '1px solid var(--gray-200, #E5E7EB)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem'
  };

  return (
    <div style={overlayStyles} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div 
        ref={modalRef} 
        style={modalStyles} 
        className={className} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerStyles}>
          {title && <h2 id="modal-title" style={titleStyles}>{title}</h2>}
          <button style={closeButtonStyles} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div style={contentStyles}>
          {children}
        </div>
        {actions && (
          <div style={actionsStyles}>
            {actions}
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes modalScaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
