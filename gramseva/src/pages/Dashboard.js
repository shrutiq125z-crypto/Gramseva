import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { businessAPI } from '../services/api';
import BusinessCard from '../components/BusinessCard';
import LanguageToggle from '../components/LanguageToggle';
import { gsap } from 'gsap';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [bizLoading, setBizLoading] = useState(true);
  const [bizError, setBizError] = useState(null);
  const [role] = useState('Business Owner'); // For now, always show
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({ temp: 28, condition: 'Sunny', humidity: 65 });
  const ownerId = localStorage.getItem('userId');

  const businessSteps = [
    { label: t('createBusiness'), description: t('createBusinessDesc') },
    { label: t('addPerformance'), description: t('addPerformanceDesc') },
    { label: t('trackInvestments'), description: t('trackInvestmentsDesc') },
    { label: t('distributeProfits'), description: t('distributeProfitsDesc') },
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Initialize GSAP animations
    gsap.fromTo('.dashboard-header', 
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    
    gsap.fromTo('.stats-card', 
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)" }
    );

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Add demo notifications
    const demoNotifications = [
      {
        title: 'Welcome to Gramseva!',
        message: 'Your dashboard is ready. Explore the features and services available.',
        type: 'success'
      },
      {
        title: 'New Service Available',
        message: 'Birth certificate application is now available online.',
        type: 'info'
      },
      {
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Sunday 2 AM - 4 AM.',
        type: 'warning'
      }
    ];

    // Add notifications with delay
    demoNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification);
      }, (index + 1) * 1000);
    });

    async function fetchBusinesses() {
      setBizLoading(true);
      try {
        const data = await businessAPI.getAllBusinesses({ owner: ownerId });
        setBusinesses(data.businesses || []);
        setBizError(null);
      } catch (err) {
        setBizError('Failed to load your businesses');
      } finally {
        setBizLoading(false);
      }
    }
    fetchBusinesses();

    return () => clearInterval(timeInterval);
  }, [addNotification, ownerId]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const stats = [
    {
      title: t('totalCitizens'),
      value: '13',
      change: '+12%',
      changeType: 'positive',
      icon: '👥',
      color: 'from-blue-500 to-cyan-500',
      bgPattern: 'bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]',
      trend: [65, 70, 68, 75, 80, 85, 88]
    },
    {
      title: t('activeServices'),
      value: '8',
      change: '+3',
      changeType: 'positive',
      icon: '🛠️',
      color: 'from-green-500 to-emerald-500',
      bgPattern: 'bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.1),transparent_50%)]',
      trend: [15, 18, 20, 22, 24, 26, 24]
    },
    {
      title: t('documentRequests'),
      value: '9',
      change: '+156',
      changeType: 'positive',
      icon: '📋',
      color: 'from-orange-500 to-red-500',
      bgPattern: 'bg-[radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.1),transparent_50%)]',
      trend: [800, 900, 950, 1000, 1100, 1200, 1247]
    },
    {
      title: t('revenueGenerated'),
      value: '₹0.0L',
      change: '+18%',
      changeType: 'positive',
      icon: '💰',
      color: 'from-purple-500 to-pink-500',
      bgPattern: 'bg-[radial-gradient(circle_at_80%_60%,rgba(168,85,247,0.1),transparent_50%)]',
      trend: [2.1, 2.3, 2.5, 2.8, 3.2, 3.8, 4.2]
    }
  ];

  const recentActivities = [
    { id: 1, type: 'service', title: 'New birth certificate request from Priya Sharma', time: '2 hours ago', status: 'pending', priority: 'high' },
    { id: 2, type: 'payment', title: 'Property tax payment received - ₹15,000', time: '4 hours ago', status: 'completed', priority: 'medium' },
    { id: 3, type: 'complaint', title: 'Road repair complaint filed by Rajesh Kumar', time: '6 hours ago', status: 'in-progress', priority: 'high' },
    { id: 4, type: 'meeting', title: 'Monthly panchayat meeting scheduled for tomorrow', time: '1 day ago', status: 'scheduled', priority: 'medium' },
    { id: 5, type: 'document', title: 'New policy document uploaded - Digital India Initiative', time: '2 days ago', status: 'completed', priority: 'low' },
    { id: 6, type: 'service', title: 'Aadhar card application approved for 5 citizens', time: '3 days ago', status: 'completed', priority: 'medium' }
  ];

  const quickActions = [
    { title: 'Add Citizen', icon: '👤', color: 'from-blue-500 to-blue-600', href: '/documents', description: 'Register new citizen' },
    { title: 'Process Request', icon: '📝', color: 'from-green-500 to-green-600', href: '/documents', description: 'Handle applications' },
    { title: 'Generate Report', icon: '📊', color: 'from-purple-500 to-purple-600', href: '/dashboard', description: 'Create analytics' },
    { title: 'Schedule Meeting', icon: '📅', color: 'from-orange-500 to-orange-600', href: '/dashboard', description: 'Plan events' },
    { title: 'View Complaints', icon: '📢', color: 'from-red-500 to-red-600', href: '/dashboard', description: 'Manage issues' },
    { title: 'Financial Report', icon: '💳', color: 'from-indigo-500 to-indigo-600', href: '/dashboard', description: 'View finances' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'in-progress': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'scheduled': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Header */}
      <div className="dashboard-header relative z-10">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border-b border-white/20 dark:border-gray-700/30 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <div>
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent mb-2">
                      {t('welcome')}, {user?.username}! 👋
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">{t('hereIsHappening')}</p>
                  </div>
                </div>
                
                {/* Weather Widget */}
                <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/20 dark:border-gray-600/20">
                    <div className="text-2xl">☀️</div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{weatherData.temp}°C</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{weatherData.condition}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <div className="font-medium">Humidity: {weatherData.humidity}%</div>
                    <div>Last updated: {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col lg:items-end gap-4">
                <LanguageToggle />
                <div className="text-right bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20 dark:border-gray-600/20">
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">{t('lastUpdated')}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {currentTime.toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {currentTime.toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`stats-card group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 border border-white/20 dark:border-gray-700/30 overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Pattern */}
              <div className={`absolute inset-0 ${stat.bgPattern} opacity-50`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-2xl`}>
                    {stat.icon}
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                    stat.changeType === 'positive' 
                      ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30' 
                      : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                
                <div className="text-5xl font-black text-gray-900 dark:text-white mb-3 drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{stat.title}</div>
                
                {/* Mini Trend Chart */}
                <div className="flex items-end justify-between h-12 mb-2">
                  {stat.trend.map((value, i) => (
                    <div
                      key={i}
                      className={`flex-1 mx-0.5 bg-gradient-to-t ${stat.color} rounded-t-sm opacity-60 group-hover:opacity-100 transition-all duration-300`}
                      style={{ 
                        height: `${(value / Math.max(...stat.trend)) * 100}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">7-day trend</div>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
        {/* Enhanced Business Process Stepper */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Business Process</h2>
              <p className="text-gray-600 dark:text-gray-400">Follow these steps to manage your business effectively</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl text-lg font-bold shadow-lg">{role}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {businessSteps.map((step, idx) => (
              <div key={step.label} className="group relative">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-600">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-2xl font-bold text-white mb-4 shadow-lg text-2xl group-hover:scale-110 transition-transform duration-300 ${
                      idx === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 
                      idx === 1 ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 
                      idx === 2 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 
                      'bg-gradient-to-br from-green-500 to-green-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {step.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                {/* Connection Line */}
                {idx < businessSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Enhanced My Businesses Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/30 mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">My Businesses</h3>
              <p className="text-gray-600 dark:text-gray-400">Manage and monitor your business ventures</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              + Add Business
            </button>
          </div>
          
          {bizLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg text-gray-600 dark:text-gray-400">Loading businesses...</span>
              </div>
            </div>
          )}
          
          {bizError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
              <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">⚠️ Error Loading Businesses</div>
              <div className="text-red-500 dark:text-red-300">{bizError}</div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map(biz => <BusinessCard key={biz.id || biz._id} business={biz} />)}
          </div>
          
          {businesses.length === 0 && !bizLoading && !bizError && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-4xl">🏢</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Businesses Yet</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Start your entrepreneurial journey by creating your first business</p>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Create Your First Business
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Enhanced Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-3 text-3xl">⚡</span>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="group relative p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {action.icon}
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {action.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{action.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Enhanced Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="mr-3 text-3xl">📋</span>
                  Recent Activities
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Live Updates</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="group flex items-center space-x-4 p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-600"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-1">
                        {activity.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                View all activities →
              </button>
            </div>
          </div>
        </div>
        {/* Enhanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Revenue Chart */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3 text-3xl">📈</span>
                Revenue Overview
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Real-time</span>
              </div>
            </div>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-2xl border border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Revenue Analytics</div>
                <div className="text-gray-600 dark:text-gray-400 mb-4">Interactive charts coming soon</div>
                <div className="text-sm text-gray-500">Integration with Chart.js or D3.js</div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Citizen Demographics */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3 text-3xl">👥</span>
                Citizen Demographics
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">Updated today</div>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Male', percentage: 52, color: 'from-blue-500 to-blue-600', icon: '👨' },
                { label: 'Female', percentage: 48, color: 'from-pink-500 to-pink-600', icon: '👩' },
                { label: 'Children (0-18)', percentage: 35, color: 'from-green-500 to-green-600', icon: '👶' },
                { label: 'Adults (19-60)', percentage: 55, color: 'from-purple-500 to-purple-600', icon: '👤' },
                { label: 'Senior (60+)', percentage: 10, color: 'from-orange-500 to-orange-600', icon: '👴' }
              ].map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">{item.label}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 shadow-lg`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Enhanced User Profile Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl backdrop-blur-2xl border border-white/20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-2 drop-shadow-lg">Your Profile</h3>
                  <p className="text-white/90 text-xl">Manage your account settings and preferences</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Username</div>
                  <div className="font-bold text-2xl">{user?.username}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Email</div>
                  <div className="font-bold text-2xl">{user?.email}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Phone</div>
                  <div className="font-bold text-2xl">{user?.phoneNo}</div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/30">
                  Edit Profile
                </button>
                <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 border border-white/30">
                  Settings
                </button>
              </div>
            </div>
            
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center text-6xl font-black shadow-2xl border-4 border-white/40 mb-4">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-2xl font-bold">{user?.username}</div>
              <div className="text-white/70 text-lg">{user?.role || 'Citizen'}</div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Gramseva Dashboard</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Empowering digital governance for better citizen services</p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>© 2024 Gramseva</span>
              <span>•</span>
              <span>Version 2.0</span>
              <span>•</span>
              <span>Last updated: {currentTime.toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
