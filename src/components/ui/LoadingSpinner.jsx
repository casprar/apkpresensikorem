import React from 'react';

const LoadingSpinner = ({ size = 'md', message }) => {
  const sizes = {
    sm: '24px',
    md: '40px',
    lg: '64px'
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '2rem'
  };

  const spinnerStyles = {
    width: sizes[size],
    height: sizes[size],
    border: '4px solid var(--color-primary-light, #EDE9FE)',
    borderTopColor: 'var(--color-primary, #7C3AED)',
    borderRadius: '50%',
    animation: 'spinnerSpin 1s linear infinite'
  };

  const messageStyles = {
    color: 'var(--gray-600, #4B5563)',
    fontSize: 'var(--font-size-sm, 0.875rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    margin: 0
  };

  return (
    <div style={containerStyles}>
      <div style={spinnerStyles} aria-label="Loading" />
      {message && <p style={messageStyles}>{message}</p>}
      <style>
        {`
          @keyframes spinnerSpin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
