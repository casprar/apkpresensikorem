import React from 'react';

const Card = ({ title, children, className = '', ...props }) => {
  const cardStyles = {
    backgroundColor: 'var(--korem-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-lg, 0.5rem)',
    boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))',
    padding: '1.5rem',
    width: '100%',
    boxSizing: 'border-box'
  };

  const titleStyles = {
    margin: '0 0 1rem 0',
    fontSize: 'var(--font-size-xl, 1.25rem)',
    fontWeight: 'var(--font-weight-semibold, 600)',
    color: 'var(--gray-900, #111827)'
  };

  return (
    <div style={cardStyles} className={className} {...props}>
      {title && <h3 style={titleStyles}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
