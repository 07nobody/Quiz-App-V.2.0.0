import React from 'react';
import { Layout } from 'antd';
import { useTheme } from '../contexts/ThemeContext';

const { Content } = Layout;

// Using React.memo to optimize rendering
const AppContent = React.memo(({ children }) => {
  // Use our ThemeContext instead of Redux for theme
  const { currentTheme } = useTheme();

  return (
    <Content 
      className={`
        m-4 md:m-4 lg:m-4 p-4 md:p-4 lg:p-4
        bg-background-primary dark:bg-background-secondary
        text-text-primary dark:text-text-primary
        rounded-lg overflow-auto shadow transition-all duration-300 ease-in-out
      `}
    >
      {children}
    </Content>
  );
});

// Add displayName for better debugging
AppContent.displayName = 'AppContent';

export default AppContent;
