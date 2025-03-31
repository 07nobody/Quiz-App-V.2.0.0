import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Drawer, Badge, Tooltip } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  FileTextOutlined, 
  HomeOutlined, 
  FormOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BarsOutlined,
  BellOutlined,
  SettingOutlined,
  BookOutlined,
  TrophyOutlined,
  TeamOutlined,
  ReadOutlined,
  StarOutlined
} from '@ant-design/icons';
import { SetUser } from '../redux/usersSlice';
import BottomNav from './BottomNav';
import DarkModeToggle from './DarkModeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { useMessage } from './MessageProvider';

const { Header, Sider, Content } = Layout;

function Navigation({ children }) {
  const { user } = useSelector(state => state.users);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { currentTheme } = useTheme();
  const message = useMessage(); // Use the optimized message provider
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Throttle resize handler to prevent excessive updates
  const handleResize = useCallback(() => {
    // Use requestAnimationFrame to align with browser paint cycle
    requestAnimationFrame(() => {
      const mobile = window.innerWidth <= 768;
      const tablet = window.innerWidth <= 1024 && window.innerWidth > 768;
      
      // Only update state if values actually changed
      if (mobile !== isMobile) {
        setIsMobile(mobile);
      }
      
      if (tablet !== isTablet) {
        setIsTablet(tablet);
      }
      
      if (!mobile && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
      
      // Auto-collapse sidebar on tablet
      if (tablet !== isTablet) {
        setCollapsed(tablet);
      }
    });
  }, [isMobile, isTablet, mobileDrawerOpen]);

  useEffect(() => {
    // Throttled event listener for resize
    let resizeTimer;
    const throttledResize = () => {
      if (!resizeTimer) {
        resizeTimer = setTimeout(() => {
          resizeTimer = null;
          handleResize();
        }, 100);
      }
    };

    window.addEventListener('resize', throttledResize);
    
    // Set initial notification count (can be replaced with actual API call)
    setNotificationCount(Math.floor(Math.random() * 5));

    return () => window.removeEventListener('resize', throttledResize);
  }, [handleResize]);

  const handleMenuClick = useCallback(({ key }) => {
    navigate(key);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [navigate, isMobile]);

  // Memoize user menu items to prevent recreating on each render
  const userMenuItems = useMemo(() => {
    const handleLogout = () => {
      localStorage.removeItem('token');
      dispatch(SetUser(null));
      message.success('Logged out successfully');
      navigate('/login');
    };
    
    return [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
        onClick: () => navigate('/profile')
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
        onClick: () => navigate(user?.isAdmin ? '/admin/settings' : '/user/settings')
      },
      {
        type: 'divider'
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
        danger: true
      }
    ];
  }, [navigate, user, dispatch, message]);

  const siderWidth = collapsed ? 80 : 250;
  
  // Only re-render menu items when user role changes
  const menuItems = useMemo(() => {
    const items = [
      {
        key: '/',
        icon: <HomeOutlined />,
        label: 'Home',
      },
    ];

    if (user?.isAdmin) {
      items.push(
        {
          key: '/admin/exams',
          icon: <FormOutlined />,
          label: 'Exams',
        },
        {
          key: '/admin/reports',
          icon: <FileTextOutlined />,
          label: 'Reports',
        },
        {
          key: '/admin/users',
          icon: <TeamOutlined />,
          label: 'Users',
        },
        {
          key: '/admin/settings',
          icon: <SettingOutlined />,
          label: 'Settings',
        }
      );
    } else {
      items.push(
        {
          key: '/available-exams',
          icon: <BookOutlined />,
          label: 'Exams',
        },
        {
          key: '/user/reports',
          icon: <FileTextOutlined />,
          label: 'Reports',
        },
        {
          key: '/leaderboard',
          icon: <TrophyOutlined />,
          label: 'Leaderboard',
        },
        {
          key: '/study-room',
          icon: <ReadOutlined />,
          label: 'Study Room',
        },
        {
          key: '/flashcards',
          icon: <StarOutlined />,
          label: 'Flashcards',
        },
        {
          key: '/user/settings',
          icon: <SettingOutlined />,
          label: 'Settings'
        }
      );
    }
    
    return items;
  }, [user?.isAdmin]);

  // Memoize the sidebar component to prevent unnecessary rerenders
  const renderSidebar = useCallback(() => (
    <div>
      <div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {collapsed && !isMobile ? 'QA' : 'Quiz App'}
        </motion.div>
      </div>
      
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['/']}
        selectedKeys={[window.location.pathname]}
        onClick={handleMenuClick}
        items={menuItems}
      />
      
      <div>
        &copy; {new Date().getFullYear()} Quiz App
      </div>
    </div>
  ), [collapsed, isMobile, menuItems, handleMenuClick]);

  return (
    <Layout>
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={siderWidth}
        >
          {renderSidebar()}
        </Sider>
      )}
      <Layout>
        <Header>
          <div>
            {isMobile ? (
              <Button
                type="text"
                icon={<BarsOutlined />}
                onClick={() => setMobileDrawerOpen(true)}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
            <span>
              {isMobile && (
                <motion.span
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Quiz App
                </motion.span>
              )}
            </span>
          </div>
          
          <div>
            <div>
              <DarkModeToggle />
            </div>
            
            <Tooltip title="Notifications">
              <Badge count={notificationCount} size="small">
                <Avatar 
                  shape="circle" 
                  icon={<BellOutlined />}
                />
              </Badge>
            </Tooltip>
            
            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight" 
              arrow
              trigger={['click']}
            >
              <div>
                <Avatar 
                  size="default" 
                  icon={<UserOutlined />}
                />
                <span>{user?.name?.split(' ')[0]}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Content>
        
        {/* Bottom navigation for mobile */}
        {isMobile && <BottomNav />}
      </Layout>

      {isMobile && (
        <Drawer
          title={
            <div>
              <span>Quiz App</span>
              <Badge status="success" />
            </div>
          }
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          width={280}
        >
          {renderSidebar()}
        </Drawer>
      )}
    </Layout>
  );
}

export default React.memo(Navigation);