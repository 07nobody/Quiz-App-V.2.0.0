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
          position: relative;
          overflow: hidden;
          background: var(--primary-gradient);
          border-radius: var(--border-radius-lg);
          padding: 2.5rem;
          color: white;
          box-shadow: 0 10px 30px rgba(63, 81, 181, 0.15);
          margin-bottom: 2rem;
        }
        
        .welcome-content {
          flex: 1;
          z-index: 1;
        }
        
        .welcome-image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }
        
        .welcome-section::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          z-index: 0;
        }
        
        .welcome-section::after {
          content: "";
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          z-index: 0;
        }
        
        .dashboard-image {
          max-width: 100%;
          max-height: 300px;
          object-fit: contain;
          filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.2));
        }
        
        .welcome-heading {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
          line-height: 1.2;
        }
        
        .user-name {
          color: rgba(255, 255, 255, 0.95);
          position: relative;
          display: inline-block;
        }
        
        .user-name::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        
        .welcome-message {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
          max-width: 600px;
          line-height: 1.6;
        }
        
        .cta-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .primary-cta {
          background: white;
          color: var(--primary) !important;
          border: none;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          font-weight: 600;
          height: 46px;
          display: flex;
          align-items: center;
          padding: 0 24px;
        }
        
        .primary-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          color: var(--primary-dark) !important;
        }
        
        .secondary-cta {
          background: rgba(255, 255, 255, 0.15);
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.3);
          height: 46px;
          display: flex;
          align-items: center;
          padding: 0 24px;
        }
        
        .secondary-cta:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px);
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          padding-bottom: 0.75rem;
        }
        
        .section-title::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 3px;
          width: 60px;
          background: var(--primary);
          border-radius: 3px;
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
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
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
          padding: 1rem;
          background: var(--background-secondary);
          border-radius: var(--border-radius);
        }
        
        .exam-name {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
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
          text-align: center;
          padding: 2rem 0;
        }
        
        .features-section {
          padding: 1rem 0;
          margin-bottom: 2rem;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .feature-card {
          height: 100%;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.03);
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .primary-feature {
          border-top: 4px solid var(--primary);
        }
        
        .feature-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1.5rem;
          height: 100%;
        }
        
        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-bottom: 1.5rem;
          background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon-image {
          font-size: 32px;
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
          color: var(--text-primary);
        }
        
        .feature-description {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          flex-grow: 1;
          line-height: 1.5;
        }
        
        .feature-button {
          margin-top: auto;
          min-width: 120px;
          height: 42px;
        }
        
        .section-divider {
          margin: 2rem 0;
          opacity: 0.6;
        }
        
        @media (max-width: 992px) {
          .welcome-section {
            flex-direction: column;
            text-align: center;
            padding: 2rem;
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
          
          .section-title::after {
            left: 50%;
            transform: translateX(-50%);
          }
          
          .section-title {
            justify-content: center;
            text-align: center;
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
          
          .welcome-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
