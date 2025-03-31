import React from 'react';
import { Layout } from 'antd';
import { useTheme } from '../contexts/ThemeContext';

const { Content } = Layout;

function AppContent({ children }) {
  // Use ThemeContext instead of Redux
  const { currentTheme } = useTheme();

  return (
    <Content className={`app-content ${currentTheme === 'dark' ? 'dark' : 'light'}`}>
      {children}
    </Content>
  );
}

export default AppContent;