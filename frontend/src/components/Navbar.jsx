import React, { useContext, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { resolveAssetUrl } from '../services/api';
import BrandLogo from './BrandLogo';

const LANDING_DOCK_FLAG = 'lnf_nav_dock_from_landing';

const markDockFromLanding = () => {
  try {
    sessionStorage.setItem(LANDING_DOCK_FLAG, '1');
  } catch (_error) {
    // Ignore storage failures.
  }
};

const consumeDockFromLanding = () => {
  try {
    const value = sessionStorage.getItem(LANDING_DOCK_FLAG) === '1';
    sessionStorage.removeItem(LANDING_DOCK_FLAG);
    return value;
  } catch (_error) {
    return false;
  }
};

const Navbar = ({ floating = false, dockOnLoad = false }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const shouldAnimateDock = useMemo(
    () => dockOnLoad && consumeDockFromLanding(),
    [dockOnLoad]
  );

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = isAuthenticated
    ? [
        { href: '/home', label: 'Listings' },
        { href: '/my-posts', label: 'My Posts' },
        { href: '/messages', label: 'Messages' },
        ...(user?.role === 'admin' ? [{ href: '/admin', label: 'Admin Panel' }] : []),
      ]
    : [
        { href: '/', label: 'Landing' },
        { href: '/home', label: 'Browse Listings' },
      ];

  const isActive = (path) => {
    if (path === '/home' && location.pathname.startsWith('/post/')) return true;
    return location.pathname === path;
  };

  const navShellClass = floating
    ? `navbar-shell navbar-floating ${shouldAnimateDock ? 'navbar-dock-enter' : ''}`
    : `navbar-shell navbar-docked ${shouldAnimateDock ? 'navbar-dock-enter' : ''}`;

  const logoTarget = isAuthenticated ? '/home' : '/';

  return (
    <>
      <nav className={navShellClass}>
        <div className="container-lg h-full flex items-center justify-between px-4 md:px-6">
          <BrandLogo
            to={logoTarget}
            className="flex items-center"
            iconFill="#f7f8ff"
            textColor="#f3f5ff"
            subtitleColor="rgba(195, 205, 255, 0.72)"
          />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-dm transition-colors duration-150 relative group ${
                  isActive(link.href)
                    ? 'text-white font-medium'
                    : 'text-[#b8c4ef] hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#b38fff] rounded-full"
                    layoutId="indicator"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center bg-[#8d7bff1f] text-[#b8c4ef] text-sm font-semibold transition-colors ${
                    isActive('/profile') ? 'border-[#8d7bff]' : 'border-white/15 hover:border-[#8d7bff]'
                  }`}
                  title="My Profile"
                  aria-label="Open profile page"
                >
                  {user?.avatar ? (
                    <img
                      src={resolveAssetUrl(`/uploads/avatars/${user.avatar}`)}
                      alt="avatar"
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                  )}
                </Link>
                <Link
                  to="/create-post"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border border-[#9b88ff]/70 bg-[#8d7bff] text-white hover:bg-[#9b88ff]"
                >
                  Post Item
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border border-white/18 bg-white/[0.04] text-[#dce4ff] hover:bg-white/[0.08]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={floating ? markDockFromLanding : undefined}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border border-[#9b88ff]/70 bg-[#8d7bff] text-white hover:bg-[#9b88ff]"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  onClick={floating ? markDockFromLanding : undefined}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border border-white/18 bg-white/[0.04] text-[#dce4ff] hover:bg-white/[0.08]"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center bg-[#8d7bff1f] text-[#b8c4ef] text-xs font-semibold ${
                  isActive('/profile') ? 'border-[#8d7bff]' : 'border-white/15'
                }`}
                aria-label="Open profile page"
                onClick={() => setIsMenuOpen(false)}
              >
                {user?.avatar ? (
                  <img
                    src={resolveAssetUrl(`/uploads/avatars/${user.avatar}`)}
                    alt="avatar"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 flex flex-col justify-center items-center gap-1.5 hover:bg-white/10 rounded-md transition-colors"
            >
              <div className={`h-0.5 w-5 bg-white transition-transform ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`} />
              <div className={`h-0.5 w-5 bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`h-0.5 w-5 bg-white transition-transform ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/45 z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-16 bottom-0 w-64 z-40 md:hidden shadow-lg border-l border-white/10 bg-[#120f24]"
              initial={{ x: 256 }}
              animate={{ x: 0 }}
              exit={{ x: 256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6 flex flex-col h-full">
                <nav className="space-y-4 mb-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm font-dm transition-colors ${
                        isActive(link.href)
                          ? 'text-[#b38fff] font-medium'
                          : 'text-[#b8c4ef] hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="space-y-3 mt-auto border-t border-white/10 pt-6">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/create-post"
                        onClick={() => setIsMenuOpen(false)}
                        className="inline-flex w-full items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border border-[#9b88ff]/70 bg-[#8d7bff] text-white hover:bg-[#9b88ff]"
                      >
                        Post Item
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="inline-flex w-full items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border border-white/18 bg-white/[0.04] text-[#dce4ff] hover:bg-white/[0.08]"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        onClick={() => {
                          if (floating) markDockFromLanding();
                          setIsMenuOpen(false);
                        }}
                        className="inline-flex w-full items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border border-[#9b88ff]/70 bg-[#8d7bff] text-white hover:bg-[#9b88ff]"
                      >
                        Register
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => {
                          if (floating) markDockFromLanding();
                          setIsMenuOpen(false);
                        }}
                        className="inline-flex w-full items-center justify-center px-4 py-2 rounded-xl text-sm font-medium border border-white/18 bg-white/[0.04] text-[#dce4ff] hover:bg-white/[0.08]"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
