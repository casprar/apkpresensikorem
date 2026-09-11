import React from 'react';

const GenderToggle = ({ value, onChange, error, className = '' }) => {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    width: '100%',
  };

  const buttonsContainerStyles = {
    display: 'flex',
    gap: '0.5rem',
    width: '100%'
  };

  const getButtonStyles = (isSelected) => ({
    flex: 1,
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    border: isSelected ? '2px solid var(--color-primary, #7C3AED)' : '1px solid var(--gray-300, #D1D5DB)',
    backgroundColor: isSelected ? 'var(--color-primary-light, #EDE9FE)' : 'var(--korem-white, #FFFFFF)',
    color: isSelected ? 'var(--color-primary, #7C3AED)' : 'var(--gray-700, #374151)',
    fontWeight: 'var(--font-weight-medium, 500)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast, 0.15s) ease',
    outline: 'none'
  });

  const errorStyles = {
    fontSize: 'var(--font-size-xs, 0.75rem)',
    color: 'var(--color-danger, #F43F5E)',
    marginTop: '0.25rem'
  };

  return (
    <div style={containerStyles} className={className}>
      <div style={buttonsContainerStyles}>
        <button
          type="button"
          style={getButtonStyles(value === 'MALE')}
          onClick={() => onChange('MALE')}
        >
          Male
        </button>
        <button
          type="button"
          style={getButtonStyles(value === 'FEMALE')}
          onClick={() => onChange('FEMALE')}
        >
          Female
        </button>
      </div>
      {error && <span style={errorStyles}>{error}</span>}
    </div>
  );
};

export default GenderToggle;
