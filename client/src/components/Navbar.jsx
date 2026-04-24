import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
    fontWeight: isActive ? 600 : 400,
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.2s ease',
    fontSize: '0.9rem',
    background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
    display: 'block',
  });

  const mobileLinkStyle = ({ isActive }) => ({
    ...linkStyle({ isActive }),
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    borderRadius: 'var(--radius-md)',
    width: '100%',
  });

  return (
    <nav
      ref={menuRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-glass)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <NavLink to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontSize: '1.3rem' }}>🚀</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.1rem',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            InternTrack
          </span>
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <NavLink to="/dashboard" style={linkStyle} id="nav-dashboard">
            Dashboard
          </NavLink>
          <NavLink to="/analyzer" style={linkStyle} id="nav-analyzer">
            Job Analyzer
          </NavLink>
        </div>

        {/* Desktop User & Logout */}
        <div className="nav-desktop-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
            {user?.name}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
            id="btn-logout"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.45rem',
            cursor: 'pointer',
            flexShrink: 0,
            width: '40px',
            height: '40px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className="nav-mobile-menu"
        style={{
          display: 'none',
          overflow: 'hidden',
          maxHeight: menuOpen ? '300px' : '0px',
          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          opacity: menuOpen ? 1 : 0,
          borderTop: menuOpen ? '1px solid var(--border-glass)' : 'none',
        }}
      >
        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <NavLink to="/dashboard" style={mobileLinkStyle} id="nav-dashboard-mobile">
            📊 Dashboard
          </NavLink>
          <NavLink to="/analyzer" style={mobileLinkStyle} id="nav-analyzer-mobile">
            🔍 Job Analyzer
          </NavLink>
          <div
            style={{
              marginTop: '0.5rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              👤 {user?.name}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
              id="btn-logout-mobile"
              style={{ flexShrink: 0 }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Responsive CSS via style tag */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links,
          .nav-desktop-user {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: flex !important;
          }
          .nav-mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
