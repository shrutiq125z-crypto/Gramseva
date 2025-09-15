import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

const Landingpage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const { theme, isDark } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      title: 'Total Citizens',
      value: '12,450',
      change: '+12%',
      changeType: 'positive',
      icon: '👥',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Services',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: '🛠️',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Document Requests',
      value: '156',
      change: '+23',
      changeType: 'positive',
      icon: '📋',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Revenue Generated',
      value: '₹2.4L',
      change: '+18%',
      changeType: 'positive',
      icon: '💰',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const features = [
    { 
      title: 'Document Services', 
      description: 'Apply for Aadhar, PAN, Driving License, and more',
      icon: '📄', 
      color: 'bg-blue-500',
      requiresAuth: true,
      path: '/documents'
    },
    { 
      title: 'Business Management', 
      description: 'Create and manage your business ventures',
      icon: '🏢', 
      color: 'bg-green-500',
      requiresAuth: true,
      path: '/business'
    },
    { 
      title: 'Investment Tracking', 
      description: 'Monitor your investments and returns',
      icon: '💰', 
      color: 'bg-purple-500',
      requiresAuth: true,
      path: '/investments'
    },
    { 
      title: 'News & Updates', 
      description: 'Stay updated with latest news and announcements',
      icon: '📰', 
      color: 'bg-orange-500',
      requiresAuth: false,
      path: '/news'
    },
    { 
      title: 'Weather Forecast', 
      description: 'Check weather conditions for your area',
      icon: '🌤️', 
      color: 'bg-cyan-500',
      requiresAuth: false,
      path: '/weather'
    },
    { 
      title: 'Support Chat', 
      description: 'Get instant help from our support team',
      icon: '💬', 
      color: 'bg-pink-500',
      requiresAuth: false,
      external: true,
      href: 'https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/09/12/14/20250912140918-VJ1TOX7V.json'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'service', title: 'New birth certificate request', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'payment', title: 'Property tax payment received', time: '4 hours ago', status: 'completed' },
    { id: 3, type: 'complaint', title: 'Road repair complaint filed', time: '6 hours ago', status: 'in-progress' },
    { id: 4, type: 'meeting', title: 'Monthly panchayat meeting scheduled', time: '1 day ago', status: 'scheduled' },
    { id: 5, type: 'document', title: 'New policy document uploaded', time: '2 days ago', status: 'completed' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'in-progress': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'scheduled': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'service': return '🛠️';
      case 'payment': return '💰';
      case 'complaint': return '📢';
      case 'meeting': return '👥';
      case 'document': return '📄';
      default: return '📋';
    }
  };

  const handleFeatureClick = (feature) => {
    if (feature.requiresAuth && !user) {
      addNotification({
        title: 'Sign In Required',
        message: 'Please sign in to access this feature',
        type: 'warning'
      });
      navigate('/auth');
      return;
    }
    
    if (feature.external) {
      window.open(feature.href, '_blank');
    } else {
      navigate(feature.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {user ? `Welcome back, ${user.username}! 👋` : 'Welcome to Gramseva! 🏛️'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {user ? "Here's what's happening in your panchayat today" : "Your digital gateway to government services and community management"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="text-right">
                  <div className="text-sm text-gray-500">Last login</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-1 border border-white/50 animate-fade-in-up ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                onClick={() => handleFeatureClick(feature)}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-1 border border-white/50 cursor-pointer animate-fade-in-up ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} ${
                  feature.requiresAuth && !user ? 'opacity-75' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  {feature.requiresAuth && !user && (
                    <div className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      Sign In Required
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">
                    {feature.requiresAuth && !user ? 'Sign in to access' : 'Access Service'}
                  </span>
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors duration-300">
                    <span className="text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">→</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Access */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-soft border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Access
              </h3>
              <div className="space-y-4">
                {features.slice(0, 4).map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => handleFeatureClick(feature)}
                    className={`group relative w-full p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-medium ${
                      feature.requiresAuth && !user ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${feature.color} rounded-lg flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{feature.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</div>
                      </div>
                      {feature.requiresAuth && !user && (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">🔒</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-soft border border-white/50 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-2">📊</span>
                System Status
              </h3>
              <div className="space-y-4">
                {[
                  { service: 'Document Services', status: 'operational', uptime: '99.9%' },
                  { service: 'Business Management', status: 'operational', uptime: '99.8%' },
                  { service: 'Payment Gateway', status: 'operational', uptime: '99.7%' },
                  { service: 'Support System', status: 'operational', uptime: '100%' },
                  { service: 'News & Updates', status: 'operational', uptime: '99.9%' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.service}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Uptime: {item.uptime}</div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium capitalize">{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">All systems operational</span>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">Last updated: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-8 text-white animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">
                {user ? 'Ready to get started?' : 'Join Gramseva Today!'}
              </h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                {user 
                  ? 'Access all your services and manage your account from one place'
                  : 'Experience seamless government services and community management at your fingertips'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Go to Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Manage Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Sign Up Now
                    </Link>
                    <Link
                      to="/auth"
                      className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landingpage;
