import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Badge, Divider, Tag, Statistic, Tooltip } from "antd";
import { 
  FileDoneOutlined, 
  FormOutlined, 
  UserOutlined,
  RocketOutlined,
  TrophyOutlined,
  BookOutlined,
  BarChartOutlined,
  RiseOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import PageTitle from "../../../components/PageTitle";
import ResponsiveCard from "../../../components/ResponsiveCard";
import InfoItem from "../../../components/InfoItem";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Home() {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    examsTaken: 0,
    examsPassed: 0,
    avgScore: 0,
    latestExam: null
  });

  const userFeatures = [
    {
      title: "Available Exams",
      icon: <BookOutlined className="feature-icon-image" />,
      description: "Browse and register for available exams",
      action: () => navigate("/available-exams"),
      color: "#4361ee",
      badge: 5
    },
    {
      title: "My Reports",
      icon: <BarChartOutlined className="feature-icon-image" />,
      description: "View your exam history and performance analytics",
      action: () => navigate("/user/reports"),
      color: "#ff6b6b",
      badge: null
    },
    {
      title: "Take Exam",
      icon: <RocketOutlined className="feature-icon-image" />,
      description: "Start your registered exams",
      action: () => navigate("/available-exams"),
      color: "#2ecc71", 
      primary: true,
      badge: null
    },
    {
      title: "My Profile",
      icon: <UserOutlined className="feature-icon-image" />,
      description: "View and update your personal information",
      action: () => navigate("/profile"),
      color: "#f39c12",
      badge: null
    }
  ];

  const adminFeatures = [
    {
      title: "Manage Exams",
      icon: <FormOutlined className="feature-icon-image" />,
      description: "Create, edit and manage exams",
      action: () => navigate("/admin/exams"),
      color: "#3498db",
      badge: null
    },
    {
      title: "User Reports",
      icon: <FileTextOutlined className="feature-icon-image" />,
      description: "View detailed reports for all users",
      action: () => navigate("/admin/reports"),
      color: "#9b59b6",
      badge: null
    },
    {
      title: "Settings",
      icon: <SettingOutlined className="feature-icon-image" />,
      description: "Configure application settings",
      action: () => navigate("/admin/settings"),
      color: "#34495e",
      badge: null
    },
    {
      title: "User Management",
      icon: <TeamOutlined className="feature-icon-image" />,
      description: "Manage users and permissions",
      action: () => navigate("/admin/users"),
      color: "#16a085",
      badge: null
    }
  ];

  // Select features based on user role
  const features = user?.isAdmin ? adminFeatures : userFeatures;

  // Mock function to load user stats - replace with actual API call
  const loadUserStats = async () => {
    try {
      dispatch(ShowLoading());
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API response
      setStats({
        examsTaken: 12,
        examsPassed: 10,
        avgScore: 82,
        latestExam: {
          name: "JavaScript Fundamentals",
          date: "2023-03-25",
          score: 78,
          passed: true
        }
      });
      
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) {
      loadUserStats();
    }
  }, [user]);

  const renderWelcomeSection = () => (
    <div className="welcome-section">
      <div className="welcome-content">
        <h1 className="welcome-heading">
          Welcome, <span className="user-name">{user?.name || "User"}</span>!
        </h1>
        <p className="welcome-message">
          {user?.isAdmin 
            ? "Manage your quizzes, view reports, and administer the platform from your dashboard."
            : "Enhance your knowledge and test your skills with our interactive quizzes."
          }
        </p>
        {!user?.isAdmin && (
          <div className="cta-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<RocketOutlined />}
              onClick={() => navigate("/available-exams")}
              className="primary-cta"
            >
              Start New Quiz
            </Button>
            <Button 
              type="default"
              size="large"
              icon={<TrophyOutlined />}
              onClick={() => navigate("/user/reports")}
            >
              View My Results
            </Button>
          </div>
        )}
      </div>
      <div className="welcome-image">
        <img 
          src="/quiz-illustration.svg" 
          alt="Quiz Platform" 
          className="dashboard-image"
          onError={(e) => {
            e.target.style.display = 'none'; // Hide image if it fails to load
          }}
        />
      </div>
    </div>
  );

  const renderUserStats = () => {
    if (user?.isAdmin) return null;
    
    return (
      <div className="stats-section">
        <h2 className="section-title">
          <BarChartOutlined /> Your Statistics
        </h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <Statistic 
              title="Exams Taken" 
              value={stats.examsTaken} 
              prefix={<FormOutlined />}
              valueStyle={{ color: '#4361ee' }}
            />
          </div>
          
          <div className="stat-card">
            <Statistic 
              title="Exams Passed" 
              value={stats.examsPassed} 
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#2ecc71' }}
              suffix={stats.examsTaken ? `/ ${stats.examsTaken}` : ''}
            />
          </div>
          
          <div className="stat-card">
            <Statistic 
              title="Average Score" 
              value={stats.avgScore} 
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#f39c12' }}
              suffix="%"
            />
          </div>
          
          <div className="stat-card latest-exam-card">
            <div className="latest-exam-header">
              <span>Latest Exam</span>
              {stats.latestExam?.passed ? (
                <Tag color="success">PASSED</Tag>
              ) : stats.latestExam ? (
                <Tag color="error">FAILED</Tag>
              ) : null}
            </div>
            
            {stats.latestExam ? (
              <div className="latest-exam-info">
                <div className="exam-name">{stats.latestExam.name}</div>
                <div className="exam-details">
                  <div className="exam-date">
                    <CalendarOutlined /> {stats.latestExam.date}
                  </div>
                  <div className="exam-score">
                    Score: <span className={stats.latestExam.passed ? "passed-text" : "failed-text"}>
                      {stats.latestExam.score}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-exam-message">
                You haven't taken any exams yet
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFeatureCards = () => (
    <div className="features-section">
      <h2 className="section-title">
        {user?.isAdmin ? (
          <>
            <SettingOutlined /> Admin Tools
          </>
        ) : (
          <>
            <RocketOutlined /> Quick Actions
          </>
        )}
      </h2>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <ResponsiveCard
            key={index}
            className={`feature-card ${feature.primary ? 'primary-feature' : ''}`}
            hoverable={true}
            onClick={feature.action}
          >
            <div className="feature-content">
              <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                {feature.icon}
                {feature.badge && (
                  <Badge 
                    count={feature.badge} 
                    className="feature-badge"
                  />
                )}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <Button 
                type={feature.primary ? "primary" : "default"}
                className="feature-button"
                onClick={feature.action}
              >
                {feature.primary ? "Start Now" : "View"}
              </Button>
            </div>
          </ResponsiveCard>
        ))}
      </div>
    </div>
  );

  return (
    <div className="home-container">
      {renderWelcomeSection()}
      
      <Divider className="section-divider" />
      
      {renderUserStats()}
      
      {!user?.isAdmin && <Divider className="section-divider" />}
      
      {renderFeatureCards()}
      
      <style jsx="true">{`
        .home-container {
          padding: 0.5rem;
        }
        
        .welcome-section {
          display: flex;
          align-items: center;
          padding: 1.5rem 0;
          gap: 2rem;
          min-height: 300px;
        }
        
        .welcome-content {
          flex: 1;
        }
        
        .welcome-heading {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .user-name {
          color: var(--primary);
        }
        
        .welcome-message {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          max-width: 600px;
          line-height: 1.6;
        }
        
        .cta-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .primary-cta {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border: none;
          box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
        }
        
        .welcome-image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .dashboard-image {
          max-width: 100%;
          max-height: 300px;
          object-fit: contain;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .stats-section {
          padding: 1rem 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .stat-card {
          padding: 1.5rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          transition: var(--transition);
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--box-shadow-hover);
        }
        
        .latest-exam-card {
          grid-column: span 2;
        }
        
        .latest-exam-header {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 1rem;
          margin-bottom: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .latest-exam-info {
          margin-top: 1rem;
        }
        
        .exam-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .exam-details {
          display: flex;
          justify-content: space-between;
          color: var(--text-secondary);
        }
        
        .passed-text {
          color: var(--success);
          font-weight: 600;
        }
        
        .failed-text {
          color: var(--danger);
          font-weight: 600;
        }
        
        .no-exam-message {
          color: var(--text-secondary);
          font-style: italic;
          margin-top: 1rem;
        }
        
        .features-section {
          padding: 1rem 0;
          margin-bottom: 2rem;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .feature-card {
          height: 100%;
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
        }
        
        .primary-feature {
          border-top: 3px solid var(--primary);
        }
        
        .feature-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.5rem 1rem;
          height: 100%;
        }
        
        .feature-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .feature-icon-image {
          font-size: 28px;
          color: white;
        }
        
        .feature-badge {
          position: absolute;
          top: -5px;
          right: -5px;
        }
        
        .feature-title {
          margin-bottom: 0.75rem;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .feature-description {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }
        
        .feature-button {
          margin-top: auto;
          min-width: 120px;
        }
        
        .section-divider {
          margin: 2rem 0;
        }
        
        @media (max-width: 992px) {
          .welcome-section {
            flex-direction: column;
            text-align: center;
          }
          
          .welcome-content {
            order: 2;
          }
          
          .welcome-image {
            order: 1;
            margin-bottom: 2rem;
          }
          
          .cta-buttons {
            justify-content: center;
          }
          
          .welcome-heading {
            font-size: 2rem;
          }
          
          .latest-exam-card {
            grid-column: span 1;
          }
        }
        
        @media (max-width: 576px) {
          .cta-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .welcome-heading {
            font-size: 1.8rem;
          }
          
          .section-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
