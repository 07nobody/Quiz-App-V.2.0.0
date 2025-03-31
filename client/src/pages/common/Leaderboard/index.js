import React, { useState, useEffect } from 'react';
import { Table, Card, Tabs, Avatar, Tag, Tooltip, Button, Radio } from 'antd';
import { 
  TrophyOutlined, 
  RiseOutlined, 
  FieldTimeOutlined,
  FireOutlined,
  UserOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import PageTitle from '../../../components/PageTitle';
import ResponsiveCard from '../../../components/ResponsiveCard';

const { TabPane } = Tabs;

function Leaderboard() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [category, setCategory] = useState('all');
  const [leaders, setLeaders] = useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank) => (
        <div className={`rank rank-${rank}`}>
          {rank <= 3 ? (
            <TrophyOutlined className={`trophy trophy-${rank}`} />
          ) : rank}
        </div>
      ),
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div className="user-cell">
          <Avatar src={user.profilePicture}>
            {user.name.charAt(0)}
          </Avatar>
          <span className="user-name">{user.name}</span>
          {user.badges?.map((badge, index) => (
            <Tooltip key={index} title={badge.description}>
              <Tag color="blue" className="user-badge">{badge.name}</Tag>
            </Tooltip>
          ))}
        </div>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      render: (score) => (
        <div className="score-cell">
          <span className="score-value">{score}</span>
          <span className="score-label">points</span>
        </div>
      ),
    },
    {
      title: 'Exams Passed',
      dataIndex: 'examsPassed',
      key: 'examsPassed',
      render: (passed) => (
        <Tag color="success" icon={<BookOutlined />}>
          {passed}
        </Tag>
      ),
    },
    {
      title: 'Avg. Score',
      dataIndex: 'avgScore',
      key: 'avgScore',
      render: (avg) => (
        <div className="avg-score">
          <RiseOutlined style={{ color: avg >= 80 ? '#52c41a' : '#faad14' }} />
          <span>{avg}%</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadLeaderboardData();
  }, [timeframe, category]);

  const loadLeaderboardData = async () => {
    try {
      dispatch(ShowLoading());
      // TODO: Replace with actual API call
      const mockData = Array(10).fill().map((_, i) => ({
        key: i,
        rank: i + 1,
        user: {
          name: `User ${i + 1}`,
          profilePicture: '',
          badges: i < 3 ? [{
            name: 'Expert',
            description: 'Completed 50+ exams'
          }] : []
        },
        score: Math.floor(1000 - i * 50 + Math.random() * 30),
        examsPassed: Math.floor(20 - i + Math.random() * 5),
        avgScore: Math.floor(95 - i * 2 + Math.random() * 5),
      }));
      setLeaders(mockData);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      console.error("Error loading leaderboard:", error);
    }
  };

  return (
    <div className="leaderboard-container">
      <PageTitle 
        title="Leaderboard" 
        subtitle="Compete with other learners and earn achievements"
      />

      <div className="leaderboard-filters">
        <Radio.Group 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="daily">
            <FieldTimeOutlined /> Daily
          </Radio.Button>
          <Radio.Button value="weekly">
            <FireOutlined /> Weekly
          </Radio.Button>
          <Radio.Button value="monthly">
            <TrophyOutlined /> Monthly
          </Radio.Button>
          <Radio.Button value="all-time">
            <UserOutlined /> All Time
          </Radio.Button>
        </Radio.Group>
      </div>

      <ResponsiveCard>
        <Table 
          columns={columns} 
          dataSource={leaders}
          pagination={false}
          className="leaderboard-table"
        />
      </ResponsiveCard>

      <style jsx="true">{`
        .leaderboard-container {
          padding: 1rem;
        }

        .leaderboard-filters {
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .rank {
          font-weight: 600;
          text-align: center;
        }

        .rank-1 .trophy {
          color: #ffd700;
        }

        .rank-2 .trophy {
          color: #c0c0c0;
        }

        .rank-3 .trophy {
          color: #cd7f32;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          font-weight: 500;
        }

        .user-badge {
          margin-left: 0.5rem;
        }

        .score-cell {
          display: flex;
          flex-direction: column;
        }

        .score-value {
          font-weight: 600;
          color: var(--primary);
        }

        .score-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .avg-score {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .leaderboard-filters {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .user-badge {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Leaderboard;