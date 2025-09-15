import React, { useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { gsap } from 'gsap';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const toggleRef = useRef(null);
  const sunRef = useRef(null);
  const moonRef = useRef(null);

  useEffect(() => {
    // Animate toggle on mount
    gsap.fromTo(toggleRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }
    );
  }, []);

  useEffect(() => {
    // Animate theme change
    if (isDark) {
      gsap.to(sunRef.current, {
        scale: 0,
        rotation: 180,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(moonRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
        delay: 0.1
      });
    } else {
      gsap.to(moonRef.current, {
        scale: 0,
        rotation: -180,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(sunRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
        delay: 0.1
      });
    }
  }, [isDark]);

  const handleToggle = () => {
    // Animate button press
    gsap.to(toggleRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
      onComplete: () => {
        toggleTheme();
      }
    });
  };

  return (
    <button
      ref={toggleRef}
      onClick={handleToggle}
      className="relative p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all duration-300 group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <svg
          ref={sunRef}
          className="absolute inset-0 w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>

        {/* Moon Icon */}
        <svg
          ref={moonRef}
          className="absolute inset-0 w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </div>
    </button>
  );
};

export default ThemeToggle;
