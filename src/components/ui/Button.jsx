import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: 'var(--border-radius-md, 0.375rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    transition: 'all var(--transition-base, 0.2s) ease',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    boxSizing: 'border-box'
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary, #7C3AED)',
      color: 'var(--korem-white, #FFFFFF)',
      boxShadow: 'var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary, #7C3AED)',
      border: '1px solid var(--color-primary, #7C3AED)',
    },
    danger: {
      backgroundColor: 'var(--color-danger, #F43F5E)',
      color: 'var(--korem-white, #FFFFFF)',
      boxShadow: 'var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--gray-700, #374151)',
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 0.75rem', fontSize: 'var(--font-size-sm, 0.875rem)', minHeight: '36px' },
    md: { padding: '0.5rem 1rem', fontSize: 'var(--font-size-base, 1rem)', minHeight: '44px' },
    lg: { padding: '0.75rem 1.5rem', fontSize: 'var(--font-size-lg, 1.125rem)', minHeight: '52px' }
  };

  const styles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size]
  };

  return (
    <button
      type={type}
      style={styles}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 16 : 20} style={{ animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        React.isValidElement(Icon) ? Icon : <Icon size={size === 'sm' ? 16 : 20} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
