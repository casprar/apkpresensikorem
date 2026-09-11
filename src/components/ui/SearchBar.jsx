import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, onChange]);

  const containerStyles = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  };

  const inputStyles = {
    width: '100%',
    minHeight: '44px',
    padding: '0.5rem 2.5rem 0.5rem 2.5rem',
    borderRadius: 'var(--border-radius-full, 9999px)',
    border: '1px solid var(--gray-300, #D1D5DB)',
    outline: 'none',
    backgroundColor: 'var(--gray-50, #F9FAFB)',
    color: 'var(--gray-900, #111827)',
    transition: 'border-color var(--transition-fast, 0.15s) ease',
    boxSizing: 'border-box'
  };

  const searchIconStyles = {
    position: 'absolute',
    left: '0.75rem',
    color: 'var(--gray-400, #9CA3AF)',
    pointerEvents: 'none'
  };

  const clearButtonStyles = {
    position: 'absolute',
    right: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--gray-400, #9CA3AF)',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px' // Touch target
  };

  return (
    <div style={containerStyles} className={className}>
      <Search size={20} style={searchIconStyles} />
      <input
        type="text"
        style={inputStyles}
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button 
          style={clearButtonStyles} 
          onClick={() => { setLocalValue(''); onChange(''); }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
