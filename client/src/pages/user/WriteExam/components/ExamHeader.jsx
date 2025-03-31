import React from 'react';
import { Badge, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import ExamTimer from './ExamTimer';

/**
 * Header component for exam UI displaying title, metadata, and timer
 */
const ExamHeader = ({
  examName,
  category,
  isActive,
  questionCount,
  totalMarks,
  secondsLeft,
  totalDuration,
  onTimeWarning,
  onToggleSidebar
}) => {
  return (
    <div className="exam-header">
      <div className="exam-title-section">
        <h1 className="exam-title">{examName}</h1>
        <div className="exam-meta">
          <Badge color={isActive ? "green" : "red"} text={category} />
          <span>{questionCount} Questions</span>
          <span>Total: {totalMarks} pts</span>
        </div>
      </div>
      
      <div className="exam-controls">
        <ExamTimer
          secondsLeft={secondsLeft}
          totalDuration={totalDuration}
          compact={true}
          className="mobile-timer"
          onTimeWarning={onTimeWarning}
          showProgress={false}
        />
        
        <Button 
          icon={<MenuOutlined />}
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          shape="circle"
          aria-label="Toggle questions sidebar"
        />
      </div>
      
      <style jsx="true">{`
        .exam-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--card-background);
          z-index: 10;
        }
        
        .exam-title-section {
          flex-grow: 1;
        }
        
        .exam-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .exam-meta {
          display: flex;
          gap: 16px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-top: 4px;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .exam-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        @media (min-width: 992px) {
          .sidebar-toggle {
            display: none;
          }
        }
        
        @media (max-width: 576px) {
          .exam-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

ExamHeader.propTypes = {
  examName: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  questionCount: PropTypes.number.isRequired,
  totalMarks: PropTypes.number.isRequired,
  secondsLeft: PropTypes.number.isRequired,
  totalDuration: PropTypes.number.isRequired,
  onTimeWarning: PropTypes.func.isRequired,
  onToggleSidebar: PropTypes.func.isRequired
};

export default React.memo(ExamHeader);