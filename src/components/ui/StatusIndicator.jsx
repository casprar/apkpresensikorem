import React from 'react';

const StatusIndicator = ({ status, size = 'md', className = '' }) => {
  const isOpen = status === 'OPEN';
  
  const containerStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
  };

  const dotSizes = {
    sm: '6px',
    md: '8px',
    lg: '10px'
  };

  const textSizes = {
    sm: 'var(--font-size-xs, 0.75rem)',
    md: 'var(--font-size-sm, 0.875rem)',
    lg: 'var(--font-size-base, 1rem)'
  };

  const dotStyles = {
    width: dotSizes[size],
    height: dotSizes[size],
    borderRadius: '50%',
    backgroundColor: isOpen ? 'var(--color-success, #10B981)' : 'var(--gray-400, #9CA3AF)',
  };

  const textStyles = {
    fontSize: textSizes[size],
    fontWeight: 'var(--font-weight-medium, 500)',
    color: isOpen ? 'var(--color-success, #10B981)' : 'var(--gray-600, #4B5563)',
    lineHeight: 1
  };

  return (
    <div style={containerStyles} className={className}>
      <div style={dotStyles} aria-hidden="true" />
      <span style={textStyles}>{isOpen ? 'OPEN' : 'CLOSED'}</span>
    </div>
  );
};

export default StatusIndicator;
