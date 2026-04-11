import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        className={`sticky top-0 h-16 z-40 transition-all duration-300 ${
          scrolled ? 'glass-strong' : 'glass'
        }`}
        style={{
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="container-lg h-full flex items-center justify-between px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 bg-ink-primary rounded-sm" />
            <span className="font-syne font-bold text-lg text-ink-primary hidden sm:block">
              L&F
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-dm transition-all duration-150 relative group ${
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
            <div className={`h-0.5 w-5 bg-ink-primary transition-all ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`} />
            <div className={`h-0.5 w-5 bg-ink-primary transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`h-0.5 w-5 bg-ink-primary transition-all ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
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

