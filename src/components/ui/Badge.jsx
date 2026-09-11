import React from 'react';

const Badge = ({ variant = 'default', children, className = '', ...props }) => {
  const variants = {
    success: {
      backgroundColor: 'var(--color-success-light, #D1FAE5)',
      color: 'var(--color-success, #10B981)',
    },
    warning: {
      backgroundColor: 'var(--color-warning-light, #FFF7ED)',
      color: 'var(--color-warning, #FF6B00)',
    },
    danger: {
      backgroundColor: 'var(--color-danger-light, #FFF1F2)',
      color: 'var(--color-danger, #F43F5E)',
    },
    info: {
      backgroundColor: 'var(--gray-100, #F3F4F6)',
      color: 'var(--korem-blue, #2563EB)',
    },
    default: {
      backgroundColor: 'var(--gray-100, #F3F4F6)',
      color: 'var(--gray-700, #374151)',
    }
  };

  const badgeStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.625rem',
    borderRadius: '9999px',
    fontSize: 'var(--font-size-xs, 0.75rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    ...variants[variant]
  };

  return (
    <span style={badgeStyles} className={className} {...props}>
      {children}
    </span>
  );
};

export default Badge;
