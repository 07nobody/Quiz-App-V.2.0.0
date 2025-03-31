import React, { useEffect, useState } from 'react';
import { Button, Card, Typography, Row, Col, Statistic, Progress, Divider, Space, Badge, Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleFilled, 
  CloseCircleFilled, 
  TrophyFilled, 
  ArrowUpOutlined,
  BookOutlined,
  RightCircleOutlined,
  HomeOutlined,
  FileTextOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import ConfettiEffect from './ConfettiEffect';
import LevelUpNotification from './LevelUpNotification';
import { useTheme } from '../contexts/ThemeContext';
import { calculateGradeLabel, secondsToTimeString } from '../utils/helpers';

const { Title, Text, Paragraph } = Typography;

/**
 * A visually appealing card shown when a quiz is completed
 * Displays results, statistics, and congratulatory messages with animations
 */
const QuizCompletionCard = ({ 
  result, 
  examData, 
  levelUp, 
  onViewReview, 
  onTakeAgain, 
  onViewReports, 
  onGoHome 
}) => {
  const { currentTheme } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const isPassing = result?.verdict === 'Pass';
  
  const percentCorrect = Math.round(
    (result?.correctAnswers?.length / 
    (result?.correctAnswers?.length + result?.wrongAnswers?.length + result?.skippedQuestions?.length)) * 100
  );
  
  // Calculate points earned
  const basePoints = result?.correctAnswers?.length * 10;
  const timeBonus = Math.round((examData?.duration - result?.timeSpent) / 10);
  const totalPoints = basePoints + timeBonus;
  
  // Get letter grade based on percentage
  const grade = calculateGradeLabel(percentCorrect);
  
  // Motivation message based on result
  const getMessage = () => {
    if (isPassing) {
      if (percentCorrect > 90) return "Excellent work! You've mastered this quiz!";
      if (percentCorrect > 80) return "Great job! You've done really well!";
      if (percentCorrect > 70) return "Good job! Solid performance!";
      return "Well done on passing!";
    } else {
      if (percentCorrect > 60) return "So close! You'll get it next time!";
      if (percentCorrect > 40) return "Good try! Keep practicing!";
      return "Don't give up! Review and try again!";
    }
  };
  
  useEffect(() => {
    if (isPassing) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
    
    // Animate stats after a short delay
    setTimeout(() => {
      setAnimateStats(true);
    }, 500);
  }, [isPassing]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="quiz-completion-container"
    >
      {showConfetti && <ConfettiEffect />}
      
      <AnimatePresence>
        {levelUp && (
          <LevelUpNotification level={levelUp.newLevel} points={levelUp.earnedPoints} />
        )}
      </AnimatePresence>
      
      <Card 
        className={`result-card ${currentTheme === 'dark' ? 'dark' : 'light'}`}
        bordered={false}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card-header"
        >
          <div className="header-content">
            <div className="exam-info">
              <Badge color={examData?.type === 'practice' ? '#52c41a' : '#1677ff'} text={examData?.type === 'practice' ? 'Practice' : 'Assessment'} />
              <Title level={3} className="exam-title">{examData?.name || 'Quiz Completed'}</Title>
              <Space size={16}>
                <Text className="exam-category"><BookOutlined /> {examData?.category}</Text>
                <Text className="time-spent">Time: {secondsToTimeString(examData?.duration - result?.secondsLeft)}</Text>
              </Space>
            </div>
            
            <motion.div 
              className="result-badge"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className={`grade-circle ${grade.color}`}>
                <span className="grade-letter">{grade.letter}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
            
        <Divider />
        
        <div className="result-overview">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={12}>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="verdict-container"
              >
                <div className={`verdict ${isPassing ? 'passing' : 'failing'}`}>
                  {isPassing ? (
                    <CheckCircleFilled className="verdict-icon pass" />
                  ) : (
                    <CloseCircleFilled className="verdict-icon fail" />
                  )}
                  <div className="verdict-text">
                    <Text className="verdict-label">{isPassing ? 'PASSED' : 'FAILED'}</Text>
                    <Paragraph className="verdict-message">{getMessage()}</Paragraph>
                  </div>
                </div>
              </motion.div>
            </Col>
            
            <Col xs={24} md={12}>
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Progress 
                  type="circle" 
                  percent={percentCorrect} 
                  strokeColor={isPassing ? {
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  } : {
                    '0%': '#ff4d4f',
                    '100%': '#ff7a45',
                  }}
                  format={(percent) => (
                    <div className="progress-format">
                      <span className="percent">{percent}%</span>
                      <span className="label">Score</span>
                    </div>
                  )}
                  width={120}
                />
              </motion.div>
            </Col>
          </Row>
        </div>
        
        <Divider />
        
        <div className="result-details">
          <Row gutter={[24, 24]}>
            <Col xs={8} md={8}>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: animateStats ? 0 : 20, opacity: animateStats ? 1 : 0 }}
                transition={{ delay: 0.4 }}
              >
                <Statistic 
                  title="Correct" 
                  value={result?.correctAnswers?.length || 0} 
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleFilled />} 
                />
              </motion.div>
            </Col>
            
            <Col xs={8} md={8}>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: animateStats ? 0 : 20, opacity: animateStats ? 1 : 0 }}
                transition={{ delay: 0.5 }}
              >
                <Statistic 
                  title="Incorrect" 
                  value={result?.wrongAnswers?.length || 0} 
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<CloseCircleFilled />} 
                />
              </motion.div>
            </Col>
            
            <Col xs={8} md={8}>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: animateStats ? 0 : 20, opacity: animateStats ? 1 : 0 }}
                transition={{ delay: 0.6 }}
              >
                <Statistic 
                  title="Points Earned" 
                  value={totalPoints} 
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<TrophyFilled />}
                  suffix={
                    timeBonus > 0 && (
                      <Tooltip title={`+${timeBonus} time bonus`}>
                        <span className="bonus-tag">
                          <ArrowUpOutlined /> {timeBonus}
                        </span>
                      </Tooltip>
                    )
                  }
                />
              </motion.div>
            </Col>
          </Row>
        </div>
        
        <Divider />
        
        <div className="result-actions">
          <Row gutter={[16, 16]} justify="center">
            <Col xs={12} sm={6}>
              <Button 
                type="primary" 
                icon={<RightCircleOutlined />}
                onClick={onViewReview}
                block
              >
                Review Answers
              </Button>
            </Col>
            
            <Col xs={12} sm={6}>
              <Button 
                icon={<ReloadOutlined />}
                onClick={onTakeAgain}
                block
              >
                Take Again
              </Button>
            </Col>
            
            <Col xs={12} sm={6}>
              <Button 
                icon={<FileTextOutlined />}
                onClick={onViewReports}
                block
              >
                All Reports
              </Button>
            </Col>
            
            <Col xs={12} sm={6}>
              <Button 
                icon={<HomeOutlined />}
                onClick={onGoHome}
                block
              >
                Home
              </Button>
            </Col>
          </Row>
        </div>
      </Card>
      
      <style jsx="true">{`
        .quiz-completion-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 1rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .result-card {
          margin-top: 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          background-color: var(--card-background);
        }
        
        .result-card.dark {
          background-color: var(--background-secondary);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        
        .card-header {
          padding-bottom: 1rem;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .exam-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .exam-title {
          margin: 8px 0 !important;
          color: var(--text-primary) !important;
        }
        
        .exam-category {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        
        .time-spent {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        
        .result-badge {
          flex-shrink: 0;
        }
        
        .grade-circle {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .grade-circle.excellent {
          background: linear-gradient(135deg, #52c41a, #85d13a);
        }
        
        .grade-circle.good {
          background: linear-gradient(135deg, #1890ff, #69c0ff);
        }
        
        .grade-circle.average {
          background: linear-gradient(135deg, #faad14, #ffc53d);
        }
        
        .grade-circle.poor {
          background: linear-gradient(135deg, #ff7a45, #ff4d4f);
        }
        
        .grade-letter {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .result-overview {
          padding: 1rem 0;
        }
        
        .verdict-container {
          display: flex;
          align-items: center;
        }
        
        .verdict {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 12px;
          background-color: var(--background-primary);
          box-shadow: inset 0 0 0 1px var(--border-color);
          width: 100%;
        }
        
        .verdict.passing {
          background-color: rgba(82, 196, 26, 0.05);
          box-shadow: inset 0 0 0 1px rgba(82, 196, 26, 0.2);
        }
        
        .verdict.failing {
          background-color: rgba(255, 77, 79, 0.05);
          box-shadow: inset 0 0 0 1px rgba(255, 77, 79, 0.2);
        }
        
        .verdict-icon {
          font-size: 2.5rem;
        }
        
        .verdict-icon.pass {
          color: #52c41a;
        }
        
        .verdict-icon.fail {
          color: #ff4d4f;
        }
        
        .verdict-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .verdict-label {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .verdict-message {
          color: var(--text-secondary);
          margin-bottom: 0 !important;
        }
        
        .progress-format {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .percent {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .result-details {
          padding: 1rem 0;
        }
        
        .bonus-tag {
          font-size: 0.8rem;
          color: #722ed1;
          background: rgba(114, 46, 209, 0.1);
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 8px;
        }
        
        .result-actions {
          margin-top: 1rem;
        }
        
        @media (max-width: 576px) {
          .header-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1rem;
          }
          
          .verdict {
            flex-direction: column;
            text-align: center;
            padding: 12px;
            gap: 8px;
          }
          
          .result-actions {
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default QuizCompletionCard;