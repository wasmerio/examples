/**
 * ModeToggle Component
 * 
 * Toggle between light and dark modes for the current theme.
 * 
 * Architecture Decision: This is a React component for client-side interactivity,
 * but it uses the framework-agnostic theme utilities. The mode system is separate
 * from the theme system - you can have any color theme in light or dark mode.
 * 
 * This component demonstrates how to build interactive UI on top of the theme system
 * without coupling the theme system itself to React.
 */

import { useEffect, useState } from 'react';
import { getMode, setMode, type Mode } from '../utils/themes';

export default function ModeToggle() {
  const [currentMode, setCurrentMode] = useState<Mode>('light');

  useEffect(() => {
    // Initialize mode on mount
    const mode = getMode();
    setCurrentMode(mode);
    
    // Listen for mode changes
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.mode) {
        setCurrentMode(customEvent.detail.mode);
      } else {
        setCurrentMode(getMode());
      }
    };
    
    // Listen for Astro page load events (for view transitions)
    const handlePageLoad = () => {
      const mode = getMode();
      setCurrentMode(mode);
    };
    
    window.addEventListener('modechange', handleModeChange);
    document.addEventListener('astro:page-load', handlePageLoad);
    document.addEventListener('astro:after-swap', handlePageLoad);
    
    return () => {
      window.removeEventListener('modechange', handleModeChange);
      document.removeEventListener('astro:page-load', handlePageLoad);
      document.removeEventListener('astro:after-swap', handlePageLoad);
    };
  }, []);

  const handleToggle = () => {
    const newMode: Mode = currentMode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    setCurrentMode(newMode);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="p-2 rounded-lg transition-colors cursor-pointer"
      style={{
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--token-color-hover, rgba(0, 0, 0, 0.05))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      aria-label={`Switch to ${currentMode === 'light' ? 'dark' : 'light'} mode`}
      title={`Current mode: ${currentMode}`}
    >
      {currentMode === 'light' ? (
        // Moon icon for dark mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2" />
          <path d="M12 21v2" />
          <path d="m4.22 4.22 1.42 1.42" />
          <path d="m18.36 18.36 1.42 1.42" />
          <path d="M1 12h2" />
          <path d="M21 12h2" />
          <path d="m4.22 19.78 1.42-1.42" />
          <path d="m18.36 5.64 1.42-1.42" />
        </svg>
      )}
    </button>
  );
}
