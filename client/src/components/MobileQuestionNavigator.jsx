import React, { useState } from 'react';
import { Drawer, Button, Space, Badge, Tooltip } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

/**
 * A mobile-friendly question navigator component that provides easy
 * navigation between quiz questions on smaller screens
 */
const MobileQuestionNavigator = ({ 
  questions,
  currentQuestionIndex,
  answeredQuestions, 
  markedQuestions,
  onQuestionSelect
}) => {
  const [visible, setVisible] = useState(false);
  const { currentTheme } = useTheme();
  
  const isDarkMode = currentTheme === 'dark';
  
  const showDrawer = () => {
    setVisible(true);
  };
  
  const onClose = () => {
    setVisible(false);
  };
  
  const handleQuestionClick = (index) => {
    onQuestionSelect(index);
    onClose();
  };
  
  // Determine the status of a question
  const getQuestionStatus = (index) => {
    const isCurrent = index === currentQuestionIndex;
    const isAnswered = answeredQuestions.includes(index);
    const isMarked = markedQuestions.includes(index);
    
    if (isCurrent) return 'current';
    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    return 'unattempted';
  };
  
  return (
    <>
      <div className="mobile-navigator-trigger">
        <Button
          type="primary"
          onClick={showDrawer}
          icon={visible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          shape="circle"
          className="navigator-trigger-button"
          aria-label="Open question navigator"
        />
      </div>
      
      <Drawer
        title="Question Navigator"
        placement="right"
        onClose={onClose}
        open={visible}
        width={280}
        className={`question-nav-drawer ${isDarkMode ? 'dark' : 'light'}`}
        closeIcon={<MenuFoldOutlined />}
        footer={
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className="navigator-legend">
              <div className="legend-item">
                <Badge color="#1890ff" text="Current" />
              </div>
              <div className="legend-item">
                <Badge color="#52c41a" text="Answered" />
              </div>
              <div className="legend-item">
                <Badge color="#faad14" text="Marked" />
              </div>
              <div className="legend-item">
                <Badge color="#ff4d4f" text="Marked & Answered" />
              </div>
            </div>
            <Button onClick={onClose} block>
              Close
            </Button>
          </Space>
        }
      >
        <div className="question-navigator-grid">
          <AnimatePresence>
            {questions.map((question, index) => {
              const status = getQuestionStatus(index);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: index * 0.03 }
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tooltip title={`Question ${index + 1}`} placement="bottom">
                    <Button
                      className={`question-nav-button ${status}`}
                      onClick={() => handleQuestionClick(index)}
                      shape="circle"
                    >
                      {index + 1}
                    </Button>
                  </Tooltip>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Drawer>
      
      <style jsx="true">{`
        .mobile-navigator-trigger {
          position: fixed;
          bottom: 80px;
          right: 20px;
          z-index: 100;
        }
        
        .navigator-trigger-button {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: none;
        }
        
        .question-nav-drawer.dark .ant-drawer-content {
          background-color: var(--background-secondary);
          color: var(--text-primary);
        }
        
        .question-nav-drawer.dark .ant-drawer-header {
          background-color: var(--background-secondary);
          border-bottom: 1px solid var(--border-color);
        }
        
        .question-nav-drawer.dark .ant-drawer-title {
          color: var(--text-primary);
        }
        
        .question-navigator-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          padding: 10px 0;
        }
        
        .question-nav-button {
          width: 100%;
          height: 40px;
          border-radius: 50%;
          font-weight: 500;
        }
        
        .question-nav-button.current {
          background-color: #1890ff;
          color: white;
          border-color: #1890ff;
        }
        
        .question-nav-button.answered {
          background-color: rgba(82, 196, 26, 0.1);
          color: #52c41a;
          border-color: #52c41a;
        }
        
        .question-nav-button.marked {
          background-color: rgba(250, 173, 20, 0.1);
          color: #faad14;
          border-color: #faad14;
        }
        
        .question-nav-button.answered-marked {
          background-color: rgba(255, 77, 79, 0.1);
          color: #ff4d4f;
          border-color: #ff4d4f;
        }
        
        .navigator-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
          justify-content: space-between;
        }
        
        .legend-item {
          flex: 0 0 48%;
        }
        
        @media (max-width: 768px) {
          .question-navigator-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .mobile-navigator-trigger {
            bottom: 70px;
            right: 16px;
          }
          
          .navigator-trigger-button {
            width: 42px;
            height: 42px;
          }
        }
      `}</style>
    </>
  );
};

export default MobileQuestionNavigator;