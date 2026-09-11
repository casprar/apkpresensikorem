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
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
          <LanguageSwitcher />
        </div>
        <header style={styles.header}>
          <img src={koremLogo} alt="KOREM GKI Pamulang" style={styles.logo} />
          <h1 style={styles.title}>{t('attendanceTitle')}</h1>
        </header>
        <main style={styles.main}>
          {children}
        </main>
        <footer style={styles.footer}>
          <p style={styles.footerText}>KOREM GKI Pamulang</p>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    minHeight: '100dvh',
    background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #fff7ed 100%)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '0 16px',
  },
  container: {
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    minHeight: '100dvh',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '32px',
    paddingBottom: '8px',
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: '12px',
  },
  title: {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
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
    fontSize: 'var(--font-size-xs)',
    color: 'var(--text-tertiary)',
    fontWeight: 'var(--font-weight-medium)',
  },
};
