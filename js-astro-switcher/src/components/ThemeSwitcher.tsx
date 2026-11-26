/**
 * ThemeSwitcher Component
 * 
 * Interactive theme selection component. This is a React component because it needs
 * client-side interactivity (dropdown, state management).
 * 
 * Architecture Decision: We use React here (not Astro) because:
 * 1. Needs client-side state (isOpen, currentTheme)
 * 2. Needs event listeners for theme changes
 * 3. Needs to react to Astro view transitions
 * 
 * However, the theme system itself (src/themes/) is framework-agnostic.
 * This component is just a UI wrapper around the theme utilities.
 * 
 * Separation of Concerns:
 * - Theme logic: src/themes/utils.ts (framework-agnostic)
 * - UI logic: This component (React for interactivity)
 * - Bridge: src/utils/themes.ts (convenience API)
 */

import { useEffect, useState } from 'react';
import { getTheme, setTheme, getAvailableThemes, getThemeNames, type ThemeId } from '../utils/themes';
import { getThemeById } from '../themes';

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('blue');
  const [isOpen, setIsOpen] = useState(false);
  const themes = getAvailableThemes();
  const themeNames = getThemeNames();

  useEffect(() => {
    // Initialize theme on mount
    const theme = getTheme();
    setCurrentTheme(theme);
    
    // Listen for theme changes from other components
    const handleStorageChange = () => {
      const newTheme = getTheme();
      setCurrentTheme(newTheme);
    };
    
    // Listen for Astro page load events (for view transitions)
    const handlePageLoad = () => {
      const newTheme = getTheme();
      setCurrentTheme(newTheme);
      // Ensure theme is applied after navigation
      setTheme(newTheme);
    };
    
    // Listen for custom themechange event
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.theme) {
        setCurrentTheme(customEvent.detail.theme);
      } else {
        handleStorageChange();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themechange', handleThemeChange);
    document.addEventListener('astro:page-load', handlePageLoad);
    document.addEventListener('astro:after-swap', handlePageLoad);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themechange', handleThemeChange);
      document.removeEventListener('astro:page-load', handlePageLoad);
      document.removeEventListener('astro:after-swap', handlePageLoad);
    };
  }, []);

  const handleThemeChange = (themeId: ThemeId) => {
    setTheme(themeId);
    setCurrentTheme(themeId);
    setIsOpen(false);
  };

  const getThemeColor = (themeId: ThemeId): string => {
    const theme = getThemeById(themeId);
    return theme?.tokens.color.primary || '#000000';
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--token-color-text-primary, #111827)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--token-color-hover, rgba(0, 0, 0, 0.05))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label={`Current theme: ${themeNames[currentTheme] || currentTheme}. Click to change theme.`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div
          className="w-4 h-4 rounded-full border flex-shrink-0"
          style={{
            backgroundColor: getThemeColor(currentTheme),
            borderColor: 'var(--token-color-border, #e5e7eb)',
          }}
        />
        <span className="hidden sm:inline">{themeNames[currentTheme] || currentTheme}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-48 rounded-lg shadow-lg z-20"
            style={{
              backgroundColor: 'var(--token-color-background, #ffffff)',
              border: '1px solid var(--token-color-border, #e5e7eb)',
              boxShadow: 'var(--token-shadow-3, 0 4px 6px -1px rgb(0 0 0 / 0.1))',
            }}
          >
            <div className="p-2">
              {themes.map((themeId) => (
                <button
                  key={themeId}
                  type="button"
                  onClick={() => handleThemeChange(themeId)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer"
                  style={{
                    backgroundColor: currentTheme === themeId 
                      ? 'var(--token-color-accent, rgba(0, 0, 0, 0.05))' 
                      : 'transparent',
                    color: 'var(--token-color-text-primary, #111827)',
                  }}
                  onMouseEnter={(e) => {
                    if (currentTheme !== themeId) {
                      e.currentTarget.style.backgroundColor = 'var(--token-color-hover, rgba(0, 0, 0, 0.05))';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentTheme !== themeId) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{
                        backgroundColor: getThemeColor(themeId),
                        borderColor: 'var(--token-color-border, #e5e7eb)',
                      }}
                    />
                    <span>{themeNames[themeId]}</span>
                    {currentTheme === themeId && (
                      <svg
                        className="w-4 h-4 ml-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
