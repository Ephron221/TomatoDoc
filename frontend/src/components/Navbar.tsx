import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, ChevronDown, Check, User } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'ENGLISH', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'rw', name: 'RWANDA', flag: 'https://flagcdn.com/w40/rw.png' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangOpen(false);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.how_it_works'), path: '/how-it-works' },
    { name: t('nav.pricing'), path: '/pricing' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <nav className="bg-white text-gray-900 sticky top-0 z-50 shadow-sm border-b backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo with interactive hover */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <Link to="/" className="text-2xl font-black flex items-center tracking-tighter text-secondary">
              <motion.span 
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="text-4xl mr-2"
              >
                🍅
              </motion.span>
              <span className="hidden sm:block">TomatoDoc</span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-1 mr-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group px-4 py-2"
                >
                  <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    location.pathname === link.path ? 'text-secondary' : 'text-gray-600 group-hover:text-secondary'
                  }`}>
                    {link.name}
                  </span>
                  {/* Interactive animated underline */}
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-secondary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: location.pathname === link.path ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </Link>
              ))}
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            {/* Language Dropdown */}
            <div className="relative ml-2" ref={langRef}>
              <motion.button
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all border border-gray-200"
              >
                <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-3.5 object-cover rounded-sm" />
                <span className="text-xs font-black text-gray-700">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 py-2"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                          i18n.language === lang.code ? 'bg-secondary text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={lang.flag} alt={lang.name} className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                          <span className="text-xs font-black tracking-widest">{lang.name}</span>
                        </div>
                        {i18n.language === lang.code && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 ml-4">
              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="flex items-center space-x-2 bg-secondary hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/20 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{t('nav.dashboard')}</span>
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
                    onClick={handleLogout}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl transition-all"
                    title={t('nav.logout')}
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 bg-secondary hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/20 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>{t('nav.login')}</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-4">
            {isAuthenticated && <NotificationBell />}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-colors ${
                    location.pathname === link.path ? 'bg-red-50 text-secondary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t space-y-4 px-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Choose Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all ${
                        i18n.language === lang.code ? 'bg-secondary border-secondary text-white' : 'bg-gray-50 border-gray-100 text-gray-600'
                      }`}
                    >
                      <img src={lang.flag} alt={lang.name} className="w-5 h-3.5 object-cover rounded-sm" />
                      <span className="text-[10px] font-black">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t px-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center space-x-2 bg-secondary w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-red-900/20"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{t('nav.dashboard')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 bg-gray-50 hover:bg-red-50 hover:text-red-500 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 bg-secondary w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-red-900/20"
                  >
                    <User className="w-4 h-4" />
                    <span>{t('nav.login')}</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
