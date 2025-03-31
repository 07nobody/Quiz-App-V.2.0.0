import React, { useMemo } from "react";
import { Button, Tag, Progress, Badge, Tooltip } from "antd";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { 
  FieldTimeOutlined, 
  QuestionCircleOutlined, 
  CheckCircleOutlined,
  DollarOutlined,
  UserAddOutlined,
  ArrowRightOutlined,
  BookOutlined,
  TrophyOutlined,
  FireOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function AvailableExamCard({ exam, registrationStatus, onRegisterClick, registrationLoading }) {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { isRegistered, paymentComplete } = registrationStatus || {};

  // Calculate difficulty level
  const difficulty = useMemo(() => {
    const ratio = exam.passingMarks / exam.totalMarks;
    if (ratio < 0.4) return { level: 'Easy', color: '#10b981', percent: 33 };
    if (ratio < 0.7) return { level: 'Medium', color: '#f59e0b', percent: 66 };
    return { level: 'Hard', color: '#ef4444', percent: 100 };
  }, [exam.passingMarks, exam.totalMarks]);
  
  // Determine category style based on category name
  const categoryStyle = useMemo(() => {
    const lowerCategory = exam.category.toLowerCase();
    
    if (lowerCategory.includes('math')) return { color: '#4f46e5', bgColor: 'rgba(79, 70, 229, 0.1)' };
    if (lowerCategory.includes('science')) return { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' };
    if (lowerCategory.includes('history')) return { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' };
    if (lowerCategory.includes('language')) return { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
    if (lowerCategory.includes('tech') || lowerCategory.includes('computer')) return { color: '#0ea5e9', bgColor: 'rgba(14, 165, 233, 0.1)' };
    
    return { color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.1)' };
  }, [exam.category]);
  
  // Format duration in a user-friendly way
  const durationString = useMemo(() => {
    const minutes = Math.floor(exam.duration / 60);
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  }, [exam.duration]);
  
  // Get reward points or score info
  const rewardInfo = useMemo(() => {
    return exam.rewardPoints || Math.round(exam.totalMarks * 1.5);
  }, [exam.rewardPoints, exam.totalMarks]);

  return (
    <motion.div
      className="exam-card-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ translateY: -5 }}
    >
      <div className={`quiz-card ${currentTheme === 'dark' ? 'dark-mode' : ''}`}>
        {exam.isPopular && (
          <div className="popular-badge">
            <FireOutlined /> Popular
          </div>
        )}
        
        <div className="quiz-header">
          <h3 className="quiz-title">{exam.name}</h3>
          <Tag color={exam.isActive ? "success" : "error"}>
            {exam.isActive ? "Active" : "Inactive"}
          </Tag>
        </div>
        
        <div className="quiz-category" style={{color: categoryStyle.color, backgroundColor: categoryStyle.bgColor}}>
          <BookOutlined className="mr-1" />
          {exam.category}
        </div>

        <div className="quiz-info-grid">
          <div className="quiz-info-item">
            <ClockCircleOutlined className="quiz-info-icon" />
            <div>
              <div className="quiz-info-label">Duration</div>
              <div className="quiz-info-value">{durationString}</div>
            </div>
          </div>
          
          <div className="quiz-info-item">
            <QuestionCircleOutlined className="quiz-info-icon" />
            <div>
              <div className="quiz-info-label">Questions</div>
              <div className="quiz-info-value">{exam.questions?.length || 0}</div>
            </div>
          </div>
          
          <div className="quiz-info-item">
            <TrophyOutlined className="quiz-info-icon" />
            <div>
              <div className="quiz-info-label">Pass Score</div>
              <div className="quiz-info-value">{exam.passingMarks}/{exam.totalMarks}</div>
            </div>
          </div>
          
          <div className="quiz-info-item">
            <FireOutlined className="quiz-info-icon" style={{ color: difficulty.color }} />
            <div>
              <div className="quiz-info-label">Difficulty</div>
              <div className="quiz-info-value" style={{ color: difficulty.color }}>{difficulty.level}</div>
            </div>
          </div>
        </div>

        <div className="quiz-footer">
          <div className="quiz-price">
            {exam.isFree ? (
              <Tag color="success" className="price-tag">Free</Tag>
            ) : (
              <Tag color="blue" className="price-tag">₹{exam.price || 99}</Tag>
            )}
            <div className="quiz-reward">
              <TrophyOutlined /> {rewardInfo} points
            </div>
          </div>
          
          <div className="quiz-actions">
            {isRegistered && paymentComplete ? (
              <Button 
                type="primary" 
                icon={<ArrowRightOutlined />}
                onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                className="start-button"
              >
                Start Quiz
              </Button>
            ) : isRegistered && !paymentComplete ? (
              <Button
                type="primary" 
                danger
                icon={<DollarOutlined />}
                onClick={() => navigate(`/payment-portal/${exam._id}`)}
                className="payment-button"
              >
                Pay ₹{exam.price || 99}
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => onRegisterClick(exam)}
                loading={registrationLoading}
                className="register-button"
              >
                Register {!exam.isFree && `• ₹${exam.price || 99}`}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .exam-card-container {
          height: 100%;
          display: flex;
        }
        
        .quiz-card {
          background: var(--card-background);
          border-radius: var(--border-radius-lg);
          padding: 16px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          position: relative;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }
        
        .quiz-card:hover {
          box-shadow: var(--shadow-lg);
        }
        
        .popular-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          background: linear-gradient(90deg, #f97316, #ef4444);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 3px 10px rgba(239, 68, 68, 0.3);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .quiz-title {
          font-size: 1.1rem;
          margin: 0;
          font-weight: 600;
          flex: 1;
          color: var(--text-primary);
        }
        
        .quiz-category {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 500;
          width: fit-content;
        }
        
        .quiz-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 12px;
        }
        
        .quiz-info-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        
        .quiz-info-icon {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-top: 3px;
        }
        
        .quiz-info-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }
        
        .quiz-info-value {
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .quiz-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }
        
        .quiz-price {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .price-tag {
          margin: 0;
          display: inline-flex;
          align-items: center;
        }
        
        .quiz-reward {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .quiz-actions {
          flex-shrink: 0;
        }
        
        .start-button {
          background: var(--primary);
          border-color: var(--primary);
        }
        
        .payment-button {
          background: var(--danger);
          border-color: var(--danger);
        }
        
        .register-button {
          background: var(--primary);
          border-color: var(--primary);
        }

        @media (max-width: 576px) {
          .quiz-card {
            padding: 12px;
            gap: 12px;
          }
          
          .quiz-info-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          
          .quiz-title {
            font-size: 1rem;
          }
          
          .quiz-footer {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          
          .quiz-actions {
            width: 100%;
          }
          
          .quiz-actions button {
            width: 100%;
          }
        }
        
        .dark-mode {
          background-color: var(--background-secondary);
        }
        
        .dark-mode .quiz-category {
          background-color: ${currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'inherit'};
        }
      `}</style>
    </motion.div>
  );
}

export default React.memo(AvailableExamCard);