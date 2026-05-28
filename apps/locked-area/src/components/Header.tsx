import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react"; // ← ADD

export default function Header() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // ← ADD

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  if (location.pathname === '/login') return null;

  const navLinks = [
    { path: "/", label: "Bibliotek" },
    { path: "/resources", label: "Resurser" },
    { path: "/knowledge", label: "Kunskapsbanken" },
    { path: "/handbook", label: "Handböcker" },
  ];

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 9999,
      backgroundColor: '#0a1f3d',
      borderBottom: '1px solid #1a4a7a',
      padding: '0 24px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        maxWidth: '1280px',
        margin: '0 auto',
        height: '64px'
      }}>
        {/* Logo */}
       <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img 
          src={import.meta.env.BASE_URL + 'logo_boostbyfcr_dark.png'} 
          alt="Boost by FC Rosengård" 
          style={{ height: '32px', width: 'auto' }}
            />
       </Link>
        {/* Desktop Nav - hidden on mobile */}
        <nav style={{ display: 'flex', gap: '4px' }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                color: isActive(link.path) ? '#D4AF37' : '#C0C7DA',
                backgroundColor: isActive(link.path) ? 'rgba(212,175,55,0.1)' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{
            background: 'none',
            border: 'none',
            color: '#C0C7DA',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Right side: Admin + Logout + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden md:flex">
          {user?.email === 'moh17670s@gmail.com' && (
            <Link
              to="/admin/approvals"
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                color: isActive("/admin") ? '#D4AF37' : '#C0C7DA',
                backgroundColor: isActive("/admin") ? 'rgba(212,175,55,0.1)' : 'transparent'
              }}
            >
              Admin
            </Link>
          )}
          <button 
            onClick={logout}
            style={{ 
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              background: 'none',
              border: '1px solid #C93320',
              color: '#F04D38',
              cursor: 'pointer'
            }}
          >
            Logga ut
          </button>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1a4a7a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: '#D4AF37',
                textTransform: 'uppercase'
              }}>
                {user.email?.charAt(0) || 'U'}
              </div>
              <span style={{
                fontSize: '13px',
                color: '#C0C7DA',
                maxWidth: '160px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div 
          className="md:hidden"
          style={{
            backgroundColor: '#0a1f3d',
            borderTop: '1px solid #1a4a7a',
            padding: '16px 24px'
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive(link.path) ? '#D4AF37' : '#C0C7DA',
                  backgroundColor: isActive(link.path) ? 'rgba(212,175,55,0.1)' : 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
            {user?.email === 'moh17670s@gmail.com' && (
              <Link
                to="/admin/approvals"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive("/admin") ? '#D4AF37' : '#C0C7DA'
                }}
              >
                Admin
              </Link>
            )}
            <button 
              onClick={() => { logout(); setMenuOpen(false); }}
              style={{ 
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                background: 'none',
                border: '1px solid #C93320',
                color: '#F04D38',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              Logga ut
            </button>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#1a4a7a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#D4AF37',
                  textTransform: 'uppercase'
                }}>
                  {user.email?.charAt(0) || 'U'}
                </div>
                <span style={{ fontSize: '13px', color: '#C0C7DA' }}>
                  {user.email}
                </span>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}