import React, { useEffect, useState } from 'react';
import { Switch, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const DarkModeToggle = ({ className }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check user preference from local storage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      applyDarkMode(true);
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      applyDarkMode(false);
    } else if (prefersDarkScheme) {
      setIsDarkMode(true);
      applyDarkMode(true);
    }
  }, []);

  const applyDarkMode = (dark) => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark-mode');
    }
  };

  const toggleTheme = (checked) => {
    setIsDarkMode(checked);
    applyDarkMode(checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
    
    // Dispatch custom event for other components that need to know about theme changes
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: checked ? 'dark' : 'light' } 
    }));
  };

  return (
    <Tooltip 
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      placement="bottom"
    >
      <div className={`dark-mode-toggle ${className || ''}`}>
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren={<BulbOutlined />}
          unCheckedChildren={<BulbFilled />}
          className="theme-switch"
        />
      </div>
    </Tooltip>
  );
};

export default DarkModeToggle;