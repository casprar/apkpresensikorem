import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionForAttendance } from '../../services/sessionService';
import { submitAttendance } from '../../services/attendanceService';
import { validateAttendanceForm } from '../../utils/validation';
import { formatDate, formatTime, formatTimestampToJakarta } from '../../utils/date';
import { SUBMISSION_STATUS, CLASS_OPTIONS } from '../../constants/classOptions';
import MobileLayout from '../../layouts/MobileLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { CheckCircle, AlertTriangle, Clock, AlertCircle, User, GraduationCap, Sparkles, Heart, Check, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const styles = {
  container: {
    padding: '8px 4px 24px 4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    minHeight: '100%',
  },
  sessionBanner: {
    background: 'linear-gradient(135deg, #7C3AED 0%, #E10078 100%)',
    borderRadius: '20px',
    padding: '20px 24px',
    color: '#FFFFFF',
    boxShadow: '0 12px 24px -6px rgba(124, 58, 237, 0.35)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    position: 'relative',
    overflow: 'hidden',
  },
  sessionBannerTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    width: 'fit-content',
    marginBottom: '2px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: '1.25',
    margin: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    margin: 0,
    fontWeight: '500',
  },
  journeySteps: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '10px 16px',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
  },
  journeyStepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
  },
  journeyStepActive: {
    color: '#7C3AED',
  },
  stepBadge: {
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    color: '#7C3AED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '24px 20px',
    boxShadow: '0 12px 32px -8px rgba(124, 58, 237, 0.08), 0 4px 12px rgba(0, 0, 0, 0.02)',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#1E1B4B',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: '#9CA3AF',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    height: '52px',
    padding: '0 16px 0 46px',
    borderRadius: '14px',
    border: '1.5px solid #E5E7EB',
    backgroundColor: '#FAF9FE',
    fontSize: '15px',
    fontWeight: '500',
    color: '#1E1B4B',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  select: {
    width: '100%',
    height: '52px',
    padding: '0 16px 0 46px',
    borderRadius: '14px',
    border: '1.5px solid #E5E7EB',
    backgroundColor: '#FAF9FE',
    fontSize: '15px',
    fontWeight: '500',
    color: '#1E1B4B',
    boxSizing: 'border-box',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  genderContainer: {
    display: 'flex',
    gap: '12px',
  },
  genderBtn: {
    flex: 1,
    height: '52px',
    borderRadius: '16px',
    border: '1.5px solid #E5E7EB',
    backgroundColor: '#FAF9FE',
    fontSize: '15px',
    fontWeight: '600',
    color: '#4B5563',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  genderBtnMaleActive: {
    flex: 1,
    height: '52px',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: '#7C3AED',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 8px 18px -4px rgba(124, 58, 237, 0.4)',
    transform: 'translateY(-1px)',
  },
  genderBtnFemaleActive: {
    flex: 1,
    height: '52px',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: '#E10078',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 8px 18px -4px rgba(225, 0, 120, 0.4)',
    transform: 'translateY(-1px)',
  },
  errorText: {
    color: '#EF4444',
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  submitBtn: {
    width: '100%',
    height: '54px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #7C3AED 0%, #E10078 100%)',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '8px',
    boxShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.35)',
    transition: 'all 0.25s ease',
  },
  submitBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  viewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    boxShadow: '0 12px 32px -8px rgba(124, 58, 237, 0.1)',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  },
  iconWrapper: {
    width: '84px',
    height: '84px',
    borderRadius: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  iconSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    color: '#10B981',
    boxShadow: '0 10px 24px -4px rgba(16, 185, 129, 0.25)',
  },
  iconWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    color: '#F59E0B',
  },
  iconClosed: {
    backgroundColor: 'rgba(107, 114, 128, 0.12)',
    color: '#6B7280',
  },
  iconError: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: '#EF4444',
  },
  viewTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#1E1B4B',
    marginBottom: '8px',
  },
  viewText: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '24px',
    lineHeight: '1.5',
    fontWeight: '500',
  },
  detailsBox: {
    backgroundColor: '#FAF8FC',
    borderRadius: '16px',
    padding: '20px',
    width: '100%',
    marginBottom: '24px',
    textAlign: 'left',
    border: '1px solid rgba(124, 58, 237, 0.08)',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px dashed #E5E7EB',
  },
  detailRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '8px',
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: '13px',
    fontWeight: '500',
  },
  detailValue: {
    color: '#1E1B4B',
    fontWeight: '700',
    fontSize: '14px',
  },
  actionBtn: {
    width: '100%',
    height: '52px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #7C3AED 0%, #E10078 100%)',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.3)',
  },
  actionBtnOutline: {
    width: '100%',
    height: '52px',
    borderRadius: '16px',
    backgroundColor: 'transparent',
    color: '#4B5563',
    fontSize: '15px',
    fontWeight: '600',
    border: '1.5px solid #E5E7EB',
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
  const [view, setView] = useState('loading');
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
            firstName: formData.name.trim().split(' ')[0],
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
        case SUBMISSION_STATUS.INVALID_CLASS:
          setSubmitError('Pilihan kelas tidak valid. Silakan pilih kelas 7 - 12.');
          break;
        case SUBMISSION_STATUS.INVALID_GENDER:
          setSubmitError('Pilihan jenis kelamin tidak valid.');
          break;
        case SUBMISSION_STATUS.INVALID_NAME:
          setSubmitError('Nama lengkap minimal 2 karakter.');
          break;
        default:
          setSubmitError(result.message || 'Gagal menyimpan presensi. Silakan coba lagi.');
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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
          <LoadingSpinner size="lg" message="Membuka presensi KOREM..." />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div style={styles.container}>
        
        {view === 'form' && session && (
          <>
            {/* Session Header Card */}
            <div style={styles.sessionBanner} className="korem-card-entrance">
              <div style={styles.sessionBannerTag}>
                <Calendar size={12} /> Sesi Hari Ini
              </div>
              <h1 style={styles.title}>{session.name}</h1>
              <p style={styles.subtitle}>
                <Clock size={13} /> {formatDate(session.date)} {session.start_time ? `• ${formatTime(session.start_time)}` : ''}
              </p>
            </div>

            {/* Friendly Short Journey Step Indicators */}
            <div style={styles.journeySteps} className="korem-card-entrance">
              <div style={{ ...styles.journeyStepItem, ...(formData.name.trim().length >= 2 ? styles.journeyStepActive : {}) }}>
                <span style={styles.stepBadge}>{formData.name.trim().length >= 2 ? <Check size={12} /> : '1'}</span>
                Nama
              </div>
              <div style={{ ...styles.journeyStepItem, ...(formData.className ? styles.journeyStepActive : {}) }}>
                <span style={styles.stepBadge}>{formData.className ? <Check size={12} /> : '2'}</span>
                Kelas
              </div>
              <div style={{ ...styles.journeyStepItem, ...(formData.gender ? styles.journeyStepActive : {}) }}>
                <span style={styles.stepBadge}>{formData.gender ? <Check size={12} /> : '3'}</span>
                Gender
              </div>
            </div>
            
            {/* Form Card */}
            <div style={styles.card} className="korem-card-entrance korem-glow-card">
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="attendee-name">
                    <User size={15} style={{ color: '#7C3AED' }} /> {t('fullNameLabel')}
                  </label>
                  <div style={styles.inputWrapper}>
                    <User size={18} style={styles.inputIcon} />
                    <input
                      id="attendee-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('fullNamePlaceholder')}
                      style={{
                        ...styles.input,
                        borderColor: errors.name ? '#EF4444' : formData.name ? '#7C3AED' : '#E5E7EB'
                      }}
                      disabled={submitting}
                    />
                  </div>
                  {errors.name && <span style={styles.errorText}><AlertCircle size={14} /> {errors.name}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="attendee-class">
                    <GraduationCap size={16} style={{ color: '#7C3AED' }} /> {t('classLabel')}
                  </label>
                  <div style={styles.inputWrapper}>
                    <GraduationCap size={18} style={styles.inputIcon} />
                    <select
                      id="attendee-class"
                      name="className"
                      value={formData.className}
                      onChange={handleInputChange}
                      style={{
                        ...styles.select,
                        borderColor: errors.className ? '#EF4444' : formData.className ? '#7C3AED' : '#E5E7EB'
                      }}
                      disabled={submitting}
                    >
                      <option value="" disabled>{t('selectClass')}</option>
                      {CLASS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{t(opt) || opt}</option>
                      ))}
                    </select>
                  </div>
                  {errors.className && <span style={styles.errorText}><AlertCircle size={14} /> {errors.className}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Sparkles size={15} style={{ color: '#E10078' }} /> {t('genderLabel')}
                  </label>
                  <div style={styles.genderContainer}>
                    <button
                      type="button"
                      onClick={() => handleGenderSelect('MALE')}
                      style={formData.gender === 'MALE' ? styles.genderBtnMaleActive : styles.genderBtn}
                      disabled={submitting}
                    >
                      {t('male')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenderSelect('FEMALE')}
                      style={formData.gender === 'FEMALE' ? styles.genderBtnFemaleActive : styles.genderBtn}
                      disabled={submitting}
                    >
                      {t('female')}
                    </button>
                  </div>
                  {errors.gender && <span style={styles.errorText}><AlertCircle size={14} /> {errors.gender}</span>}
                </div>

                {submitError && (
                  <div style={{...styles.errorText, marginBottom: '16px', fontSize: '13px', padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)'}}>
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
                  {submitting ? t('submitting') : (
                    <>
                      {t('submitAttendance')} <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Success State */}
        {view === 'success' && attendeeInfo && (
          <div style={styles.viewContainer} className="korem-card-entrance">
            <div style={{...styles.iconWrapper, ...styles.iconSuccess}} className="korem-checkmark-pop">
              <CheckCircle size={44} />
            </div>
            <h2 style={styles.viewTitle}>{t('successTitle')}</h2>
            <p style={styles.viewText}>
              Terima kasih, <strong>{attendeeInfo.firstName}</strong>! 🙏<br/>
              Senang sekali kamu bisa bersekutu bersama KOREM GKI Pamulang hari ini.
            </p>
            
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
                <span style={styles.detailLabel}>Waktu Absen</span>
                <span style={styles.detailValue}>{formatTimestampToJakarta(attendeeInfo.timestamp)}</span>
              </div>
              <div style={styles.detailRowLast}>
                <span style={styles.detailLabel}>{t('classLabel')}</span>
                <span style={styles.detailValue}>{t(attendeeInfo.grade) || attendeeInfo.grade}</span>
              </div>
            </div>
            
            <button onClick={resetForm} style={styles.actionBtn}>
              Selesai <Check size={18} />
            </button>
          </div>
        )}

        {/* Duplicate State */}
        {view === 'duplicate' && (
          <div style={styles.viewContainer} className="korem-card-entrance">
            <div style={{...styles.iconWrapper, ...styles.iconWarning}}>
              <AlertTriangle size={44} />
            </div>
            <h2 style={styles.viewTitle}>{t('duplicateTitle')}</h2>
            <p style={styles.viewText}>{t('duplicateMessage')}</p>
            
            <button onClick={() => setView('form')} style={styles.actionBtnOutline}>
              Kembali ke Form
            </button>
          </div>
        )}

        {/* Closed State */}
        {view === 'closed' && (
          <div style={styles.viewContainer} className="korem-card-entrance">
            <div style={{...styles.iconWrapper, ...styles.iconClosed}}>
              <Clock size={44} />
            </div>
            <h2 style={styles.viewTitle}>{t('closedTitle')}</h2>
            <p style={styles.viewText}>{t('closedMessage')}</p>
          </div>
        )}

        {/* Not Found State */}
        {view === 'not-found' && (
          <div style={styles.viewContainer} className="korem-card-entrance">
            <div style={{...styles.iconWrapper, ...styles.iconError}}>
              <AlertCircle size={44} />
            </div>
            <h2 style={styles.viewTitle}>{t('notFoundTitle')}</h2>
            <p style={styles.viewText}>{t('notFoundMessage')}</p>
          </div>
        )}

      </div>
    </MobileLayout>
  );
};

export default AttendanceSession;
