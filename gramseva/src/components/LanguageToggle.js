import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Add custom CSS for maximum z-index and animations
const languageToggleStyles = `
  .language-toggle-container {
    z-index: 9999 !important;
    position: relative !important;
  }
  .language-dropdown {
    z-index: 9999 !important;
    position: absolute !important;
  }
  @keyframes slideInFromLeft {
    0% {
      opacity: 0;
      transform: translateX(-20px) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  @keyframes slideInFromRight {
    0% {
      opacity: 0;
      transform: translateX(20px) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  .language-option {
    animation: slideInFromLeft 0.3s ease-out forwards;
  }
  .language-option:nth-child(1) { animation-delay: 0s; }
  .language-option:nth-child(2) { animation-delay: 0.1s; }
  .language-option:nth-child(3) { animation-delay: 0.2s; }
`;

const LanguageToggle = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <>
      <style>{languageToggleStyles}</style>
      <div className="relative language-toggle-container" style={{ zIndex: 9999 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-soft hover:shadow-medium"
          style={{ zIndex: 9999 }}
        >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLanguage?.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            style={{ zIndex: 9998 }}
          />
          
          {/* Dropdown */}
          <div 
            className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 ease-out language-dropdown sm:right-full sm:top-0 sm:mt-0 sm:mr-2"
            style={{ zIndex: 9999, position: 'absolute' }}
          >
            <div className="flex items-center space-x-1 p-2">
              {languages.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`group relative flex flex-col items-center space-y-1 px-4 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md language-option ${
                    language === lang.code
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-md scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {lang.flag}
                  </span>
                  <span className="text-xs font-medium whitespace-nowrap">
                    {lang.name}
                  </span>
                  {language === lang.code && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-2 h-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      </div>
    </>
  );
};

export default LanguageToggle;
