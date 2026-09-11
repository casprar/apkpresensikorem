import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--color-primary, #7C3AED)', trend, className = '' }) => {
  const cardStyles = {
    backgroundColor: 'var(--korem-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-lg, 0.5rem)',
    boxShadow: 'var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxSizing: 'border-box',
    border: '1px solid var(--gray-100, #F3F4F6)'
  };

  const iconContainerStyles = {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color,
    color: 'var(--korem-white, #FFFFFF)',
    opacity: 0.9
  };

  const contentStyles = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  };

  const titleStyles = {
    fontSize: 'var(--font-size-sm, 0.875rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    color: 'var(--gray-500, #6B7280)',
    margin: '0 0 0.25rem 0'
  };

  const valueStyles = {
    fontSize: 'var(--font-size-2xl, 1.5rem)',
    fontWeight: 'var(--font-weight-bold, 700)',
    color: 'var(--gray-900, #111827)',
    margin: 0
  };

  const trendStyles = {
    fontSize: 'var(--font-size-xs, 0.75rem)',
    fontWeight: 'var(--font-weight-medium, 500)',
    color: trend?.isPositive ? 'var(--color-success, #10B981)' : 'var(--color-danger, #F43F5E)',
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  };

  return (
    <div style={cardStyles} className={className}>
      {Icon && (
        <div style={iconContainerStyles}>
          {React.isValidElement(Icon) ? Icon : <Icon size={24} />}
        </div>
      )}
      <div style={contentStyles}>
        <h4 style={titleStyles}>{title}</h4>
        <p style={valueStyles}>{value}</p>
        {trend && (
          <span style={trendStyles}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
