import React from 'react';
import Button from './Button';

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    textAlign: 'center',
    backgroundColor: 'var(--korem-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-lg, 0.5rem)',
    border: '1px dashed var(--gray-300, #D1D5DB)'
  };

  const iconContainerStyles = {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    backgroundColor: 'var(--gray-100, #F3F4F6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    color: 'var(--gray-400, #9CA3AF)'
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
      {Icon && (
        <div style={iconContainerStyles}>
          {React.isValidElement(Icon) ? Icon : <Icon size={32} />}
        </div>
      )}
      <h3 style={titleStyles}>{title}</h3>
      <p style={descStyles}>{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;
