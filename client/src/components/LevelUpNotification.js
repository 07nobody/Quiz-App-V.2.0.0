import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const LevelUpNotification = ({ 
  visible = false, 
  level = 1, 
  newSkills = [], 
  onClose = () => {} 
}) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(visible);

  useEffect(() => {
    setIsModalVisible(visible);
    if (visible) {
      setShowConfetti(true);
      
      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setAnimationComplete(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    setIsModalVisible(false);
    setShowConfetti(false);
    onClose();
  };
  
  const renderNewSkills = () => {
    if (!newSkills || newSkills.length === 0) {
      return null;
    }
    
    return (
      <div className="new-skills">
        <h3>New Skills Unlocked:</h3>
        <ul>
          {newSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  const levelColors = [
    '#1890ff', // Level 1-5
    '#52c41a', // Level 6-10
    '#faad14', // Level 11-15
    '#722ed1', // Level 16-20
    '#eb2f96', // Level 21+
  ];
  
  const getLevelColor = (level) => {
    const colorIndex = Math.min(Math.floor((level - 1) / 5), levelColors.length - 1);
    return levelColors[colorIndex];
  };
  
  const levelColor = getLevelColor(level);
  
  return (
    <>
      {showConfetti && (
        <Confetti 
          width={width} 
          height={height} 
          recycle={!animationComplete}
          numberOfPieces={300}
          gravity={0.2}
        />
      )}
      
      <Modal
        title={null}
        visible={isModalVisible}
        footer={null}
        onCancel={handleClose}
        centered
        width={500}
        className="level-up-modal"
        closeIcon={false}
        maskClosable={false}
      >
        <div className="level-up-content">
          <div 
            className="level-badge" 
            style={{ 
              backgroundColor: levelColor,
              boxShadow: `0 0 24px ${levelColor}88` 
            }}
          >
            {level}
          </div>
          
          <h1 className="level-up-title">LEVEL UP!</h1>
          <p className="level-up-message">
            Congratulations! You've reached <strong>Level {level}</strong>
          </p>
          
          <div className="level-up-benefits">
            <h3>Level Benefits:</h3>
            <ul>
              <li>Access to more challenging quizzes</li>
              <li>Earn {Math.round(5 + level * 0.5)} XP for each correct answer</li>
              <li>{level >= 5 && 'Create custom quizzes for friends'}</li>
              <li>{level >= 10 && 'Advanced analytics on your performance'}</li>
            </ul>
          </div>
          
          {renderNewSkills()}
          
          <div className="level-up-quote">
            "The more you learn, the more you earn!"
          </div>
          
          <Button 
            type="primary" 
            size="large" 
            onClick={handleClose}
            className="continue-button"
          >
            Continue Your Journey
          </Button>
        </div>
      </Modal>
      
      <style jsx="true">{`
        .level-up-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
        }
        
        .level-up-content {
          padding: 20px;
          text-align: center;
        }
        
        .level-badge {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: white;
          font-size: 3rem;
          font-weight: bold;
          position: relative;
          animation: pulse 2s infinite;
          border: 4px solid white;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(24, 144, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
          }
        }
        
        .level-up-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 12px;
          background: linear-gradient(to right, #1890ff, #722ed1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .level-up-message {
          font-size: 1.2rem;
          margin-bottom: 24px;
        }
        
        .level-up-benefits {
          background-color: rgba(24, 144, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: left;
        }
        
        .level-up-benefits h3 {
          margin-bottom: 8px;
          color: #1890ff;
        }
        
        .level-up-benefits ul {
          padding-left: 20px;
        }
        
        .level-up-benefits li {
          margin-bottom: 4px;
        }
        
        .new-skills {
          background-color: rgba(82, 196, 26, 0.1);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: left;
        }
        
        .new-skills h3 {
          margin-bottom: 8px;
          color: #52c41a;
        }
        
        .new-skills ul {
          padding-left: 20px;
        }
        
        .level-up-quote {
          font-style: italic;
          color: #666;
          margin-bottom: 24px;
        }
        
        .continue-button {
          min-width: 200px;
          height: 48px;
          border-radius: 24px;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 12px;
          background: linear-gradient(to right, #1890ff, #722ed1);
          border: none;
          transition: all 0.3s;
        }
        
        .continue-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </>
  );
};

export default LevelUpNotification;