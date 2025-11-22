import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FloatingThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="테마 전환"
      className={`
        fixed bottom-6 right-6 z-[9999]
        w-[54px] h-[54px] rounded-full
        flex items-center justify-center
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]
        drop-shadow-md
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500
        ${theme === 'dark' 
          ? 'bg-gray-800 text-yellow-400 border border-gray-700' 
          : 'bg-white text-slate-700 border border-slate-200'}
      `}
    >
      {theme === 'dark' ? (
        // Sun Icon for Dark Mode
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-6 h-6 animate-fade-in" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Moon Icon for Light Mode
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-6 h-6 animate-fade-in" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  );
};

export default FloatingThemeToggle;
