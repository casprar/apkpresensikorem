import React from 'react';
import { Check } from 'lucide-react';

const SuccessState = ({ title, description, children }) => {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    textAlign: 'center'
  };

  const iconContainerStyles = {
    width: '5rem',
    height: '5rem',
    borderRadius: '50%',
    backgroundColor: 'var(--color-success-light, #D1FAE5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    color: 'var(--color-success, #10B981)',
    animation: 'successPop 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  const titleStyles = {
    fontSize: 'var(--font-size-xl, 1.25rem)',
    fontWeight: 'var(--font-weight-bold, 700)',
    color: 'var(--gray-900, #111827)',
    margin: '0 0 0.5rem 0'
  };

  const descStyles = {
    fontSize: 'var(--font-size-base, 1rem)',
    color: 'var(--gray-600, #4B5563)',
    margin: '0 0 2rem 0',
    maxWidth: '24rem'
  };

  return (
    <div style={containerStyles}>
      <div style={iconContainerStyles}>
        <Check size={40} strokeWidth={3} />
      </div>
      <h3 style={titleStyles}>{title}</h3>
      {description && <p style={descStyles}>{description}</p>}
      {children}
      <style>
        {`
          @keyframes successPop {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default SuccessState;
