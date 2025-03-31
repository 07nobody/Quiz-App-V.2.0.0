import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';

const { Header, Sider, Content } = Layout;

/**
 * MainLayout - Application's main layout component with responsive sidebar
 * Provides consistent layout across all authenticated pages
 */
const MainLayout = ({ children, menuItems = [], title = "Quiz App" }) => {
  const { currentTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.users);

  const selectedKey = menuItems.find(
    item => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  )?.key || '1';

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
        className="h-screen fixed left-0 top-0 z-20 shadow-lg"
      >
        <div className="p-4 h-16 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-xl font-bold text-white truncate">
            {collapsed ? 'QA' : 'Quiz App'}
          </h1>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={(info) => {
            const item = menuItems.find(item => item.key === info.key);
            if (item && item.path) {
              navigate(item.path);
            }
          }}
        />
      </Sider>
      
      <Layout className={`transition-all duration-300 ${collapsed ? 'ml-0' : 'ml-0 md:ml-[200px]'}`}>
        <Header className="flex justify-between items-center px-4 md:px-6 bg-white dark:bg-background-secondary shadow-sm z-10 h-16 sticky top-0">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="mr-4"
            />
            <h2 className="text-lg font-medium text-text-primary">{title}</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-text-secondary">
                  Welcome, {user?.name}
                </span>
              </div>
            )}

            {/* Add additional header elements like notifications, user dropdown, etc. */}
          </div>
        </Header>

        <Content className="p-4 md:p-6">
          <div className="min-h-[calc(100vh-10rem)]">
            {children}
          </div>
        </Content>
        
        <div className="p-4 text-center text-text-secondary text-sm">
          © {new Date().getFullYear()} Quiz Application - All rights reserved
        </div>
      </Layout>
    </Layout>
  );
};

export default MainLayout;