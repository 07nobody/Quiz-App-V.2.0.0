import {
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  BarChartOutlined,
  BookFilled,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  TrophyOutlined
} from '@ant-design/icons';

/**
 * Navigation configuration for different user roles
 */

// Common menu items for all authenticated users
export const commonMenuItems = [
  {
    key: '1',
    icon: <HomeOutlined />,
    label: 'Home',
    path: '/'
  },
  {
    key: '2',
    icon: <BookFilled />,
    label: 'Available Exams',
    path: '/available-exams'
  },
  {
    key: '3',
    icon: <BarChartOutlined />,
    label: 'Reports',
    path: '/user/reports'
  },
  {
    key: '4',
    icon: <TrophyOutlined />,
    label: 'Leaderboard',
    path: '/leaderboard'
  }
];

// Admin-specific menu items
export const adminMenuItems = [
  {
    key: '1',
    icon: <HomeOutlined />,
    label: 'Dashboard',
    path: '/'
  },
  {
    key: '2',
    icon: <BookOutlined />,
    label: 'Exams',
    path: '/admin/exams'
  },
  {
    key: '3',
    icon: <BarChartOutlined />,
    label: 'Reports',
    path: '/admin/reports'
  },
  {
    key: '4',
    icon: <TeamOutlined />,
    label: 'Users',
    path: '/admin/users'
  },
  {
    key: '5',
    icon: <SettingOutlined />,
    label: 'Settings',
    path: '/admin/settings'
  },
];

// User-specific menu items
export const userMenuItems = [
  ...commonMenuItems,
  {
    key: '5',
    icon: <BookOutlined />,
    label: 'Study Room',
    path: '/study-room'
  },
  {
    key: '6',
    icon: <FileTextOutlined />,
    label: 'Flashcards',
    path: '/flashcards'
  },
  {
    key: '7',
    icon: <UserOutlined />,
    label: 'Profile',
    path: '/profile'
  },
  {
    key: '8',
    icon: <SettingOutlined />,
    label: 'Settings',
    path: '/user/settings'
  },
];

// Get menu items based on user role
export const getMenuItemsByRole = (userRole) => {
  switch (userRole) {
    case 'admin':
      return adminMenuItems;
    case 'user':
    default:
      return userMenuItems;
  }
};