import React from "react";
import { Button, Tag, Progress, Space, Badge, Tooltip } from "antd";
import { 
  FieldTimeOutlined, 
  QuestionCircleOutlined, 
  CheckCircleOutlined,
  DollarOutlined,
  TrophyOutlined,
  UserAddOutlined,
  MailOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function AvailableExamCard({ exam, registrationStatus, onRegisterClick, registrationLoading }) {
  const navigate = useNavigate();
  const isRegistered = registrationStatus?.isRegistered;
  const isPaid = exam.isPaid;
  const paymentComplete = !isPaid || (registrationStatus?.paymentStatus === "completed");

  const getDifficultyLevel = (passingMarks, totalMarks) => {
    const ratio = passingMarks / totalMarks;
    if (ratio >= 0.9) return { color: "red", level: "Hard", percent: 90 };
    if (ratio >= 0.75) return { color: "orange", level: "Moderate", percent: 75 };
    return { color: "green", level: "Easy", percent: 50 };
  };
  
  const difficulty = getDifficultyLevel(exam.passingMarks, exam.totalMarks);

  return (
    <div className="exam-card">
      <div className="card-ribbon" style={{ backgroundColor: difficulty.color }}></div>
      <div className="card-header">
        <h3 className="exam-title">{exam.name}</h3>
        <div className="exam-badges">
          {exam.isPaid && (
            <Badge count="Paid" style={{ backgroundColor: '#faad14' }} />
          )}
          <Tag color={difficulty.color}>{difficulty.level}</Tag>
        </div>
      </div>
      
      <div className="exam-category">
        <span className="category-label">Category:</span>
        <Tag color="processing">{exam.category}</Tag>
      </div>
      
      <div className="exam-stats">
        <div className="stat-item">
          <Tooltip title="Exam Duration">
            <FieldTimeOutlined className="stat-icon" />
            <span>{Math.floor(exam.duration / 60)} mins</span>
          </Tooltip>
        </div>
        
        <div className="stat-item">
          <Tooltip title="Total Questions">
            <QuestionCircleOutlined className="stat-icon" />
            <span>{exam.questions?.length || 0} Questions</span>
          </Tooltip>
        </div>
        
        <div className="stat-item">
          <Tooltip title="Pass Score">
            <CheckCircleOutlined className="stat-icon" />
            <span>{exam.passingMarks}/{exam.totalMarks}</span>
          </Tooltip>
        </div>
      </div>
      
      <div className="exam-difficulty">
        <div className="difficulty-header">
          <span>Difficulty Level:</span>
          <span style={{ color: difficulty.color }}>{difficulty.level}</span>
        </div>
        <Progress 
          percent={difficulty.percent} 
          strokeColor={difficulty.color}
          showInfo={false}
          size="small"
        />
      </div>
      
      <div className="card-footer">
        {isRegistered && paymentComplete && (
          <div className="action-status">
            <Badge status="success" text="Registered" />
            <Button 
              type="primary" 
              icon={<TrophyOutlined />}
              onClick={() => navigate(`/user/write-exam/${exam._id}`)}
              className="start-button"
            >
              Start Exam
            </Button>
          </div>
        )}
        
        {isRegistered && !paymentComplete && (
          <div className="action-status">
            <Badge status="warning" text="Payment Required" />
            <Button
              type="primary" 
              danger
              icon={<DollarOutlined />}
              onClick={() => navigate(`/payment-portal/${exam._id}`)}
            >
              Pay ₹{exam.price || 99}
            </Button>
          </div>
        )}
        
        {!isRegistered && (
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => onRegisterClick(exam)}
            loading={registrationLoading}
            className="register-button"
            block
          >
            Register for Exam
          </Button>
        )}
      </div>
      
      <style jsx="true">{`
        .exam-card {
          position: relative;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          padding: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .exam-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        
        .card-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          width: 8px;
          height: 100%;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          padding-left: 10px;
        }
        
        .exam-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          color: var(--text-primary);
          line-height: 1.4;
        }
        
        .exam-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .exam-category {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          padding-left: 10px;
        }
        
        .category-label {
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .exam-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
          padding-left: 10px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          background-color: #f5f8ff;
          border-radius: 8px;
          text-align: center;
        }
        
        .stat-icon {
          font-size: 18px;
          margin-bottom: 5px;
          color: var(--primary);
        }
        
        .exam-difficulty {
          margin-bottom: 20px;
          padding-left: 10px;
        }
        
        .difficulty-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .card-footer {
          margin-top: auto;
          padding-left: 10px;
        }
        
        .action-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .register-button {
          background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
          border: none;
          height: 40px;
        }
        
        .register-button:hover {
          background: #52c41a;
          opacity: 0.9;
        }
        
        .start-button {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border: none;
        }
        
        .start-button:hover {
          background: var(--primary);
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

export default AvailableExamCard;