import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

const ErrorState = ({ title = 'Something went wrong', description, onRetry }) => {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    textAlign: 'center'
  };

  const iconContainerStyles = {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    backgroundColor: 'var(--color-danger-light, #FFF1F2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    color: 'var(--color-danger, #F43F5E)'
  };

  const titleStyles = {
    fontSize: 'var(--font-size-lg, 1.125rem)',
    fontWeight: 'var(--font-weight-semibold, 600)',
    color: 'var(--gray-900, #111827)',
    margin: '0 0 0.5rem 0'
  };

  const descStyles = {
    fontSize: 'var(--font-size-sm, 0.875rem)',
    color: 'var(--gray-500, #6B7280)',
    margin: '0 0 1.5rem 0',
    maxWidth: '24rem'
  };

  return (
    <div style={containerStyles}>
      <div style={iconContainerStyles}>
        <AlertCircle size={32} />
      </div>
      <h3 style={titleStyles}>{title}</h3>
      {description && <p style={descStyles}>{description}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
