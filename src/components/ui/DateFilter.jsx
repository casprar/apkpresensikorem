import React from 'react';
import { X } from 'lucide-react';

const DateFilter = ({ value, onChange, label = 'Date', className = '' }) => {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    width: '100%',
  };

  const labelStyles = {
    fontSize: 'var(--font-size-sm, 0.875rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    color: 'var(--gray-700, #374151)',
  };

  const inputContainerStyles = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  };

  const inputStyles = {
    width: '100%',
    minHeight: '44px',
    padding: '0.5rem 2.5rem 0.5rem 1rem',
    borderRadius: 'var(--border-radius-md, 0.375rem)',
    border: '1px solid var(--gray-300, #D1D5DB)',
    outline: 'none',
    backgroundColor: 'var(--korem-white, #FFFFFF)',
    color: 'var(--gray-900, #111827)',
    boxSizing: 'border-box'
  };

  const clearButtonStyles = {
    position: 'absolute',
    right: '0.25rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--gray-400, #9CA3AF)',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px'
  };

  return (
    <div style={containerStyles} className={className}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={inputContainerStyles}>
        <input
          type="date"
          style={inputStyles}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button 
            style={clearButtonStyles} 
            onClick={() => onChange('')}
            aria-label="Clear date"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateFilter;
