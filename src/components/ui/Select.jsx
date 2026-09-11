import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  error,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    width: '100%',
    position: 'relative'
  };

  const labelStyles = {
    fontSize: 'var(--font-size-sm, 0.875rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    color: error ? 'var(--color-danger, #F43F5E)' : 'var(--gray-700, #374151)',
  };

  const selectWrapperStyles = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  };

  const selectStyles = {
    width: '100%',
    minHeight: '44px',
    padding: '0.5rem 2.5rem 0.5rem 1rem',
    borderRadius: 'var(--border-radius-md, 0.375rem)',
    border: `1px solid ${error ? 'var(--color-danger, #F43F5E)' : focused ? 'var(--color-primary, #7C3AED)' : 'var(--gray-300, #D1D5DB)'}`,
    outline: 'none',
    backgroundColor: disabled ? 'var(--gray-100, #F3F4F6)' : 'var(--korem-white, #FFFFFF)',
    color: 'var(--gray-900, #111827)',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'border-color var(--transition-fast, 0.15s) ease',
    boxSizing: 'border-box'
  };

  const iconStyles = {
    position: 'absolute',
    right: '0.75rem',
    color: 'var(--gray-400, #9CA3AF)',
    pointerEvents: 'none'
  };

  const errorStyles = {
    fontSize: 'var(--font-size-xs, 0.75rem)',
    color: 'var(--color-danger, #F43F5E)',
    marginTop: '0.25rem'
  };

  return (
    <div style={containerStyles} className={className}>
      {label && <label style={labelStyles}>{label}</label>}
      <div style={selectWrapperStyles}>
        <select
          style={selectStyles}
          disabled={disabled}
          onFocus={(e) => {
            setFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={20} style={iconStyles} />
      </div>
      {error && <span style={errorStyles}>{error}</span>}
    </div>
  );
};

export default Select;
