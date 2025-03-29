import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, message, Drawer } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  FileTextOutlined, 
  HomeOutlined, 
  FormOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BarsOutlined
} from '@ant-design/icons';
import { SetUser } from '../redux/usersSlice';

const { Header, Sider, Content } = Layout;

function Navigation({ children }) {
  const { user } = useSelector(state => state.users);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileDrawerOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(SetUser(null));
    message.success('Logged out successfully');
    navigate('/login');
  };

  // Create menu items for user dropdown
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/available-exams',
      icon: <FormOutlined />,
      label: 'Write Exam',
    },
    {
      key: '/user/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
    },
  ];

  // Add admin menu items if user is admin
  if (user?.isAdmin) {
    menuItems.push(
      {
        key: '/admin/exams',
        icon: <FormOutlined />,
        label: 'Exams',
      },
      {
        key: '/admin/reports',
        icon: <FileTextOutlined />,
        label: 'All Reports',
      }
    );
  }

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const renderSidebar = () => (
    <div className="sidebar-container">
      <div className="logo" style={{ 
        height: '64px', 
        margin: '16px', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: collapsed && !isMobile ? '14px' : '18px',
        color: 'var(--primary)'
      }}>
        {collapsed && !isMobile ? 'QA' : 'Quiz App'}
      </div>
      <Menu 
        theme="light" 
        mode="inline" 
        selectedKeys={[window.location.pathname]} 
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0 }}
      />
    </div>
  );

  return (
    <Layout className="app-layout">
      {!isMobile && (
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          theme="light"
          className="app-sider"
        >
          {renderSidebar()}
        </Sider>
      )}
      <Layout>
        <Header className="app-header">
          <div className="header-left">
            {isMobile ? (
              <Button
                type="text"
                icon={<BarsOutlined />}
                onClick={() => setMobileDrawerOpen(true)}
                className="mobile-menu-button"
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="desktop-menu-button"
              />
            )}
            <span className="header-title">
              {isMobile && 'Quiz App'}
            </span>
          </div>
          
          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className="user-profile-dropdown">
                <Avatar style={{ backgroundColor: 'var(--primary)' }} icon={<UserOutlined />} />
                {!isMobile && (
                  <span className="user-name">
                    {user?.name || 'User'}
                  </span>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="app-content">
          {children}
        </Content>
      </Layout>

      {isMobile && (
        <Drawer
          title="Quiz App"
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          bodyStyle={{ padding: 0 }}
          headerStyle={{ 
            background: 'var(--primary)',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {renderSidebar()}
        </Drawer>
      )}

      <style jsx="true">{`
        .app-layout {
          min-height: 100vh;
        }

        .app-sider {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          overflow: auto;
          height: 100vh;
          position: sticky;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        .app-header {
          padding: 0 16px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 999;
          height: 64px;
        }

        .app-content {
          margin: 16px;
          padding: 16px;
          background: #fff;
          border-radius: 8px;
          overflow: auto;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .header-title {
          font-weight: bold;
          font-size: 18px;
          color: var(--primary);
          margin-left: 12px;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .user-profile-dropdown {
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .user-name {
          margin-left: 10px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .app-content {
            margin: 8px;
            padding: 12px;
          }
        }

        @media (max-width: 480px) {
          .app-content {
            margin: 4px;
            padding: 8px;
          }
        }
      `}</style>
    </Layout>
  );
}

export default Navigation;