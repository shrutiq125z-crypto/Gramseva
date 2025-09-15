import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Debug: Log user state
  console.log('Navbar - User state:', user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', requiresAuth: true, icon: '📊' },
    { name: 'News', path: '/news', requiresAuth: false, icon: '📰' },
    { name: 'Weather', path: '/weather', requiresAuth: false, icon: '🌤️' },
    { name: 'Crop Prices', path: '/crop-prices', requiresAuth: false, icon: '🌾' },
    { name: 'Documents', path: '/documents', requiresAuth: false, icon: '📄' },
    { name: 'Schemes', path: '/schemes', requiresAuth: false, icon: '🏛️' },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.requiresAuth || user
  );

  return (
    <>
      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-soft border-b border-white/20 dark:border-gray-700/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group animate-fade-in"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Gramseva
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Digital Governance</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {filteredNavItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 animate-fade-in-up ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              ))}
              {/* Service Button */}
              <a
                href="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/09/12/14/20250912140918-VJ1TOX7V.json"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 animate-fade-in-up text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20"
                style={{ animationDelay: `${filteredNavItems.length * 0.1}s` }}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">💬</span>
                  <span>Support</span>
                </span>
              </a>
            </div>

            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-4 animate-fade-in">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Notification Bell */}
              <NotificationBell />
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Profile Icon */}
                  <Link
                    to="/profile"
                    className="group relative p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all duration-300"
                    title="View Profile"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-semibold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      View Profile
                    </div>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="group relative px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-medium hover:scale-105 overflow-hidden"
                    title="Logout"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>🚪</span>
                      <span>Logout</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="group relative px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl text-sm font-semibold transition-all duration-300 hover:shadow-glow hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>🔐</span>
                    <span>Get Started</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Theme Toggle */}
              <ThemeToggle />
              
              {/* Mobile Notification Bell */}
              <NotificationBell />
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 text-gray-700 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-300"
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-current mt-1 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-white/20 dark:border-gray-700/20 shadow-large">
            <div className="px-4 py-6 space-y-2">
              {filteredNavItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 animate-fade-in-up ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              {/* Service Button (Mobile) */}
              <a
                href="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/09/12/14/20250912140918-VJ1TOX7V.json"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 animate-fade-in-up text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20"
                style={{ animationDelay: `${filteredNavItems.length * 0.1}s` }}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">💬</span>
                <span>Service</span>
              </a>
              
              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                {user ? (
                  <div className="space-y-3">
                    {/* Profile Link */}
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">View Profile</div>
                      </div>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-300"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl text-base font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-medium transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>🔐</span>
                    <span>Get Started</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
