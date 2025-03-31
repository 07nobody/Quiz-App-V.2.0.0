import React from 'react';
import { Button, Tooltip, Progress } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Mobile-specific navigation controls for exam questions
 */
const MobileNavigation = ({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  progress,
  onPlaySound
}) => {
  return (
    <div className="mobile-nav">
      <div className="progress-container">
        <Progress 
          percent={progress.percent || 0} 
          size="small" 
          showInfo={false}
          strokeColor="var(--primary)"
        />
        <div className="progress-stats">
          <span className="answered-count">{progress.answered || 0} answered</span>
          <span className="total-count">of {progress.total || 0}</span>
        </div>
      </div>
      
      <div className="navigation-buttons">
        <Tooltip title="Previous question">
          <Button 
            icon={<ArrowLeftOutlined />}
            disabled={currentIndex === 0}
            onClick={() => {
              onPrevious();
              if (onPlaySound) onPlaySound("click");
            }}
            shape="circle"
            className="nav-btn prev"
            aria-label="Previous question"
          />
        </Tooltip>
        
        <span className="question-counter" aria-live="polite">
          {currentIndex + 1} / {totalQuestions}
        </span>
        
        <Tooltip title="Next question">
          <Button 
            icon={<ArrowRightOutlined />}
            onClick={() => {
              onNext();
              if (onPlaySound) onPlaySound("click");
            }}
            disabled={currentIndex === totalQuestions - 1}
            shape="circle"
            className="nav-btn next"
            aria-label="Next question"
          />
        </Tooltip>
      </div>
      
      <style jsx="true">{`
        .mobile-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: var(--background-secondary);
          border-bottom: 1px solid var(--border-color);
          flex-wrap: wrap;
          gap: 10px;
          z-index: 5;
        }
        
        .progress-container {
          width: 100%;
        }
        
        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        
        .answered-count {
          font-weight: 500;
          color: var(--primary);
        }
        
        .navigation-buttons {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          justify-content: center;
        }
        
        .question-counter {
          font-weight: 500;
          color: var(--text-primary);
          min-width: 60px;
          text-align: center;
        }
        
        @media (min-width: 992px) {
          .mobile-nav {
            flex-wrap: nowrap;
          }
          
          .progress-container {
            width: auto;
            flex: 1;
          }
          
          .navigation-buttons {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};

MobileNavigation.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  progress: PropTypes.shape({
    total: PropTypes.number,
    answered: PropTypes.number,
    percent: PropTypes.number
  }),
  onPlaySound: PropTypes.func
};

export default React.memo(MobileNavigation);