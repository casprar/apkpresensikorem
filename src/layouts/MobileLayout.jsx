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
        {/* Top Header Bar */}
        <div style={styles.topBar}>
          <div style={styles.headerTag}>
            <span style={styles.headerTagDot}></span>
            <span>GKI Pamulang</span>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Editorial Church Bulletin Header */}
        <header style={styles.header}>
          <div style={styles.logoBadge}>
            <img src={koremLogo} alt="KOREM GKI Pamulang" style={styles.logo} />
          </div>
          <h1 style={styles.title} className="serif-font">{t('attendanceTitle')}</h1>
          <p style={styles.subtitle}>Komisi Remaja • Persekutuan & Presensi</p>
          
          {/* Subtle organic decorative line */}
          <div style={styles.decorLine}>
            <svg width="120" height="8" viewBox="0 0 120 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4C20 1 40 7 60 4C80 1 100 7 118 4" stroke="#D1C7B7" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </header>

        {/* Main Content */}
        <main style={styles.main}>
          {children}
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>Komisi Remaja GKI Pamulang</p>
          <p style={styles.footerSubtext}>"Setia Melayani"</p>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    minHeight: '100dvh',
    backgroundColor: '#F8F5EF',
    backgroundImage: 'radial-gradient(#E2DACD 0.75px, transparent 0.75px)',
    backgroundSize: '18px 18px',
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
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    paddingBottom: '8px',
  },
  headerTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#EFEAE1',
    border: '1px solid #DED7CB',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#5C6370',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  headerTagDot: {
    width: '6px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#8E83A3',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '16px',
    paddingBottom: '8px',
    textAlign: 'center',
  },
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2DCD3',
    boxShadow: '0 2px 8px rgba(44, 48, 62, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    marginBottom: '12px',
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#2C303E',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6E7585',
    margin: 0,
    letterSpacing: '0.01em',
  },
  decorLine: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    opacity: 0.8,
  },
  main: {
    flex: 1,
    paddingTop: '16px',
    paddingBottom: '24px',
  },
  footer: {
    textAlign: 'center',
    paddingBottom: '28px',
    borderTop: '1px border-dashed #E4DDD2',
  },
  footerText: {
    fontSize: '12px',
    color: '#4A5060',
    fontWeight: '600',
    fontFamily: "'Lora', Georgia, serif",
  },
  footerSubtext: {
    fontSize: '11px',
    color: '#8A91A0',
    marginTop: '3px',
    fontStyle: 'italic',
  },
};
