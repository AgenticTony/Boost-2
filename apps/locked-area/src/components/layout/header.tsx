import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/use-auth";
import { Button } from "@/components/ui/button";

export function Header() {
  const { logout, user, isAdmin } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: "/", label: "Bibliotek" },
    { path: "/resources", label: "Resurser" },
    { path: "/knowledge", label: "Kunskapsbanken" },
    { path: "/handbook", label: "Handböcker" },
  ];

  const linkClass = (path: string) =>
    isActive(path)
      ? "px-3 py-2 text-sm font-medium rounded-md text-brand-gold bg-brand-gold/10"
      : "px-3 py-2 text-sm font-medium rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-surface-dark border-b border-white/10">
      <nav className="container-page flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/logo_boostbyfcr_dark.png"
            alt="Boost by FC Rosengård"
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={linkClass(link.path)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: admin + logout + avatar */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin/approvals" className={linkClass("/admin")}>
              Admin
            </Link>
          )}
          <Button onClick={logout} variant="onDark" className="rounded-pill">
            Logga ut
          </Button>
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 text-brand-gold flex items-center justify-center text-xs font-bold uppercase">
                {user.email?.charAt(0) || "U"}
              </div>
              <span className="text-xs text-white/70 max-w-[160px] truncate">
                {user.email}
              </span>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white"
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={menuOpen}
        >
          <span className="text-2xl leading-none">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-surface-dark border-t border-white/10 px-6 py-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={linkClass(link.path)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin/approvals"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/admin")}
              >
                Admin
              </Link>
            )}
            <Button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              variant="onDark"
              size="sm"
              className="rounded-pill justify-start"
            >
              Logga ut
            </Button>
            {user && (
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-white/10 text-brand-gold flex items-center justify-center text-xs font-bold uppercase">
                  {user.email?.charAt(0) || "U"}
                </div>
                <span className="text-xs text-white/70 truncate">
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
