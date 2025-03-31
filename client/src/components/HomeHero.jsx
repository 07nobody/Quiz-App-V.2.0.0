import React from 'react';
import { Button, Typography, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { RocketOutlined, TrophyOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const { Title, Paragraph } = Typography;

const HomeHero = ({ user }) => {
  const { currentTheme } = useTheme();
  const isAdmin = user?.isAdmin;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const featureCards = isAdmin ? [
    {
      icon: <FileTextOutlined className="feature-icon" />,
      title: 'Manage Exams',
      description: 'Create and manage quizzes for your users',
      link: '/admin/exams',
      color: '#4f46e5'
    },
    {
      icon: <TrophyOutlined className="feature-icon" />,
      title: 'View Reports',
      description: 'See how users are performing on your exams',
      link: '/admin/reports',
      color: '#0ea5e9'
    }
  ] : [
    {
      icon: <RocketOutlined className="feature-icon" />,
      title: 'Take Exams',
      description: 'Challenge yourself with exciting quizzes',
      link: '/available-exams',
      color: '#0ea5e9'
    },
    {
      icon: <BookOutlined className="feature-icon" />,
      title: 'Study Flashcards',
      description: 'Review and learn with digital flashcards',
      link: '/flashcards',
      color: '#10b981'
    },
    {
      icon: <TrophyOutlined className="feature-icon" />,
      title: 'View Leaderboard',
      description: 'See how you rank against other users',
      link: '/leaderboard',
      color: '#f59e0b'
    },
    {
      icon: <FileTextOutlined className="feature-icon" />,
      title: 'Your Reports',
      description: 'Track your progress and performance',
      link: '/user/reports',
      color: '#8b5cf6'
    }
  ];

  return (
    <motion.div
      className="hero-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Row gutter={[24, 24]} align="middle" className="hero-row">
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants} className="hero-content">
            <Title level={1} className="hero-title">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}!
              </motion.span>
            </Title>
            
            <motion.div variants={itemVariants}>
              <Paragraph className="hero-subtitle">
                {isAdmin 
                  ? 'Manage your exams, create new questions, and track user performance.'
                  : 'Challenge yourself with interactive quizzes, earn points, and track your progress.'}
              </Paragraph>
            </motion.div>

            <motion.div variants={itemVariants} className="hero-actions">
              <Link to={isAdmin ? "/admin/exams" : "/available-exams"}>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={isAdmin ? <FileTextOutlined /> : <RocketOutlined />}
                    className="main-action-button"
                  >
                    {isAdmin ? 'Manage Exams' : 'Available Exams'}
                  </Button>
                </motion.div>
              </Link>
              
              <Link to={isAdmin ? "/admin/reports" : "/user/reports"}>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button 
                    size="large" 
                    className="secondary-action-button"
                  >
                    {isAdmin ? 'View Reports' : 'See Your Reports'}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </Col>
        
        <Col xs={24} lg={12}>
          <div className="feature-cards-grid">
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                className="feature-card"
                style={{ 
                  backgroundColor: `${card.color}10`,
                  borderColor: `${card.color}30`
                }}
                variants={itemVariants}
                whileHover={{ 
                  y: -5, 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  backgroundColor: `${card.color}20`,
                }}
                transition={{ duration: 0.2 }}
              >
                <Link to={card.link} className="feature-card-link">
                  <div className="feature-icon-wrapper" style={{ color: card.color }}>
                    {card.icon}
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">{card.title}</h3>
                    <p className="feature-description">{card.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Col>
      </Row>

      <style jsx="true">{`
        .hero-container {
          padding: 32px 0;
          border-radius: var(--border-radius-lg);
          background-color: var(--background-primary);
        }

        .hero-row {
          width: 100%;
        }

        .hero-content {
          padding: 20px;
        }

        .hero-title {
          font-size: 2.5rem !important;
          margin-bottom: 16px !important;
          color: var(--text-primary) !important;
          font-weight: 700 !important;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .main-action-button {
          background: var(--primary);
          border-color: var(--primary);
          height: 48px;
          padding: 0 24px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .secondary-action-button {
          border-color: var(--border-color-dark);
          color: var(--text-primary);
          height: 48px;
          padding: 0 24px;
          font-size: 16px;
          background: var(--background-secondary);
        }

        .feature-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
          padding: 20px;
        }

        .feature-card {
          border-radius: var(--border-radius-lg);
          padding: 24px;
          border: 1px solid;
          transition: all 0.3s ease;
        }

        .feature-card-link {
          display: block;
          color: inherit;
        }

        .feature-icon-wrapper {
          margin-bottom: 16px;
          font-size: 28px;
          height: 48px;
          width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background-color: ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'};
        }

        .feature-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .feature-description {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        @media (max-width: 992px) {
          .hero-content {
            text-align: center;
            padding-bottom: 0;
          }

          .hero-actions {
            justify-content: center;
          }

          .feature-cards-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem !important;
          }

          .hero-actions {
            flex-direction: column;
          }

          .feature-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default HomeHero;