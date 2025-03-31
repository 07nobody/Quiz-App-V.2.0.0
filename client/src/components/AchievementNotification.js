import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge } from 'antd';
import { 
  TrophyOutlined, 
  CheckCircleOutlined, 
  StarOutlined,
  RocketOutlined,
  FireOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const AchievementNotification = ({ 
  visible = false, 
  achievement = {}, 
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
      
      // Stop confetti after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setAnimationComplete(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    setIsModalVisible(false);
    setShowConfetti(false);
    onClose();
  };
  
  // Return early if achievement is empty
  if (!achievement || !achievement.id) {
    return null;
  }
  
  const { id, title, description, icon, color, xp } = achievement;

  // Define achievement icons
  const achievementIcons = {
    trophy: <TrophyOutlined />,
    star: <StarOutlined />,
    check: <CheckCircleOutlined />,
    rocket: <RocketOutlined />,
    fire: <FireOutlined />,
    lightning: <ThunderboltOutlined />,
  };
  
  // Get icon or default to trophy
  const achievementIcon = achievementIcons[icon] || achievementIcons.trophy;
  
  // Define color based on achievement type or use passed color
  const achievementColor = color || '#1890ff';
  
  return (
    <>
      {showConfetti && (
        <Confetti 
          width={width} 
          height={height} 
          recycle={!animationComplete}
          numberOfPieces={200}
          gravity={0.2}
          colors={[achievementColor, '#fff', '#ffda77', '#f5f5f5']}
        />
      )}
      
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleClose}
        centered
        width={450}
        className="achievement-modal"
        closeIcon={false}
        maskClosable={true}
      >
        <div className="achievement-content">
          <div className="achievement-header">
            <Badge 
              count="NEW!" 
              style={{ 
                backgroundColor: '#52c41a',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }} 
              offset={[-5, 5]}
            >
              <div 
                className="achievement-icon" 
                style={{ 
                  backgroundColor: achievementColor,
                  boxShadow: `0 0 20px ${achievementColor}88` 
                }}
              >
                <span className="icon">{achievementIcon}</span>
              </div>
            </Badge>
          </div>
          
          <div className="achievement-title">Achievement Unlocked!</div>
          
          <h2 className="achievement-name">{title}</h2>
          
          <div className="achievement-description">
            {description}
          </div>
          
          {xp && (
            <div className="xp-reward">
              <span className="xp-label">Reward:</span>
              <span className="xp-value">+{xp} XP</span>
            </div>
          )}
          
          <div className="achievement-actions">
            <Button 
              type="primary" 
              onClick={handleClose}
              className="continue-button"
            >
              Awesome!
            </Button>
            
            <Button 
              type="link" 
              onClick={() => window.location.href = '/user/achievements'}
            >
              View All Achievements
            </Button>
          </div>
        </div>
      </Modal>
      
      <style jsx="true">{`
        .achievement-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
        }
        
        .achievement-content {
          padding: 20px;
          text-align: center;
        }
        
        .achievement-header {
          margin-bottom: 16px;
        }
        
        .achievement-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 2.5rem;
          position: relative;
          animation: pulse 2s infinite;
          border: 3px solid white;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(24, 144, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
          }
        }
        
        .achievement-title {
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #8c8c8c;
          margin-bottom: 8px;
          font-size: 0.85rem;
        }
        
        .achievement-name {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: #303030;
        }
        
        .achievement-description {
          font-size: 1rem;
          margin-bottom: 24px;
          color: #595959;
          padding: 0 16px;
        }
        
        .xp-reward {
          background-color: rgba(82, 196, 26, 0.1);
          border-radius: 20px;
          padding: 8px 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        
        .xp-label {
          color: #52c41a;
          font-weight: 600;
        }
        
        .xp-value {
          font-weight: 700;
          font-size: 1.2rem;
          color: #52c41a;
        }
        
        .achievement-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        
        .continue-button {
          min-width: 160px;
          border-radius: 20px;
          height: 40px;
        }
      `}</style>
    </>
  );
};

export default AchievementNotification;