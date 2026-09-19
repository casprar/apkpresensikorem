import koremLogo from '../assets/korem-logo.svg';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

/**
 * Layout for public-facing attendance pages.
 * Centered, mobile-optimized, clean design.
 */
export default function MobileLayout({ children }) {
  const { t } = useLanguage();

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', paddingHorizontal: '4px' }}>
          <div style={styles.communityBadge}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✨ KOREM GKI Pamulang
            </span>
          </div>
          <LanguageSwitcher />
        </div>

        <header style={styles.header}>
          <div style={styles.logoBadge}>
            <img src={koremLogo} alt="KOREM GKI Pamulang" style={styles.logo} />
          </div>
          <h1 style={styles.title}>{t('attendanceTitle')}</h1>
          <p style={styles.subtitle}>Selamat Datang Remaja Pamulang! 🕊️</p>
        </header>

        <main style={styles.main}>
          {children}
        </main>

        <footer style={styles.footer}>
          <p style={styles.footerText}>Komunitas Remaja GKI Pamulang</p>
          <p style={{ fontSize: '11px', color: '#A1A1AA', marginTop: '2px' }}>Bersuka Cipta & Bertumbuh Bersama dalam Kasih</p>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    minHeight: '100dvh',
    background: 'radial-gradient(circle at 50% -10%, rgba(225, 0, 120, 0.09) 0%, transparent 60%), radial-gradient(circle at 90% 40%, rgba(124, 58, 237, 0.07) 0%, transparent 50%), linear-gradient(165deg, #FAF8FC 0%, #F4EEFB 50%, #FFF5FA 100%)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '0 16px',
  },
  container: {
    width: '100%',
    maxWidth: '460px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    minHeight: '100dvh',
  },
  communityBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(124, 58, 237, 0.15)',
    display: 'inline-flex',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    paddingBottom: '4px',
    textAlign: 'center',
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.15), 0 4px 10px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    marginBottom: '14px',
    transition: 'transform 0.3s ease',
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: '-0.025em',
    lineHeight: '1.25',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#6B7280',
    margin: 0,
  },
  main: {
    flex: 1,
    paddingTop: '16px',
    paddingBottom: '24px',
  },
  footer: {
    textAlign: 'center',
    paddingBottom: '24px',
  },
  footerText: {
    fontSize: '12px',
    color: '#71717A',
    fontWeight: '600',
  },
};
