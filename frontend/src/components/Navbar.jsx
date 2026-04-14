import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
  ];

  if (isAuthenticated) {
    navLinks.push(
      { href: '/my-posts', label: 'My Posts' },
      { href: '/messages', label: 'Messages' }
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className="sticky top-0 h-16 z-40 navbar-shell glass shadow-md bg-white/90"
        style={{
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="container-lg h-full flex items-center justify-between px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <svg width="180" height="44" viewBox="0 0 180 44" 
                 xmlns="http://www.w3.org/2000/svg">
              
              {/* Badge */}
              <rect x="0" y="5" width="34" height="34" rx="10" fill="#ffffff"/>
              
              {/* Magnifying glass circle */}
              <circle cx="14" cy="19" r="5.5" fill="none" stroke="#0f0f12" 
                      strokeWidth="2" strokeLinecap="round"/>
              
              {/* Magnifying glass handle */}
              <line x1="18.5" y1="23.5" x2="22" y2="27" stroke="#0f0f12" 
                    strokeWidth="2" strokeLinecap="round"/>
              
              {/* Ghost diagonal line */}
              <line x1="22" y1="13" x2="28" y2="31" stroke="#0f0f12" 
                    strokeWidth="1.6" strokeLinecap="round" opacity="0.15"/>
              
              {/* F letter */}
              <text x="24" y="30" fontFamily="Arial" fontWeight="900" 
                    fontSize="10" fill="#0f0f12">F</text>
              
              {/* LNF wordmark */}
              <text x="44" y="21" fontFamily="'Syne', sans-serif" 
                    fontWeight="800" fontSize="18" fill="#000000" 
                    letterSpacing="-0.8">LNF</text>
              
              {/* Subtitle */}
              <text x="44" y="36" fontFamily="'DM Sans', sans-serif" 
                    fontWeight="300" fontSize="9" 
                    fill="rgba(0, 0, 0, 0.38)" letterSpacing="2.5">
                LOST &amp; FOUND
              </text>
              
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-dm transition-colors duration-150 relative group ${
                  isActive(link.href)
                    ? 'text-ink-primary font-medium'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full"
                    layoutId="indicator"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className="btn btn-primary text-sm"
                >
                  Post Item
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-secondary text-sm">
                  Register
                </Link>
                <Link to="/login" className="btn btn-primary text-sm">
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 hover:bg-accent-soft rounded-md transition-colors"
          >
            <div className={`h-0.5 w-5 bg-ink-primary transition-transform ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`} />
            <div className={`h-0.5 w-5 bg-ink-primary transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`h-0.5 w-5 bg-ink-primary transition-transform ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-16 bottom-0 w-64 glass z-40 md:hidden shadow-lg"
              initial={{ x: 256 }}
              animate={{ x: 0 }}
              exit={{ x: 256 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6 flex flex-col h-full">
                {/* Nav Links */}
                <nav className="space-y-4 mb-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm font-dm transition-colors ${
                        isActive(link.href)
                          ? 'text-accent font-medium'
                          : 'text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Action Buttons */}
                <div className="space-y-3 mt-auto border-t border-border pt-6">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/create-post"
                        onClick={() => setIsMenuOpen(false)}
                        className="btn btn-primary w-full justify-center"
                      >
                        Post Item
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="btn btn-secondary w-full justify-center"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="btn btn-secondary w-full justify-center"
                      >
                        Register
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="btn btn-primary w-full justify-center"
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

