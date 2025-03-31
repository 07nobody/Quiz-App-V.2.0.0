import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  HomeOutlined,
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
  TrophyOutlined,
  RocketOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

/**
 * Mobile bottom navigation component
 * Shows different navigation options based on user role
 */
const BottomNav = () => {
  const location = useLocation();
  const { user } = useSelector(state => state.users);
  const { currentTheme } = useTheme();
  
  // Don't show bottom nav on login, register, or exam pages
  if (!user || 
      location.pathname.includes('login') || 
      location.pathname.includes('register') || 
      location.pathname.includes('write-exam')) {
    return null;
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.includes(path)) return true;
    return false;
  };
  
  const renderNavItems = () => {
    // Common nav items for all users
    const commonItems = [
      {
        path: '/',
        icon: <HomeOutlined />,
        label: 'Home'
      },
      {
        path: '/profile',
        icon: <UserOutlined />,
        label: 'Profile'
      }
    ];
    
    // Admin specific nav items
    const adminItems = [
      {
        path: '/admin/exams',
        icon: <AppstoreOutlined />,
        label: 'Exams'
      },
      {
        path: '/admin/reports',
        icon: <FileTextOutlined />,
        label: 'Reports'
      }
    ];
    
    // Regular user specific nav items
    const userItems = [
      {
        path: '/available-exams',
        icon: <RocketOutlined />,
        label: 'Exams'
      },
      {
        path: '/user/reports',
        icon: <TrophyOutlined />,
        label: 'Results'
      }
    ];
    
    // Return appropriate nav items based on user role
    return [
      ...commonItems,
      ...(user.isAdmin ? adminItems : userItems)
    ].map((item) => {
      const isActiveItem = isActive(item.path);
      
      return (
        <Link 
          key={item.path} 
          to={item.path} 
          className={`bottom-nav-item ${isActiveItem ? 'active' : ''}`}
          aria-current={isActiveItem ? 'page' : undefined}
        >
          <motion.div 
            className="bottom-nav-icon"
            animate={isActiveItem ? { y: -5, scale: 1.2 } : { y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {item.icon}
          </motion.div>
          <motion.div 
            className="bottom-nav-label"
            animate={isActiveItem ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.label}
          </motion.div>
          {isActiveItem && (
            <motion.div 
              className="active-indicator" 
              layoutId="activeIndicator"
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </Link>
      );
    });
  };

  return (
    <div className="bottom-nav">
      {renderNavItems()}
      
      <style jsx="true">{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          background-color: var(--card-background);
          box-shadow: 0 -2px 10px rgba(0, 0, 0, ${currentTheme === 'dark' ? '0.3' : '0.08'});
          z-index: 1000;
          border-top: 1px solid var(--border-color);
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          color: var(--text-secondary);
          text-decoration: none;
          position: relative;
          padding: 12px 0;
          transition: color 0.3s;
        }

        .bottom-nav-item.active {
          color: var(--primary);
        }

        .bottom-nav-icon {
          font-size: 1.3rem;
          margin-bottom: 4px;
        }

        .bottom-nav-label {
          font-size: 0.7rem;
          font-weight: 500;
        }

        .active-indicator {
          position: absolute;
          bottom: 0;
          width: 50%;
          height: 3px;
          background-color: var(--primary);
          border-radius: 8px 8px 0 0;
        }
      `}</style>
    </div>
  );
};

export default BottomNav;