import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionForAttendance } from '../../services/sessionService';
import { submitAttendance } from '../../services/attendanceService';
import { validateAttendanceForm } from '../../utils/validation';
import { formatDate, formatTime, formatTimestampToJakarta } from '../../utils/date';
import { SUBMISSION_STATUS, CLASS_OPTIONS } from '../../constants/classOptions';
import MobileLayout from '../../layouts/MobileLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatusIndicator from '../../components/ui/StatusIndicator';
import { CheckCircle, AlertTriangle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const styles = {
  container: {
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    minHeight: '100%',
  },
  header: {
    marginBottom: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#ffffff',
    fontSize: '16px',
    color: 'var(--text-primary)',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#ffffff',
    fontSize: '16px',
    color: 'var(--text-primary)',
    boxSizing: 'border-box',
    outline: 'none',
    appearance: 'none',
  },
  genderContainer: {
    display: 'flex',
    gap: '12px',
  },
  genderBtn: {
    flex: 1,
    height: '48px',
    borderRadius: '24px',
    border: '1px solid var(--border-color)',
    backgroundColor: '#ffffff',
    fontSize: '16px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  genderBtnActive: {
    flex: 1,
    height: '48px',
    borderRadius: '24px',
    border: 'none',
    backgroundColor: 'var(--primary-color)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'var(--danger-color)',
    fontSize: '12px',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  submitBtn: {
    width: '100%',
    height: '52px',
    borderRadius: '14px',
    backgroundColor: 'var(--primary-color)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '12px',
    transition: 'opacity 0.2s',
  },
  submitBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  viewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center',
    minHeight: '60vh',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  iconSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#22c55e',
  },
  iconWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: '#f59e0b',
  },
  iconClosed: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    color: '#6b7280',
  },
  iconError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
  },
  viewTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '12px',
  },
  viewText: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  detailsBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    width: '100%',
    marginBottom: '32px',
    textAlign: 'left',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  detailLabel: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  detailValue: {
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '14px',
  },
  actionBtn: {
    width: '100%',
    height: '52px',
    borderRadius: '14px',
    backgroundColor: 'var(--primary-color)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutline: {
    width: '100%',
    height: '52px',
    borderRadius: '14px',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '16px',
    fontWeight: '600',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

const AttendanceSession = () => {
  const { sessionId } = useParams();
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [view, setView] = useState('loading'); // loading, form, success, duplicate, closed, not-found, error
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', className: '', gender: '' });
  const [errors, setErrors] = useState({});
  const [attendeeInfo, setAttendeeInfo] = useState(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const data = await getSessionForAttendance(sessionId);
        
        if (!data) {
          setView('not-found');
        } else if (data.status === 'CLOSED' || data.session_status === 'CLOSED') {
          setSession(data);
          setView('closed');
        } else {
          setSession(data);
          setView('form');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setView('not-found');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
    if (errors.gender) {
      setErrors(prev => ({ ...prev, gender: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client side validation
    const validation = validateAttendanceForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitAttendance(sessionId, formData.name, formData.className, formData.gender);
      
      switch (result.status) {
        case SUBMISSION_STATUS.SUCCESS:
          setAttendeeInfo({
            firstName: formData.name.split(' ')[0],
            grade: formData.className,
            timestamp: new Date()
          });
          setView('success');
          break;
        case SUBMISSION_STATUS.DUPLICATE:
          setView('duplicate');
          break;
        case SUBMISSION_STATUS.SESSION_CLOSED:
          setView('closed');
          break;
        case SUBMISSION_STATUS.SESSION_NOT_FOUND:
          setView('not-found');
          break;
        default:
          setSubmitError(result.message || 'An error occurred while submitting attendance.');
          break;
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Failed to record attendance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', className: '', gender: '' });
    setErrors({});
    setView('form');
  };

  if (loading) {
    return (
      <MobileLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <LoadingSpinner size="lg" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div style={styles.container}>
        
        {view === 'form' && session && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>{session.name}</h1>
              <p style={styles.subtitle}>{formatDate(session.date)} {session.start_time ? `• ${formatTime(session.start_time)}` : ''}</p>
            </div>
            
            <div style={styles.card}>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="attendee-name">{t('fullNameLabel')}</label>
                  <input
                    id="attendee-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('fullNamePlaceholder')}
                    style={{
                      ...styles.input,
                      borderColor: errors.name ? 'var(--danger-color)' : 'var(--border-color)'
                    }}
                    disabled={submitting}
                  />
                  {errors.name && <span style={styles.errorText}><AlertCircle size={14} /> {errors.name}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="attendee-class">{t('classLabel')}</label>
                  <select
                    id="attendee-class"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    style={{
                      ...styles.select,
                      borderColor: errors.className ? 'var(--danger-color)' : 'var(--border-color)'
                    }}
                    disabled={submitting}
                  >
                    <option value="" disabled>{t('selectClass')}</option>
                    {CLASS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{t(opt) || opt}</option>
                    ))}
                  </select>
                  {errors.className && <span style={styles.errorText}><AlertCircle size={14} /> {errors.className}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('genderLabel')}</label>
                  <div style={styles.genderContainer}>
                    <button
                      type="button"
                      onClick={() => handleGenderSelect('MALE')}
                      style={formData.gender === 'MALE' ? styles.genderBtnActive : styles.genderBtn}
                      disabled={submitting}
                    >
                      {t('male')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenderSelect('FEMALE')}
                      style={formData.gender === 'FEMALE' ? styles.genderBtnActive : styles.genderBtn}
                      disabled={submitting}
                    >
                      {t('female')}
                    </button>
                  </div>
                  {errors.gender && <span style={styles.errorText}><AlertCircle size={14} /> {errors.gender}</span>}
                </div>

                {submitError && (
                  <div style={{...styles.errorText, marginBottom: '16px', fontSize: '14px', padding: '8px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px'}}>
                    <AlertCircle size={16} /> {submitError}
                  </div>
                )}

                <button 
                  type="submit" 
                  style={{
                    ...styles.submitBtn,
                    ...(submitting ? styles.submitBtnDisabled : {})
                  }}
                  disabled={submitting}
                >
                  {submitting ? t('submitting') : t('submitAttendance')}
                </button>
              </form>
            </div>
          </>
        )}

        {view === 'success' && attendeeInfo && (
          <div style={styles.viewContainer}>
            <div style={{...styles.iconWrapper, ...styles.iconSuccess}}>
              <CheckCircle size={40} />
            </div>
            <h2 style={styles.viewTitle}>{t('successTitle')}</h2>
            <p style={styles.viewText}>{t('successMessage')}</p>
            
            <div style={styles.detailsBox}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>{t('sessionName')}</span>
                <span style={styles.detailValue}>{session?.name}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>{t('date')}</span>
                <span style={styles.detailValue}>{session ? formatDate(session.date) : ''}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Waktu</span>
                <span style={styles.detailValue}>{formatTimestampToJakarta(attendeeInfo.timestamp)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>{t('classLabel')}</span>
                <span style={styles.detailValue}>{t(attendeeInfo.grade) || attendeeInfo.grade}</span>
              </div>
            </div>
            
            <button onClick={resetForm} style={styles.actionBtn}>
              Done
            </button>
          </div>
        )}

        {view === 'duplicate' && (
          <div style={styles.viewContainer}>
            <div style={{...styles.iconWrapper, ...styles.iconWarning}}>
              <AlertTriangle size={40} />
            </div>
            <h2 style={styles.viewTitle}>Attendance Already Recorded</h2>
            <p style={styles.viewText}>It looks like this name has already been recorded for this session.</p>
            
            <button onClick={() => setView('form')} style={styles.actionBtnOutline}>
              Back
            </button>
          </div>
        )}

        {view === 'closed' && (
          <div style={styles.viewContainer}>
            <div style={{...styles.iconWrapper, ...styles.iconClosed}}>
              <Clock size={40} />
            </div>
            <h2 style={styles.viewTitle}>Attendance Closed</h2>
            <p style={styles.viewText}>Attendance for this session is no longer available.<br/><br/>Thank you!</p>
          </div>
        )}

        {view === 'not-found' && (
          <div style={styles.viewContainer}>
            <div style={{...styles.iconWrapper, ...styles.iconError}}>
              <AlertCircle size={40} />
            </div>
            <h2 style={styles.viewTitle}>Session Not Found</h2>
            <p style={styles.viewText}>This attendance session doesn't exist or the QR code may no longer be valid.</p>
          </div>
        )}

      </div>
    </MobileLayout>
  );
};

export default AttendanceSession;
