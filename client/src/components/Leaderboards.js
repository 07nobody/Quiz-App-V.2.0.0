import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tabs, 
  Select, 
  Avatar, 
  Tag, 
  Spin, 
  Alert, 
  Button,
  Empty,
  Tooltip
} from 'antd';
import { 
  TrophyOutlined, 
  UserOutlined, 
  FireOutlined,
  GlobalOutlined,
  TeamOutlined,
  CalendarOutlined,
  StarOutlined
} from '@ant-design/icons';
import { getLeaderboard } from '../apicalls/reports';

const { TabPane } = Tabs;
const { Option } = Select;

const Leaderboards = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [categories, setCategories] = useState(['all']);
  const [timeFrame, setTimeFrame] = useState('all');
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [error, setError] = useState(null);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getLeaderboard({
          userId,
          timeFrame,
          category: categories[0], // Only one category at a time for simplicity
          type: leaderboardType
        });
        
        if (response.success) {
          setLeaderboardData(response.leaderboard || []);
          setUserRank(response.userRank || null);
          
          if (response.categories && response.categories.length > 0) {
            setCategories(['all', ...response.categories]);
          }
        } else {
          setError(response.message || 'Failed to load leaderboard');
        }
      } catch (error) {
        setError('An error occurred while loading the leaderboard');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [userId, timeFrame, categories, leaderboardType]);

  // Handle time frame change
  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  // Handle category change
  const handleCategoryChange = (value) => {
    setCategories([value]);
  };

  // Handle leaderboard type change
  const handleTypeChange = (key) => {
    setLeaderboardType(key);
  };

  // Columns for the leaderboard table
  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank) => {
        if (rank <= 3) {
          const colors = ['#ffd700', '#c0c0c0', '#cd7f32'];
          return (
            <div className="rank-badge" style={{ backgroundColor: colors[rank - 1] }}>
              {rank}
            </div>
          );
        }
        return <div className="rank-normal">{rank}</div>;
      },
    },
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className={`user-cell ${record.userId === userId ? 'current-user' : ''}`}>
          <Avatar 
            src={record.profileImage} 
            icon={<UserOutlined />} 
            size="small" 
            className="user-avatar" 
          />
          <span className="user-name">{name}</span>
          {record.badges && record.badges.length > 0 && (
            <Tooltip title={`${record.badges.length} badges earned`}>
              <span className="badge-count">
                <StarOutlined /> {record.badges.length}
              </span>
            </Tooltip>
          )}
          {record.userId === userId && (
            <Tag color="blue" className="you-tag">You</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level) => (
        <div className="level-badge">{level || 1}</div>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      defaultSortOrder: 'descend',
      render: (score) => <strong>{score}</strong>,
    },
    {
      title: 'Quizzes',
      dataIndex: 'quizzesCompleted',
      key: 'quizzesCompleted',
      responsive: ['md'],
    },
    {
      title: 'Accuracy',
      dataIndex: 'accuracy',
      key: 'accuracy',
      responsive: ['md'],
      render: (accuracy) => `${accuracy}%`,
    },
    {
      title: 'Streak',
      dataIndex: 'streak',
      key: 'streak',
      responsive: ['lg'],
      render: (streak) => (
        <div className="streak">
          <FireOutlined style={{ color: '#ff4d4f' }} /> {streak || 0}
        </div>
      ),
    },
  ];

  // Render user's rank card if available
  const renderUserRankCard = () => {
    if (!userRank) return null;
    
    return (
      <div className="user-rank-card">
        <div className="rank-info">
          <TrophyOutlined className="rank-icon" />
          <div className="rank-details">
            <div className="rank-position">
              Rank <span className="rank-number">#{userRank.rank}</span>
            </div>
            <div className="rank-score">
              Score: <strong>{userRank.score}</strong> | Accuracy: <strong>{userRank.accuracy}%</strong>
            </div>
          </div>
        </div>
        <Button type="primary" ghost onClick={() => window.location.href = '/user/dashboard'}>
          View Stats
        </Button>
      </div>
    );
  };

  // Render the main leaderboard content
  const renderLeaderboardContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
        />
      );
    }
    
    if (leaderboardData.length === 0) {
      return (
        <Empty 
          description={
            leaderboardType === 'friends' 
              ? "No friends data available. Add friends to see how you compare!" 
              : "No leaderboard data available for the selected filters."
          }
        />
      );
    }
    
    return (
      <>
        {userRank && renderUserRankCard()}
        
        <div className="filter-controls">
          <div className="filter-group">
            <span className="filter-label">Time:</span>
            <Select 
              value={timeFrame} 
              onChange={handleTimeFrameChange}
              className="filter-select"
            >
              <Option value="all">All Time</Option>
              <Option value="week">This Week</Option>
              <Option value="month">This Month</Option>
            </Select>
          </div>
          
          <div className="filter-group">
            <span className="filter-label">Category:</span>
            <Select 
              value={categories[0]} 
              onChange={handleCategoryChange}
              className="filter-select"
            >
              <Option value="all">All Categories</Option>
              {categories
                .filter(cat => cat !== 'all')
                .map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))
              }
            </Select>
          </div>
        </div>
        
        <div className="leaderboard-table">
          <Table 
            columns={columns}
            dataSource={leaderboardData}
            pagination={{ pageSize: 10 }}
            rowKey="userId"
            rowClassName={(record) => record.userId === userId ? 'current-user-row' : ''}
          />
        </div>
      </>
    );
  };

  return (
    <div className="leaderboards-container">
      <Tabs 
        defaultActiveKey={leaderboardType} 
        onChange={handleTypeChange}
        className="leaderboard-tabs"
      >
        <TabPane 
          tab={
            <span>
              <GlobalOutlined /> Global
            </span>
          } 
          key="global"
        >
          {renderLeaderboardContent()}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <TeamOutlined /> Friends
            </span>
          } 
          key="friends"
        >
          {renderLeaderboardContent()}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CalendarOutlined /> Monthly
            </span>
          } 
          key="monthly"
        >
          {renderLeaderboardContent()}
        </TabPane>
      </Tabs>
      
      <style jsx="true">{`
        .leaderboards-container {
          background-color: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
        }
        
        .user-rank-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #f5f9ff 0%, #ecf4ff 100%);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          border: 1px solid #d9e8ff;
        }
        
        .rank-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .rank-icon {
          color: #faad14;
          font-size: 2rem;
          background-color: #fffbe6;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffe58f;
        }
        
        .rank-details {
          display: flex;
          flex-direction: column;
        }
        
        .rank-position {
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .rank-number {
          color: #1890ff;
        }
        
        .rank-score {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .filter-controls {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 16px;
          gap: 16px;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .filter-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .filter-select {
          min-width: 140px;
        }
        
        .rank-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          color: #fff;
          font-weight: bold;
          font-size: 0.9rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .rank-normal {
          font-weight: 500;
          text-align: center;
        }
        
        .user-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .user-cell.current-user {
          font-weight: 600;
        }
        
        .user-avatar {
          flex-shrink: 0;
        }
        
        .user-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .badge-count {
          font-size: 0.85rem;
          color: #faad14;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .you-tag {
          margin-left: auto;
        }
        
        .level-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1890ff, #722ed1);
          color: white;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .streak {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .current-user-row {
          background-color: rgba(24, 144, 255, 0.05);
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .leaderboards-container {
            padding: 16px;
          }
          
          .user-rank-card {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Leaderboards;