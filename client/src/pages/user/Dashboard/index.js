import React, { useState, useEffect } from 'react';
import { Tabs, message, Row, Col } from 'antd';
import { 
  LineChartOutlined, 
  TrophyOutlined, 
  UserOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getUserProgress } from '../../../apicalls/users';
import { getAllReports } from '../../../apicalls/reports';
import PageTitle from '../../../components/PageTitle';
import Loader from '../../../components/Loader';
import UserProgressDashboard from '../../../components/UserProgressDashboard';
import Leaderboards from '../../../components/Leaderboards';
import QuizCompletionCard from '../../../components/QuizCompletionCard';

const { TabPane } = Tabs;

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [activeTab, setActiveTab] = useState('progress');

  // Fetch user progress data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user progress data
        const progressResponse = await getUserProgress(user._id);
        if (progressResponse.success) {
          setUserProgress(progressResponse.data);
        } else {
          message.error(progressResponse.message);
        }
        
        // Get recent reports
        const reportsResponse = await getAllReports({ userId: user._id });
        if (reportsResponse.success) {
          setRecentReports(reportsResponse.data.slice(0, 5));
        } else {
          message.error(reportsResponse.message);
        }
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error('Something went wrong');
        console.error(error);
      }
    };
    
    if (user?._id) {
      fetchUserData();
    }
  }, [user]);
  
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Handle continuing or retaking a quiz
  const handleQuizAction = (exam) => {
    navigate(`/user/write-exam/${exam._id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <PageTitle title={`Welcome, ${user?.name}!`} />
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        tabPosition="top"
        className="dashboard-tabs"
      >
        <TabPane 
          tab={
            <span><RiseOutlined /> Progress</span>
          } 
          key="progress"
        >
          <UserProgressDashboard userId={user?._id} />
        </TabPane>
        
        <TabPane 
          tab={
            <span><TrophyOutlined /> Leaderboard</span>
          } 
          key="leaderboard"
        >
          <Leaderboards userId={user?._id} />
        </TabPane>
        
        <TabPane 
          tab={
            <span><LineChartOutlined /> Activity</span>
          } 
          key="activity"
        >
          <div className="recent-activities">
            <h3 className="section-title">Recent Quizzes</h3>
            
            {recentReports.length === 0 ? (
              <div className="no-activities">
                <p>You haven't taken any quizzes yet. Start learning today!</p>
                <button 
                  className="primary-button" 
                  onClick={() => navigate('/user/exams')}
                >
                  Browse Quizzes
                </button>
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {recentReports.map((report) => (
                  <Col key={report._id} xs={24} md={12} lg={8}>
                    <QuizCompletionCard
                      report={report}
                      onAction={() => handleQuizAction(report.exam)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span><UserOutlined /> Profile</span>
          } 
          key="profile"
        >
          <div className="user-profile">
            <h3 className="section-title">Your Profile</h3>
            
            <div className="profile-details">
              <div className="profile-section">
                <h4>Personal Information</h4>
                
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{user?.name}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{user?.email}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Account Type</span>
                  <span className="detail-value">
                    {user?.isAdmin ? 'Administrator' : 'Student'}
                  </span>
                </div>
              </div>
              
              <div className="profile-section">
                <h4>Game Stats</h4>
                
                <div className="detail-item">
                  <span className="detail-label">Level</span>
                  <span className="detail-value level-badge">
                    {userProgress?.level || 1}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">XP</span>
                  <span className="detail-value">
                    {userProgress?.totalExperiencePoints || 0}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Quizzes Completed</span>
                  <span className="detail-value">
                    {userProgress?.stats?.quizzesCompleted || 0}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Current Streak</span>
                  <span className="detail-value streak">
                    <FireIcon /> {userProgress?.currentStreak || 0} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>

      <style jsx="true">{`
        .dashboard-container {
          padding: 20px;
          max-width: 1600px;
          margin: 0 auto;
        }
        
        .dashboard-header {
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 1.2rem;
          margin-bottom: 16px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }
        
        .no-activities {
          text-align: center;
          padding: 48px 0;
          color: var(--text-secondary);
        }
        
        .primary-button {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 16px;
          transition: background-color 0.3s;
        }
        
        .primary-button:hover {
          background-color: var(--primary-dark);
        }
        
        .user-profile {
          background-color: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .profile-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }
        
        .profile-section {
          margin-bottom: 24px;
        }
        
        .profile-section h4 {
          font-size: 1rem;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          border-bottom: 1px dashed #eee;
          padding-bottom: 8px;
        }
        
        .detail-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .detail-value {
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .level-badge {
          display: inline-block;
          background: linear-gradient(135deg, #1890ff, #722ed1);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          text-align: center;
          line-height: 32px;
          font-weight: bold;
        }
        
        .streak {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ff4d4f;
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .profile-details {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}

// Helper component for fire icon (for visual consistency without importing the whole AntD icon)
const FireIcon = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="M834.1 469.2A347.49 347.49 0 00751.2 354l-29.1-26.7a8.09 8.09 0 00-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 01-47.5 46.1 352.6 352.6 0 00-100.3 121.5A347.75 347.75 0 00160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0075.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 00760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0027.7-136c0-48.8-10-96.2-29.9-140.9z"/>
  </svg>
);

export default Dashboard;