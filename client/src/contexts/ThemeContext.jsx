import React, { createContext, useState, useContext, useEffect } from 'react';
import { STORAGE_KEYS } from '@constants';

// Create the context
const ThemeContext = createContext();

/**
 * ThemeProvider component to manage theme state
 * Handles theme switching and persistence
 */
export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or default to system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };
  
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme);

  // Apply theme class to document and store in localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes
    root.classList.remove('dark', 'light');
    // Add the current theme class
    root.classList.add(currentTheme);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
  }, [currentTheme]);
  
  // Handle media query changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Only apply if user hasn't set a preference
    const handleChange = () => {
      if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    setCurrentTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  
  // Set specific theme
  const setTheme = (theme) => {
    if (theme === 'dark' || theme === 'light') {
      setCurrentTheme(theme);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;