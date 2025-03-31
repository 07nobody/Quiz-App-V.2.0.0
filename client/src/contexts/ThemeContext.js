import React, { createContext, useState, useContext, useEffect } from 'react';
// Import Ant Design theme algorithms
import { theme } from 'antd';

const ThemeContext = createContext({
  currentTheme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  getAntTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  
  // Initialize theme from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('quizAppTheme') || 'light';
    setCurrentTheme(savedTheme);
    
    // Apply theme to body
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
  }, []);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  // Set theme explicitly
  const setTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('quizAppTheme', theme);
    document.body.classList.toggle('dark-theme', theme === 'dark');
  };
  
  // Get Ant Design theme configuration to match our CSS variables
  const getAntTheme = () => {
    return {
      token: {
        colorPrimary: currentTheme === 'light' ? '#0F3460' : '#1e40af', // Match our CSS variables
        colorBgContainer: currentTheme === 'light' ? '#ffffff' : '#0f172a',
        colorText: currentTheme === 'light' ? '#1e293b' : '#f1f5f9',
        borderRadius: 8
      },
      components: {
        Button: {
          colorPrimary: currentTheme === 'light' ? '#0F3460' : '#1e40af'
        },
        Input: {
          colorBgContainer: currentTheme === 'light' ? '#ffffff' : '#0f172a',
        }
      },
      // Use the proper algorithm function
      algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
    };
  };
  
  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, setTheme, getAntTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;