import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Empty, 
  Tabs, 
  Progress, 
  Alert, 
  Button, 
  Divider,
  Tooltip
} from 'antd';
import { 
  TrophyOutlined, 
  LockOutlined, 
  UnlockOutlined,
  InfoCircleOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import PageTitle from '../../../components/PageTitle';
import AchievementBadge from '../../../components/AchievementBadge';
import ConfettiEffect from '../../../components/ConfettiEffect';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

function Achievements() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.users);
  
  const [activeTab, setActiveTab] = useState('earned');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Mock data for achievements - in a real app, this would come from an API
  const mockAchievements = [
    {
      id: '1',
      type: 'firstExam',
      level: 1,
      name: 'First Steps',
      description: 'Completed your first exam',
      date: '2025-03-15',
      isNew: true,
      earned: true,
      progress: 100,
      maxProgress: 100
    },
    {
      id: '2',
      type: 'perfectScore',
      level: 2, 
      name: 'Perfect Score Pro',
      description: 'Achieved 100% score on 5 different exams',
      date: '2025-03-20',
      isNew: false,
      earned: true,
      progress: 100,
      maxProgress: 100
    },
    {
      id: '3',
      type: 'speedDemon',
      level: 1,
      name: 'Speed Demon',
      description: 'Completed an exam in half the allowed time',
      date: '2025-03-18',
      isNew: false,
      earned: true,
      progress: 100,
      maxProgress: 100
    },
    {
      id: '4',
      type: 'consistency',
      level: 3,
      name: 'Consistency Champion',
      description: 'Completed exams for 30 consecutive days',
      date: '2025-03-25',
      isNew: false,
      earned: true,
      progress: 100,
      maxProgress: 100
    },
    {
      id: '5',
      type: 'hotStreak',
      level: 1,
      name: 'Hot Streak',
      description: 'Passed 5 exams in a row with at least 90% score',
      date: null,
      isNew: false,
      earned: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: '6',
      type: 'topScore',
      level: 1,
      name: 'Leaderboard Champion',
      description: 'Ranked #1 on the leaderboard for any category',
      date: null,
      isNew: false,
      earned: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: '7',
      type: 'dedication',
      level: 1,
      name: 'Dedicated Learner',
      description: 'Spent over 10 hours in Study Mode',
      date: '2025-03-22',
      isNew: false,
      earned: true,
      progress: 100,
      maxProgress: 100
    },
    {
      id: '8',
      type: 'studyMaster',
      level: 1,
      name: 'Study Master',
      description: 'Answered 100 questions correctly in Study Mode',
      date: null,
      isNew: false,
      earned: false,
      progress: 76,
      maxProgress: 100
    },
    {
      id: '9',
      type: 'allRounder',
      level: 1,
      name: 'All-Rounder',
      description: 'Earned at least 5 different types of achievements',
      date: null,
      isNew: false,
      earned: false,
      progress: 4,
      maxProgress: 5
    }
  ];

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      dispatch(ShowLoading());
      
      // In a real app, you would fetch from an API
      // For now, we'll just use mock data
      setTimeout(() => {
        setAchievements(mockAchievements);
        setLoading(false);
        dispatch(HideLoading());
      }, 1000);
      
    } catch (error) {
      setLoading(false);
      dispatch(HideLoading());
      console.error("Error fetching achievements:", error);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    
    if (achievement.isNew) {
      // Show confetti for new achievements
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      // Mark as seen in a real app
      // Here we just update our local state
      setAchievements(prev => 
        prev.map(a => 
          a.id === achievement.id 
            ? { ...a, isNew: false } 
            : a
        )
      );
    }
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const inProgressAchievements = achievements.filter(a => !a.earned);
  
  // Calculate user stats
  const totalAchievements = achievements.length;
  const earnedCount = earnedAchievements.length;
  const earnedPercentage = totalAchievements > 0 
    ? Math.round((earnedCount / totalAchievements) * 100) 
    : 0;
  
  // Calculate total levels earned
  const totalLevels = earnedAchievements.reduce((sum, a) => sum + a.level, 0);

  return (
    <div className="achievements-container">
      {showConfetti && <ConfettiEffect />}
      
      <PageTitle title="My Achievements" />
      
      <div className="achievements-header">
        <Card className="stats-card">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} sm={24} md={8}>
              <div className="stat-item">
                <Text className="stat-label">Total Achievements</Text>
                <Title level={2} className="stat-value">
                  {earnedCount}/{totalAchievements}
                </Title>
                <Progress 
                  percent={earnedPercentage} 
                  status="active" 
                  showInfo={false}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="stat-item">
                <Text className="stat-label">Achievement Level</Text>
                <Title level={2} className="stat-value">{totalLevels}</Title>
                <Text className="stat-description">Total badge levels earned</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div className="stat-item">
                <Text className="stat-label">Latest Achievement</Text>
                {earnedAchievements.length > 0 ? (
                  <div className="latest-badge">
                    <AchievementBadge 
                      type={earnedAchievements[0].type}
                      level={earnedAchievements[0].level}
                      size="small"
                      animation={false}
                    />
                    <div className="latest-badge-info">
                      <Text strong>{earnedAchievements[0].name}</Text>
                      <Text type="secondary" className="latest-date">
                        {new Date(earnedAchievements[0].date).toLocaleDateString()}
                      </Text>
                    </div>
                  </div>
                ) : (
                  <Text type="secondary">No achievements yet</Text>
                )}
              </div>
            </Col>
          </Row>
        </Card>
      </div>
      
      <div className="achievements-content">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          className="achievements-tabs"
        >
          <TabPane 
            tab={
              <span>
                <UnlockOutlined /> Earned ({earnedAchievements.length})
              </span>
            } 
            key="earned"
          >
            {earnedAchievements.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    You haven't earned any achievements yet.
                    <br />
                    Complete quizzes to earn your first achievement!
                  </span>
                }
              />
            ) : (
              <div className="badges-grid">
                {earnedAchievements.map(achievement => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ y: -5 }}
                    className="badge-item"
                    onClick={() => handleAchievementClick(achievement)}
                  >
                    <AchievementBadge
                      type={achievement.type}
                      level={achievement.level}
                      name={achievement.name}
                      description={achievement.description}
                      date={achievement.date}
                      isNew={achievement.isNew}
                    />
                    <div className="badge-name">{achievement.name}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabPane>
          <TabPane 
            tab={
              <span>
                <LockOutlined /> In Progress ({inProgressAchievements.length})
              </span>
            } 
            key="in-progress"
          >
            {inProgressAchievements.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="You've earned all available achievements. Great job!"
              />
            ) : (
              <div className="in-progress-grid">
                {inProgressAchievements.map(achievement => (
                  <Card key={achievement.id} className="progress-card">
                    <div className="progress-card-content">
                      <div className="progress-badge">
                        <AchievementBadge
                          type={achievement.type}
                          size="small"
                          animation={false}
                        />
                      </div>
                      <div className="progress-info">
                        <div className="progress-header">
                          <Text strong>{achievement.name}</Text>
                          <Tooltip title={achievement.description}>
                            <InfoCircleOutlined className="info-icon" />
                          </Tooltip>
                        </div>
                        <Text type="secondary" className="progress-description">
                          {achievement.description}
                        </Text>
                        <Progress 
                          percent={Math.round((achievement.progress / achievement.maxProgress) * 100)} 
                          size="small"
                          format={() => `${achievement.progress}/${achievement.maxProgress}`}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
      
      {selectedAchievement && (
        <Card className="detail-card">
          <div className="detail-header">
            <Title level={4}>Achievement Details</Title>
            <Button 
              type="text" 
              icon={<ShareAltOutlined />} 
              onClick={() => {
                // Share achievement (in a real app, this could open a share dialog)
                console.log('Share achievement:', selectedAchievement.name);
              }}
            >
              Share
            </Button>
          </div>
          <div className="detail-content">
            <div className="detail-badge">
              <AchievementBadge
                type={selectedAchievement.type}
                level={selectedAchievement.level}
                size="large"
              />
            </div>
            <div className="detail-info">
              <Title level={3}>{selectedAchievement.name}</Title>
              <Paragraph>{selectedAchievement.description}</Paragraph>
              
              {selectedAchievement.earned ? (
                <Alert
                  message={`Earned on ${new Date(selectedAchievement.date).toLocaleDateString()}`}
                  type="success"
                  showIcon
                />
              ) : (
                <Alert
                  message={`Progress: ${selectedAchievement.progress}/${selectedAchievement.maxProgress}`}
                  type="info"
                  showIcon
                />
              )}
              
              {selectedAchievement.level > 1 && (
                <div className="level-info">
                  <Text strong>Level {selectedAchievement.level}</Text>
                  <Text type="secondary">You've upgraded this achievement {selectedAchievement.level - 1} times!</Text>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
      
      <style jsx="true">{`
        .achievements-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .achievements-header {
          margin-bottom: 24px;
        }
        
        .stats-card {
          box-shadow: var(--shadow-sm);
          border-radius: var(--border-radius-lg);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          padding: 16px;
        }
        
        .stat-label {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        .stat-value {
          margin: 0 0 8px 0 !important;
          color: var(--primary);
        }
        
        .stat-description {
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .latest-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .latest-badge-info {
          display: flex;
          flex-direction: column;
        }
        
        .latest-date {
          font-size: 12px;
        }
        
        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 24px;
          margin-top: 16px;
        }
        
        .badge-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 12px;
          transition: all 0.3s ease;
        }
        
        .badge-name {
          text-align: center;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .in-progress-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        
        .progress-card {
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }
        
        .progress-card:hover {
          box-shadow: var(--shadow-md);
        }
        
        .progress-card-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .progress-info {
          flex: 1;
        }
        
        .progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        
        .info-icon {
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .info-icon:hover {
          color: var(--primary);
        }
        
        .progress-description {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .detail-card {
          margin-top: 24px;
          box-shadow: var(--shadow-md);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }
        
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        
        .detail-content {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        
        .detail-info {
          flex: 1;
        }
        
        .level-info {
          margin-top: 16px;
          padding: 12px;
          background-color: var(--background-secondary);
          border-radius: var(--border-radius);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        @media (max-width: 768px) {
          .detail-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .detail-badge {
            margin-bottom: 16px;
          }
          
          .badges-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default Achievements;