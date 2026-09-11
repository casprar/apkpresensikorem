import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import koremLogo from '../assets/korem-logo.svg';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/attendance', label: 'Attendance', icon: ClipboardList },
  { path: '/admin/sessions', label: 'Sessions', icon: CalendarDays },
  { path: '/admin/qr', label: 'QR Code', icon: QrCode },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div style={styles.layout}>
      {/* Desktop Sidebar */}
      <aside style={styles.sidebar} className="admin-sidebar">
        <div style={{ ...styles.sidebarHeader, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={koremLogo} alt="KOREM" style={styles.sidebarLogo} />
            <span style={styles.sidebarTitle}>KOREM</span>
          </div>
          <LanguageSwitcher />
        </div>

        <nav style={styles.sidebarNav}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path === '/admin/sessions' && location.pathname.startsWith('/admin/sessions'));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
              </NavLink>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.adminInfo}>
            <div style={styles.adminAvatar}>
              {(profile?.full_name || profile?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div style={styles.adminDetails}>
              <span style={styles.adminName}>{profile?.full_name || 'Admin'}</span>
              <span style={styles.adminEmail}>{profile?.email || ''}</span>
            </div>
          </div>
          <button onClick={handleSignOut} style={styles.logoutBtn} aria-label="Sign out">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header style={styles.mobileHeader} className="admin-navbar">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.menuBtn}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div style={styles.mobileHeaderTitle}>
          <img src={koremLogo} alt="KOREM" style={styles.mobileLogo} />
          <span style={styles.mobileTitle}>KOREM Admin</span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div style={styles.overlay} onClick={closeMobileMenu} />
          <div style={styles.mobileMenu}>
            <nav style={styles.mobileNav}>
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    style={{
                      ...styles.mobileNavLink,
                      ...(isActive ? styles.mobileNavLinkActive : {}),
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <button onClick={handleSignOut} style={styles.mobileLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-secondary)',
  },
  // Sidebar (desktop)
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: 'var(--sidebar-width)',
    background: 'var(--bg-sidebar)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 'var(--z-sticky)',
    transition: 'transform var(--transition-slow)',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  sidebarLogo: {
    width: 36,
    height: 36,
    borderRadius: '8px',
  },
  sidebarTitle: {
    color: 'var(--korem-white)',
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-bold)',
    letterSpacing: '2px',
  },
  sidebarNav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: 'var(--border-radius-md)',
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    transition: 'all var(--transition-fast)',
  },
  navLinkActive: {
    background: 'rgba(124, 58, 237, 0.2)',
    color: 'var(--korem-white)',
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  adminAvatar: {
    width: 36,
    height: 36,
    borderRadius: 'var(--border-radius-full)',
    background: 'var(--color-primary)',
    color: 'var(--korem-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
  },
  adminDetails: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  adminName: {
    color: 'var(--korem-white)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  adminEmail: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 'var(--font-size-xs)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px 16px',
    borderRadius: 'var(--border-radius-md)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 'var(--font-size-sm)',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
  },
  // Mobile header
  mobileHeader: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--header-height)',
    background: 'var(--bg-sidebar)',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 'var(--z-sticky)',
  },
  menuBtn: {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--korem-white)',
    borderRadius: 'var(--border-radius-md)',
  },
  mobileHeaderTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  mobileLogo: {
    width: 28,
    height: 28,
  },
  mobileTitle: {
    color: 'var(--korem-white)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
  },
  // Mobile menu
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'var(--bg-overlay)',
    zIndex: 'var(--z-modal-backdrop)',
  },
  mobileMenu: {
    position: 'fixed',
    top: 'var(--header-height)',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'var(--bg-sidebar)',
    zIndex: 'var(--z-modal)',
    padding: '16px',
    overflowY: 'auto',
    animation: 'fadeIn 200ms ease',
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: 'var(--border-radius-md)',
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-medium)',
  },
  mobileNavLinkActive: {
    background: 'rgba(124, 58, 237, 0.2)',
    color: 'var(--korem-white)',
  },
  mobileLogout: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px 16px',
    marginTop: '24px',
    borderRadius: 'var(--border-radius-md)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 'var(--font-size-base)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    paddingTop: '24px',
  },
  // Main content
  main: {
    flex: 1,
    marginLeft: 'var(--sidebar-width)',
    minHeight: '100vh',
  },
  content: {
    padding: '32px',
    maxWidth: 'var(--max-content-width)',
    margin: '0 auto',
  },
};

// Add responsive CSS via a style tag
const responsiveCSS = document.createElement('style');
responsiveCSS.textContent = `
  @media (max-width: 768px) {
    .admin-sidebar {
      display: none !important;
    }
    .admin-navbar {
      display: flex !important;
    }
    .admin-sidebar + .admin-navbar + * + main,
    main {
      margin-left: 0 !important;
      padding-top: var(--header-height) !important;
    }
  }
  @media (min-width: 769px) {
    .admin-navbar {
      display: none !important;
    }
  }
  .admin-sidebar .navLink:hover {
    background: rgba(255,255,255,0.06);
    color: var(--korem-white);
  }
`;
if (!document.getElementById('admin-layout-styles')) {
  responsiveCSS.id = 'admin-layout-styles';
  document.head.appendChild(responsiveCSS);
}
