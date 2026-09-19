import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionForAttendance } from '../../services/sessionService';
import { submitAttendance } from '../../services/attendanceService';
import { validateAttendanceForm } from '../../utils/validation';
import { formatDate, formatTime, formatTimestampToJakarta } from '../../utils/date';
import { SUBMISSION_STATUS, CLASS_OPTIONS } from '../../constants/classOptions';
import MobileLayout from '../../layouts/MobileLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useLanguage } from '../../context/LanguageContext';

const styles = {
  container: {
    padding: '4px 0 24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  /* ── Session Event Poster Card ── */
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
    fontSize: '13px',
    fontWeight: '500',
    color: '#5E6578',
    backgroundColor: '#F7F4FB',
    padding: '5px 12px',
    borderRadius: '8px',
    border: '1px solid #E2DCEB',
  },

  /* ── Form Registration Card ── */
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
    display: 'block',
    fontSize: '12px',
    fontWeight: '700',
    color: '#3E4454',
    marginBottom: '8px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    height: '48px',
    padding: '0 14px',
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
    padding: '0 14px',
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
    transform: 'scale(1.02)',
  },

  errorText: {
    color: '#C85A5A',
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '6px',
  },

  /* ── Submit Button ── */
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
    marginTop: '8px',
    letterSpacing: '0.01em',
    transition: 'transform 0.15s ease',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  /* ── Bible Verse Post-Submission Pop-up Modal ── */
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
    padding: '28px 22px',
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
    display: 'inline-block',
    backgroundColor: '#EDE8F5',
    color: '#6B5E82',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '14px',
    border: '1px solid #DED6E8',
  },
  devotionalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2C303E',
    marginBottom: '12px',
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
    fontSize: '14px',
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
  devotionalGreeting: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#5E6578',
    marginBottom: '18px',
    lineHeight: '1.5',
  },
  detailsBox: {
    backgroundColor: '#F9F6F0',
    borderRadius: '12px',
    padding: '16px',
    width: '100%',
    marginBottom: '20px',
    textAlign: 'left',
    border: '1px solid #E4DDD2',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px dashed #E2DCD3',
  },
  detailRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '6px',
  },
  detailLabel: {
    color: '#6E7585',
    fontSize: '12px',
    fontWeight: '500',
  },
  detailValue: {
    color: '#2C303E',
    fontWeight: '700',
    fontSize: '12px',
  },
  devotionalDismissBtn: {
    width: '100%',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: '#5C7463',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.01em',
  },

  /* ── States: Duplicate / Closed / Not Found ── */
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

const BIBLE_VERSES = [
  { quote: '“Hendaklah kamu saling mengasihi, seperti Aku telah mengasihi kamu.”', ref: '— Yohanes 15:12' },
  { quote: '“Jangan seorang pun menganggap engkau rendah karena engkau muda. Jadilah teladan bagi orang-orang percaya, dalam perkataanmu, dalam tingkah lakumu, dalam kasihmu, dalam kesetiaanmu dan dalam kesucianmu.”', ref: '— 1 Timotius 4:12' },
  { quote: '“Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku.”', ref: '— Mazmur 119:105' },
  { quote: '“Sebab Aku mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.”', ref: '— Yeremia 29:11' },
  { quote: '“Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.”', ref: '— Filipi 4:13' },
  { quote: '“Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri. Akuilah Dia dalam segala lakumu, maka Ia akan meluruskan jalanmu.”', ref: '— Amsal 3:5-6' },
  { quote: '“Bersukacitalah dalam pengharapan, sabarlah dalam kesesakan, dan bertekunlah dalam doa!”', ref: '— Roma 12:12' },
  { quote: '“Lakukanlah segala pekerjaanmu dalam kasih!”', ref: '— 1 Korintus 16:14' },
  { quote: '“Janganlah kita jemu-jemu berbuat baik, karena apabila sudah tiba waktunya, kita akan menuai, jika kita tidak menjadi lemah.”', ref: '— Galatia 6:9' },
  { quote: '“Sungguh, betapa baiknya dan betapa indahnya, apabila saudara-saudara diam bersama dengan rukun!”', ref: '— Mazmur 133:1' },
  { quote: '“Apa pun juga yang kamu perbuat, perbuatlah dengan segenap hatimu seperti untuk Tuhan dan bukan untuk manusia.”', ref: '— Kolose 3:23' },
  { quote: '“Demikianlah hendaknya terangmu bercahaya di depan orang, supaya mereka melihat perbuatanmu yang baik dan memuliakan Bapamu yang di sorga.”', ref: '— Matius 5:16' },
  { quote: '“Tetapi hendaklah kamu ramah seorang terhadap yang lain, penuh kasih mesra dan saling mengampuni, sebagaimana Allah dalam Kristus telah mengampuni kamu.”', ref: '— Efesus 4:32' },
  { quote: '“Sebab Allah memberikan kepada kita bukan roh ketakutan, melainkan roh yang membangkitkan kekuatan, kasih dan ketertiban.”', ref: '— 2 Timotius 1:7' },
  { quote: '“Kuatkan dan teguhkanlah hatimu! Janganlah kecut dan tawar hati, sebab TUHAN, Allahmu, menyertai engkau, ke mana pun engkau pergi.”', ref: '— Yosua 1:9' }
];

