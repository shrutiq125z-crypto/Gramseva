import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add custom cursor effects
    const addCursorEffects = () => {
      const cursor = document.createElement('div');
      cursor.className = 'fixed w-6 h-6 bg-primary-500/20 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100 ease-out';
      cursor.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(cursor);

      const updateCursor = (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      };

      const addHoverEffect = () => {
        const hoverElements = document.querySelectorAll('a, button, [role="button"]');
        hoverElements.forEach(el => {
          el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
          });
          el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
          });
        });
      };

      document.addEventListener('mousemove', updateCursor);
      addHoverEffect();

      return () => {
        document.removeEventListener('mousemove', updateCursor);
        cursor.remove();
      };
    };

    // Only add cursor effects on desktop
    if (window.innerWidth > 768) {
      const cleanup = addCursorEffects();
      return cleanup;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-hero-pattern opacity-5 dark:opacity-10 pointer-events-none"></div>
      
      {/* Gradient Overlays */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-primary-50/30 dark:from-primary-900/20 to-transparent pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-full h-96 bg-gradient-to-t from-accent-50/30 dark:from-accent-900/20 to-transparent pointer-events-none"></div>
      
      <Navbar />
      <main className="flex-1 relative z-10 pt-20">
        {children}
      </main>
      <Footer />
      
      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-110 z-40 group"
        style={{ display: window.scrollY > 300 ? 'block' : 'none' }}
      >
        <span className="group-hover:scale-110 transition-transform duration-300">↑</span>
      </button>
    </div>
  );
};

export default Layout;
