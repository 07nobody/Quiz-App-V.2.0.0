import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Progress, Typography, Divider, Badge } from 'antd';
import { 
  TrophyOutlined, 
  HistoryOutlined, 
  RiseOutlined, 
  ClockCircleOutlined
} from '@ant-design/icons';
import ConfettiEffect from './ConfettiEffect';
import SocialShare from './SocialShare';

const { Title, Text } = Typography;

const QuizCompletionCard = ({ 
  quizResult = {}, 
  timeSpent = 0, 
  achievements = [], 
  xpGained = 0,
  onTakeAnother = () => {},
  onReviewAnswers = () => {}
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Destructure quiz result data
  const { 
    quizTitle = "Quiz", 
    correct = 0, 
    total = 10, 
    percentage = 0,
    passThreshold = 50,
  } = quizResult;

  const isPassed = percentage >= passThreshold;
  
  // Determine score-based message and color
  const getScoreMessage = () => {
    if (percentage >= 90) return { text: "Excellent!", color: "#52c41a" };
    if (percentage >= 75) return { text: "Great job!", color: "#1890ff" };
    if (percentage >= passThreshold) return { text: "Good work!", color: "#faad14" };
    return { text: "Keep practicing!", color: "#ff4d4f" };
  };
  
  const { text: scoreMessage, color: scoreColor } = getScoreMessage();
  
  // Format time spent in a readable format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  useEffect(() => {
    // Show confetti animation if passed
    if (isPassed) {
      setShowConfetti(true);
      
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isPassed]);
  
  return (
    <>
      <ConfettiEffect active={showConfetti} />
      
      <Card 
        className="quiz-completion-card"
        bordered={false}
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}
      >
        <div className="completion-header">
          <Title level={2} className="completion-title">
            {isPassed ? "Congratulations!" : "Quiz Completed"}
          </Title>
          
          <Text className="completion-subtitle">
            You've completed <strong>{quizTitle}</strong>
          </Text>
        </div>
        
        <div className="score-display">
          <Progress
            type="circle"
            percent={percentage}
            width={120}
            status={isPassed ? "success" : "exception"}
            format={() => `${percentage}%`}
            strokeColor={scoreColor}
          />
          <div className="score-message" style={{ color: scoreColor }}>
            {scoreMessage}
          </div>
          <div className="score-details">
            <Text>{correct} correct out of {total} questions</Text>
          </div>
        </div>
        
        <Divider />
        
        <Row gutter={[16, 16]} className="stats-row">
          <Col span={12}>
            <Card 
              size="small" 
              className="stat-card"
              style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}
            >
              <div className="stat-content">
                <RiseOutlined className="stat-icon" style={{ color: '#52c41a' }}/>
                <div>
                  <div className="stat-title">XP Gained</div>
                  <div className="stat-value">+{xpGained} XP</div>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card 
              size="small" 
              className="stat-card"
              style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}
            >
              <div className="stat-content">
                <ClockCircleOutlined className="stat-icon" style={{ color: '#1890ff' }}/>
                <div>
                  <div className="stat-title">Time Spent</div>
                  <div className="stat-value">{formatTime(timeSpent)}</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        
        {achievements && achievements.length > 0 && (
          <div className="achievements-section">
            <Title level={4}>
              <TrophyOutlined /> Achievements Earned
            </Title>
            <Row gutter={[16, 16]}>
              {achievements.map((achievement, index) => (
                <Col key={index} span={12}>
                  <Badge.Ribbon text="New!" color="#722ed1">
                    <Card size="small" className="achievement-card">
                      <div className="achievement-card-content">
                        <div 
                          className="achievement-icon" 
                          style={{ backgroundColor: achievement.color || '#faad14' }}
                        >
                          {achievement.icon || <TrophyOutlined />}
                        </div>
                        <div className="achievement-info">
                          <div className="achievement-title">{achievement.title}</div>
                          <div className="achievement-desc">{achievement.description}</div>
                        </div>
                      </div>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              ))}
            </Row>
          </div>
        )}
        
        <div className="action-buttons">
          <SocialShare 
            title={`I completed ${quizTitle}!`}
            description={`I scored ${percentage}% on this quiz.`}
            score={{ correct, total, percentage }}
          />
          
          <Button 
            type="default" 
            onClick={onReviewAnswers}
            icon={<HistoryOutlined />}
          >
            Review Answers
          </Button>
          
          <Button 
            type="primary" 
            onClick={onTakeAnother}
          >
            Take Another Quiz
          </Button>
        </div>
      </Card>
      
      <style jsx="true">{`
        .quiz-completion-card {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .completion-header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .completion-title {
          margin-bottom: 8px !important;
          color: ${isPassed ? '#52c41a' : '#ff4d4f'};
        }
        
        .completion-subtitle {
          font-size: 16px;
          color: #8c8c8c;
        }
        
        .score-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 16px 0 24px;
        }
        
        .score-message {
          font-size: 24px;
          font-weight: 600;
          margin: 16px 0 8px;
        }
        
        .score-details {
          color: #8c8c8c;
        }
        
        .stats-row {
          margin: 16px 0 24px;
        }
        
        .stat-card {
          height: 100%;
        }
        
        .stat-content {
          display: flex;
          align-items: center;
        }
        
        .stat-icon {
          font-size: 24px;
          margin-right: 12px;
        }
        
        .stat-title {
          font-size: 12px;
          color: #8c8c8c;
        }
        
        .stat-value {
          font-size: 16px;
          font-weight: 600;
        }
        
        .achievements-section {
          margin: 24px 0;
        }
        
        .achievement-card {
          margin-bottom: 16px;
        }
        
        .achievement-card-content {
          display: flex;
          align-items: center;
        }
        
        .achievement-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          color: white;
          font-size: 18px;
        }
        
        .achievement-info {
          flex: 1;
        }
        
        .achievement-title {
          font-weight: 600;
          margin-bottom: 2px;
        }
        
        .achievement-desc {
          font-size: 12px;
          color: #8c8c8c;
        }
        
        .action-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
        }
        
        @media (max-width: 576px) {
          .action-buttons {
            flex-direction: column;
            gap: 12px;
          }
          
          .action-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default QuizCompletionCard;