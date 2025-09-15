import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6 animate-fade-in">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                  Gramseva
                </span>
                <div className="text-sm text-gray-400 font-medium">Digital Governance Platform</div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-8 max-w-lg text-lg leading-relaxed animate-fade-in-up">
              Empowering gram panchayats with cutting-edge digital solutions. 
              Streamline operations, enhance transparency, and serve your community with modern technology.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {[
                { name: 'Facebook', icon: '📘', href: '#' },
                { name: 'Twitter', icon: '🐦', href: '#' },
                { name: 'LinkedIn', icon: '💼', href: '#' },
                { name: 'Instagram', icon: '📷', href: '#' },
                { name: 'YouTube', icon: '📺', href: '#' }
              ].map((social, index) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="group relative w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl hover:bg-primary-500/20 hover:scale-110 transition-all duration-300"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-accent-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-display font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/', icon: '🏠' },
                { name: 'Dashboard', path: '/dashboard', icon: '📊' },
                { name: 'News', path: '/news', icon: '📰' },
                { name: 'Weather', path: '/weather', icon: '🌤️' },
                { name: 'About Us', path: '#', icon: 'ℹ️' }
              ].map((link, index) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </span>
                    <span className="group-hover:font-medium">{link.name}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-display font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Services
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Citizen Services', icon: '👥' },
                { name: 'Document Management', icon: '📄' },
                { name: 'Complaint System', icon: '📝' },
                { name: 'Financial Management', icon: '💰' },
                { name: 'E-Governance', icon: '🏛️' }
              ].map((service, index) => (
                <li key={service.name}>
                  <a 
                    href="#" 
                    className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </span>
                    <span className="group-hover:font-medium">{service.name}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 pt-8 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-display font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-6">
              Get the latest updates and announcements delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold hover:shadow-glow hover:scale-105 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>&copy; {currentYear} Gramseva. All rights reserved.</p>
              <p className="mt-1">Made with ❤️ for better governance</p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              {[
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms of Service', href: '#' },
                { name: 'Cookie Policy', href: '#' },
                { name: 'Contact Us', href: '#' }
              ].map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors hover:underline"
                  style={{ animationDelay: `${1.1 + index * 0.1}s` }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-primary-500/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-accent-500/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-secondary-500/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </footer>
  );
};

export default Footer;
