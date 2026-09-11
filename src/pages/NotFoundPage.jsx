import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  errorCode: {
    fontSize: '120px',
    fontWeight: '800',
    color: 'var(--primary-color)',
    lineHeight: '1',
    margin: '0 0 16px 0',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '16px',
  },
  description: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    marginBottom: '32px',
    maxWidth: '400px',
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    backgroundColor: 'var(--primary-color)',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'opacity 0.2s',
  }
};

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.description}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={styles.link}>
        Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
