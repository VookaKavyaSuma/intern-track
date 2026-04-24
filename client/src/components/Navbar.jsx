import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
  });

  return (
    <nav
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
        <NavLink to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <NavLink to="/dashboard" style={linkStyle} id="nav-dashboard">
            Dashboard
          </NavLink>
          <NavLink to="/analyzer" style={linkStyle} id="nav-analyzer">
            Job Analyzer
          </NavLink>
        </div>

        {/* User & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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
      </div>
    </nav>
  );
};

export default Navbar;
