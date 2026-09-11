import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import koremLogo from '../../assets/korem-logo.svg';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    height: '64px',
    width: 'auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  iconLeft: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-secondary)',
    opacity: 0.7,
  },
  input: {
    width: '100%',
    height: '52px',
    padding: '0 16px 0 48px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#f8fafc',
    fontSize: '16px',
    color: 'var(--text-primary)',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s',
  },
  iconRight: {
    position: 'absolute',
    right: '16px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--danger-color)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  submitBtn: {
    width: '100%',
    height: '52px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #7C3AED 0%, #E10078 100%)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '16px',
    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
    transition: 'all 0.2s ease',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  }
};

const AdminLogin = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const authFn = login || signIn;
      const { error: loginError } = await authFn(email, password);
      
      if (loginError) {
        setError(loginError.message || 'Invalid email or password.');
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err?.message || 'An unexpected error occurred. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <LanguageSwitcher />
      </div>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <img src={koremLogo} alt="KOREM Logo" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
        </div>
        
        <h1 style={styles.title}>{t('login')}</h1>
        
        {error && (
          <div style={styles.errorAlert}>
            {error}
          </div>
        )}
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="admin-email">Email</label>
            <div style={styles.inputWrapper}>
              <span style={styles.iconLeft}><Mail size={20} /></span>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={styles.input}
                disabled={loading}
                required
              />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="admin-password">Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.iconLeft}><Lock size={20} /></span>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.input}
                disabled={loading}
                required
              />
              <button 
                type="button" 
                style={styles.iconRight} 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