const AttendanceSession = () => {
  const { sessionId } = useParams();
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [view, setView] = useState('loading'); // loading, form, success, duplicate, closed, not-found
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', className: '', gender: '' });
  const [errors, setErrors] = useState({});
  const [attendeeInfo, setAttendeeInfo] = useState(null);
  const [submitError, setSubmitError] = useState('');

  /* Devotional Pop-up State (Triggered AFTER attendance submission) */
  const [showDevotionalPopup, setShowDevotionalPopup] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(BIBLE_VERSES[0]);

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
          // Pick a random Bible verse for the popup
          const randomIndex = Math.floor(Math.random() * BIBLE_VERSES.length);
          setCurrentVerse(BIBLE_VERSES[randomIndex]);
          // Trigger the devotional scripture popup AFTER successful submission
          setShowDevotionalPopup(true);
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

  const closeDevotionalAndReset = () => {
    setShowDevotionalPopup(false);
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
      {/* ── Post-Submission Bible Verse Devotional Pop-up ── */}
      {showDevotionalPopup && (
        <div style={styles.devotionalOverlay} onClick={closeDevotionalAndReset}>
          <div style={styles.devotionalCard} onClick={(e) => e.stopPropagation()}>
            
            <div style={styles.devotionalTag}>
              Firman Hari Ini
            </div>
            
            <h3 style={styles.devotionalTitle} className="serif-font">Kehadiranmu Tercatat! ♡</h3>

            <div style={styles.devotionalQuoteBox}>
              <p style={styles.devotionalQuoteText}>
                {currentVerse.quote}
              </p>
              <p style={styles.devotionalQuoteRef}>{currentVerse.ref}</p>
            </div>

            <p style={styles.devotionalGreeting}>
              Terima kasih, <strong>{attendeeInfo?.firstName}</strong>!<br/>
              Senang kamu hadir hari ini. Selamat beribadah ♡
            </p>

            {attendeeInfo && (
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
            )}

            <button 
              type="button" 
              onClick={closeDevotionalAndReset} 
              style={styles.devotionalDismissBtn}
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      <div style={styles.container}>
        
        {view === 'form' && session && (
          <>
            {/* Session Event Poster Card */}
            <div style={styles.sessionPoster}>
              <h2 style={styles.posterTitle} className="serif-font">{session.name}</h2>
              <div style={styles.posterMeta}>
                <span>{formatDate(session.date)} {session.start_time ? `• ${formatTime(session.start_time)} WIB` : ''}</span>
              </div>
            </div>

            {/* Form Registration Card */}
            <div style={styles.formCard}>
              <div style={styles.formHeader}>
                <h3 style={styles.formHeaderTitle} className="serif-font">Formulir Presensi</h3>
                <p style={styles.formHeaderSubtitle}>Silakan lengkapi data presensi kamu di bawah ini</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name Input */}
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="attendee-name">
                    {t('fullNameLabel')}
                  </label>
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
                  {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                </div>

                {/* Class Select */}
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="attendee-class">
                    {t('classLabel')}
                  </label>
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
                  {errors.className && <span style={styles.errorText}>{errors.className}</span>}
                </div>

                {/* Gender Options */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    {t('genderLabel')}
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
                  {errors.gender && <span style={styles.errorText}>{errors.gender}</span>}
                </div>

                {submitError && (
                  <div style={{...styles.errorText, marginBottom: '16px', fontSize: '12px', padding: '9px 12px', backgroundColor: '#F8ECF0', borderRadius: '8px', border: '1px solid #E8C5CE'}}>
                    {submitError}
                  </div>
                )}

                {/* Submit Button */}
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

        {/* Success View Fallback (If Pop-up is closed) */}
        {view === 'success' && attendeeInfo && !showDevotionalPopup && (
          <div style={styles.viewContainer}>
            <h2 style={styles.viewTitle} className="serif-font">Kehadiranmu Tercatat! ♡</h2>
            <p style={styles.viewText}>
              Terima kasih, <strong>{attendeeInfo.firstName}</strong>!<br/>
              Presensi kamu telah tercatat. Selamat beribadah ♡
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
            
            <button onClick={closeDevotionalAndReset} style={styles.actionBtnOutline}>
              Kembali
            </button>
          </div>
        )}

        {/* Duplicate State */}
        {view === 'duplicate' && (
          <div style={styles.viewContainer}>
            <h2 style={styles.viewTitle} className="serif-font">{t('duplicateTitle')}</h2>
            <p style={styles.viewText}>{t('duplicateMessage')}</p>
            
            <button onClick={() => setView('form')} style={styles.actionBtnOutline}>
              Kembali ke Form
            </button>
          </div>
        )}

        {/* Closed State */}
        {view === 'closed' && (
          <div style={styles.viewContainer}>
            <h2 style={styles.viewTitle} className="serif-font">{t('closedTitle')}</h2>
            <p style={styles.viewText}>{t('closedMessage')}</p>
          </div>
        )}

        {/* Not Found State */}
        {view === 'not-found' && (
          <div style={styles.viewContainer}>
            <h2 style={styles.viewTitle} className="serif-font">{t('notFoundTitle')}</h2>
            <p style={styles.viewText}>{t('notFoundMessage')}</p>
          </div>
        )}

      </div>
    </MobileLayout>
  );
};

export default AttendanceSession;
