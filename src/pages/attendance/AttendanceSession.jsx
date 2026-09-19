import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionForAttendance } from '../../services/sessionService';
import { submitAttendance } from '../../services/attendanceService';
import { validateAttendanceForm } from '../../utils/validation';
import { formatDate, formatTime, formatTimestampToJakarta } from '../../utils/date';
import { SUBMISSION_STATUS, CLASS_OPTIONS } from '../../constants/classOptions';
import MobileLayout from '../../layouts/MobileLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { CheckCircle, AlertTriangle, Clock, AlertCircle, User, GraduationCap, Heart, Check, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const styles = {
  container: {
    padding: '4px 0 24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  /* ── 1. Bible Verse Devotional Popup Styles ── */
  devotionalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 48, 62, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 999,
  },
  devotionalCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: '20px',
    padding: '28px 24px',
    maxWidth: '380px',
    width: '100%',
    border: '2px solid #E2DCD3',
    boxShadow: '0 12px 32px rgba(44, 48, 62, 0.15)',
    textAlign: 'center',
    position: 'relative',
    backgroundImage: 'radial-gradient(#E2DACD 0.75px, transparent 0.75px)',
    backgroundSize: '16px 16px',
  },
  devotionalTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#EDE8F5',
    color: '#6B5E82',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '16px',
    border: '1px solid #DED6E8',
  },
  devotionalTitle: {
    fontSize: '19px',
    fontWeight: '700',
    color: '#2C303E',
    marginBottom: '14px',
  },
  devotionalQuoteBox: {
    backgroundColor: '#F7F4EE',
    borderRadius: '14px',
    padding: '16px 18px',
    borderLeft: '3px solid #8E83A3',
    marginBottom: '16px',
    textAlign: 'left',
  },
  devotionalQuoteText: {
    fontSize: '15px',
    fontStyle: 'italic',
    color: '#3E4454',
    lineHeight: '1.6',
    margin: '0 0 8px 0',
  },
  devotionalQuoteRef: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#6E7585',
    margin: 0,
    textAlign: 'right',
  },
  devotionalClosing: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#8E83A3',
    marginBottom: '20px',
    fontFamily: "'Lora', Georgia, serif",
  },
  devotionalDismissBtn: {
    width: '100%',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: '#5C7463', // Soft Muted Sage
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    letterSpacing: '0.01em',
  },

  /* ── 5. Session Event Poster Card ── */
  sessionPoster: {
    backgroundColor: '#EDE8F5',
    borderRadius: '16px',
    padding: '20px 22px',
    border: '1.5px solid #DDD6E8',
    boxShadow: '0 2px 8px rgba(44, 48, 62, 0.04)',
    position: 'relative',
    overflow: 'hidden',
  },
  posterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  posterCategory: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#6B5E82',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  posterTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2C303E',
    lineHeight: '1.3',
    margin: '0 0 8px 0',
  },
  posterMeta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#5E6578',
    backgroundColor: '#F7F4FB',
    padding: '5px 12px',
    borderRadius: '8px',
    border: '1px solid #E2DCEB',
  },

  /* ── 6. Form Registration Card ── */
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px 20px',
    border: '1.5px solid #E2DCD3',
    boxShadow: '0 2px 10px rgba(44, 48, 62, 0.04)',
  },
  formHeader: {
    borderBottom: '1px solid #EFEAE1',
    paddingBottom: '14px',
    marginBottom: '20px',
  },
  formHeaderTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2C303E',
    margin: '0 0 2px 0',
  },
  formHeaderSubtitle: {
    fontSize: '12px',
    color: '#767D8F',
    margin: 0,
  },
  formGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#3E4454',
    marginBottom: '8px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#8A91A0',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    height: '48px',
    padding: '0 14px 0 42px',
    borderRadius: '10px',
    border: '1.5px solid #DED6CB',
    backgroundColor: '#FFFDF9',
    fontSize: '15px',
    fontWeight: '500',
    color: '#2C303E',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  select: {
    width: '100%',
    height: '48px',
    padding: '0 14px 0 42px',
    borderRadius: '10px',
    border: '1.5px solid #DED6CB',
    backgroundColor: '#FFFDF9',
    fontSize: '15px',
    fontWeight: '500',
    color: '#2C303E',
    boxSizing: 'border-box',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
  },

  /* ── Gender Muted Pastel Palette ── */
  genderContainer: {
    display: 'flex',
    gap: '10px',
  },
  genderBtn: {
    flex: 1,
    height: '46px',
    borderRadius: '10px',
    border: '1.5px solid #DED6CB',
    backgroundColor: '#F5EFF0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#5E6578',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'transform 0.15s ease, background-color 0.15s ease',
  },
  genderBtnMaleActive: {
    flex: 1,
    height: '46px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#5B7B9A',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transform: 'scale(1.02)',
  },
  genderBtnFemaleActive: {
    flex: 1,
    height: '46px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#C87B8A',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transform: 'scale(1.02)',
  },

  errorText: {
    color: '#C85A5A',
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  /* ── 7. Submit Button ── */
  submitBtn: {
    width: '100%',
    height: '50px',
    borderRadius: '12px',
    backgroundColor: '#C87A68',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
    letterSpacing: '0.01em',
    transition: 'transform 0.15s ease',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  /* ── 8. Successful Attendance Celebration ── */
  viewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 20px',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1.5px solid #E2DCD3',
    boxShadow: '0 2px 10px rgba(44, 48, 62, 0.04)',
  },
  iconWrapper: {
    width: '72px',
    height: '72px',
    borderRadius: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '18px',
  },
  iconSuccess: {
    backgroundColor: '#E8EFEA',
    color: '#4B7258',
    border: '1px solid #C5DACB',
  },
  iconWarning: {
    backgroundColor: '#FBF3E4',
    color: '#B8862A',
    border: '1px solid #EAD8B5',
  },
  iconClosed: {
    backgroundColor: '#EFEAE1',
    color: '#6E7585',
    border: '1px solid #DED7CB',
  },
  iconError: {
    backgroundColor: '#F8ECF0',
    color: '#C85A5A',
    border: '1px solid #E8C5CE',
  },
  viewTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2C303E',
    marginBottom: '8px',
  },
  viewText: {
    fontSize: '14px',
    color: '#5E6578',
    marginBottom: '22px',
    lineHeight: '1.55',
  },
  detailsBox: {
    backgroundColor: '#F9F6F0',
    borderRadius: '12px',
    padding: '18px',
    width: '100%',
    marginBottom: '22px',
    textAlign: 'left',
    border: '1px solid #E4DDD2',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '7px 0',
    borderBottom: '1px dashed #E2DCD3',
  },
  detailRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '7px',
  },
  detailLabel: {
    color: '#6E7585',
    fontSize: '13px',
    fontWeight: '500',
  },
  detailValue: {
    color: '#2C303E',
    fontWeight: '700',
    fontSize: '13px',
  },
  actionBtn: {
    width: '100%',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: '#5C7463',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  actionBtnOutline: {
    width: '100%',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    color: '#2C303E',
    fontSize: '14px',
    fontWeight: '600',
    border: '1.5px solid #DED6CB',
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

  /* Devotional Opening Popup State */
  const [showDevotional, setShowDevotional] = useState(true);
  const [devotionalExiting, setDevotionalExiting] = useState(false);

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

  const dismissDevotional = () => {
    setDevotionalExiting(true);
    setTimeout(() => {
      setShowDevotional(false);
    }, 450);
  };

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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '12px' }}>
          <LoadingSpinner size="lg" message="Membuka bulletin presensi..." />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* ── 1. Bible Verse Opening Popup Card ("Firman Hari Ini") ── */}
      {showDevotional && (
        <div 
          style={styles.devotionalOverlay}
          className={devotionalExiting ? 'animate-dev-exit' : ''}
          onClick={dismissDevotional}
        >
          <div 
            style={styles.devotionalCard} 
            className="animate-dev-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hand-drawn botanical & star SVG motif */}
            <div style={{ position: 'absolute', top: '14px', right: '16px' }} className="animate-star-fade">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L11.8 7.2L17 9L11.8 10.8L10 16L8.2 10.8L3 9L8.2 7.2L10 2Z" fill="#D9AB55" opacity="0.75"/>
              </svg>
            </div>
            
            <div style={{ position: 'absolute', bottom: '16px', left: '16px' }} className="animate-leaf-sway">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C12 21 7 16 7 11C7 8.24 9.24 6 12 6C14.76 6 17 8.24 17 11C17 16 12 21 12 21Z" stroke="#698272" strokeWidth="1.5" opacity="0.6"/>
              </svg>
            </div>

            <div style={styles.devotionalTag}>
              <BookOpen size={12} /> Firman Hari Ini
            </div>
            
            <h3 style={styles.devotionalTitle} className="serif-font">Renungan Remaja</h3>

            <div style={styles.devotionalQuoteBox} className="animate-dev-text">
              <p style={styles.devotionalQuoteText}>
                “Hendaklah kamu saling mengasihi, seperti Aku telah mengasihi kamu.”
              </p>
              <p style={styles.devotionalQuoteRef}>— Yohanes 15:12</p>
            </div>

            <p style={styles.devotionalClosing}>Selamat beribadah ♡</p>

            <button 
              type="button" 
              onClick={dismissDevotional} 
              style={styles.devotionalDismissBtn}
            >
              Masuk ke Presensi <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      <div style={styles.container}>
        
        {view === 'form' && session && (
          <>
            {/* 5. Session Event Poster Card */}
            <div style={styles.sessionPoster} className="animate-entrance-stagger-2">
              <div style={styles.posterHeader}>
                <span style={styles.posterCategory}>Warta Remaja</span>
                <div className="animate-leaf-sway">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3V21M3 12H21" stroke="#8E83A3" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <h2 style={styles.posterTitle} className="serif-font">{session.name}</h2>
              <div style={styles.posterMeta}>
                <Calendar size={13} style={{ color: '#8E83A3' }} />
                <span>{formatDate(session.date)} {session.start_time ? `• ${formatTime(session.start_time)} WIB` : ''}</span>
              </div>
            </div>

            {/* 6. Form Registration Card */}
            <div style={styles.formCard} className="animate-entrance-stagger-3">
              <div style={styles.formHeader}>
                <h3 style={styles.formHeaderTitle} className="serif-font">Formulir Presensi</h3>
                <p style={styles.formHeaderSubtitle}>Silakan lengkapi data presensi kamu di bawah ini</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name Input */}
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="attendee-name">
                    <User size={14} style={{ color: '#5B7B9A' }} /> {t('fullNameLabel')}
                  </label>
                  <div style={styles.inputWrapper}>
                    <User size={16} style={styles.inputIcon} />
                    <input
                      id="attendee-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('fullNamePlaceholder')}
                      style={{
                        ...styles.input,
                        borderColor: errors.name ? '#C85A5A' : '#DED6CB'
                      }}
                      disabled={submitting}
                    />
                  </div>
                  {errors.name && <span style={styles.errorText}><AlertCircle size={13} /> {errors.name}</span>}
                </div>

                {/* Class Select */}
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="attendee-class">
                    <GraduationCap size={15} style={{ color: '#5B7B9A' }} /> {t('classLabel')}
                  </label>
                  <div style={styles.inputWrapper}>
                    <GraduationCap size={16} style={styles.inputIcon} />
                    <select
                      id="attendee-class"
                      name="className"
                      value={formData.className}
                      onChange={handleInputChange}
                      style={{
                        ...styles.select,
                        borderColor: errors.className ? '#C85A5A' : '#DED6CB'
                      }}
                      disabled={submitting}
                    >
                      <option value="" disabled>{t('selectClass')}</option>
                      {CLASS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{t(opt) || opt}</option>
                      ))}
                    </select>
                  </div>
                  {errors.className && <span style={styles.errorText}><AlertCircle size={13} /> {errors.className}</span>}
                </div>

                {/* Gender Options */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <Heart size={14} style={{ color: '#C87B8A' }} /> {t('genderLabel')}
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
                  {errors.gender && <span style={styles.errorText}><AlertCircle size={13} /> {errors.gender}</span>}
                </div>

                {submitError && (
                  <div style={{...styles.errorText, marginBottom: '16px', fontSize: '12px', padding: '9px 12px', backgroundColor: '#F8ECF0', borderRadius: '8px', border: '1px solid #E8C5CE'}}>
                    <AlertCircle size={15} /> {submitError}
                  </div>
                )}

                {/* 7. Submit Button */}
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

        {/* 8. Successful Attendance Celebration */}
        {view === 'success' && attendeeInfo && (
          <div style={styles.viewContainer} className="animate-entrance">
            <div style={{...styles.iconWrapper, ...styles.iconSuccess}} className="animate-checkmark">
              <CheckCircle size={38} />
            </div>
            <h2 style={styles.viewTitle} className="serif-font">Kehadiranmu tercatat! ♡</h2>
            <p style={styles.viewText}>
              Terima kasih, <strong>{attendeeInfo.firstName}</strong>!<br/>
              Senang kamu hadir hari ini. Sampai bertemu di ibadah berikutnya!
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
                <span style={styles.detailLabel}>Waktu Presensi</span>
                <span style={styles.detailValue}>{formatTimestampToJakarta(attendeeInfo.timestamp)}</span>
              </div>
              <div style={styles.detailRowLast}>
                <span style={styles.detailLabel}>{t('classLabel')}</span>
                <span style={styles.detailValue}>{t(attendeeInfo.grade) || attendeeInfo.grade}</span>
              </div>
            </div>
            
            <button onClick={resetForm} style={styles.actionBtn}>
              Selesai <Check size={16} />
            </button>
          </div>
        )}

        {/* Duplicate State */}
        {view === 'duplicate' && (
          <div style={styles.viewContainer} className="animate-entrance">
            <div style={{...styles.iconWrapper, ...styles.iconWarning}}>
              <AlertTriangle size={38} />
            </div>
            <h2 style={styles.viewTitle} className="serif-font">{t('duplicateTitle')}</h2>
            <p style={styles.viewText}>{t('duplicateMessage')}</p>
            
            <button onClick={() => setView('form')} style={styles.actionBtnOutline}>
              Kembali ke Form
            </button>
          </div>
        )}

        {/* Closed State */}
        {view === 'closed' && (
          <div style={styles.viewContainer} className="animate-entrance">
            <div style={{...styles.iconWrapper, ...styles.iconClosed}}>
              <Clock size={38} />
            </div>
            <h2 style={styles.viewTitle} className="serif-font">{t('closedTitle')}</h2>
            <p style={styles.viewText}>{t('closedMessage')}</p>
          </div>
        )}

        {/* Not Found State */}
        {view === 'not-found' && (
          <div style={styles.viewContainer} className="animate-entrance">
            <div style={{...styles.iconWrapper, ...styles.iconError}}>
              <AlertCircle size={38} />
            </div>
            <h2 style={styles.viewTitle} className="serif-font">{t('notFoundTitle')}</h2>
            <p style={styles.viewText}>{t('notFoundMessage')}</p>
          </div>
        )}

      </div>
    </MobileLayout>
  );
};

export default AttendanceSession;
