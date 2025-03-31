import React from 'react';
import { Button } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '@contexts/ThemeContext';
import { motion } from 'framer-motion';

/**
 * DarkModeToggle - A component for toggling between light and dark mode
 * Uses framer-motion for smooth transitions and animations
 */
const DarkModeToggle = ({ className = '' }) => {
  const { currentTheme, toggleTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <Button
      type="text"
      onClick={toggleTheme}
      className={`p-2 flex justify-center items-center rounded-full ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      icon={
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <BulbOutlined className="text-lg text-yellow-400" />
          ) : (
            <BulbFilled className="text-lg text-yellow-500" />
          )}
        </motion.div>
      }
    />
  );
};

export default DarkModeToggle;