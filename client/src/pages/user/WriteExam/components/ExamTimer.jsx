import React, { useEffect, useMemo } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import PropTypes from 'prop-types';

/**
 * Reusable timer component for exam UI
 */
const ExamTimer = ({
  secondsLeft,
  totalDuration,
  compact = false,
  className = '',
  onTimeWarning = () => {},
  showProgress = true
}) => {
  // Format time for display (MM:SS)
  const formattedTime = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [secondsLeft]);
  
  // Calculate time warning threshold (20% of total time)
  const isTimeWarning = secondsLeft < totalDuration * 0.2;
  
  // Calculate progress percentage
  const progressPercent = (1 - secondsLeft / totalDuration) * 100;
  
  // Trigger time warning callback when reaching threshold
  useEffect(() => {
    if (isTimeWarning && secondsLeft === Math.floor(totalDuration * 0.2)) {
      onTimeWarning();
    }
  }, [isTimeWarning, secondsLeft, totalDuration, onTimeWarning]);
  
  return (
    <div className={`timer-container ${className}`}>
      <div className={`timer-display ${isTimeWarning ? 'time-warning' : ''}`}>
        <ClockCircleOutlined className="timer-icon" />
        <span className="timer-text">{formattedTime}</span>
      </div>
      
      {showProgress && (
        <Progress 
          percent={progressPercent} 
          size="small" 
          showInfo={false}
          strokeColor={isTimeWarning ? "#ff4d4f" : "var(--primary)"}
        />
      )}
      
      <style jsx="true">{`
        .timer-container {
          width: ${compact ? 'auto' : '100%'};
        }
        
        .timer-display {
          display: flex;
          align-items: center;
          ${compact ? 'gap: 8px; font-size: 1.2rem; padding: 4px 12px;' : 
            'justify-content: center; gap: 10px; padding: 16px; font-size: 1.5rem;'
          }
          background-color: var(--primary-light);
          color: var(--primary);
          border-radius: ${compact ? '20px' : '8px'};
          font-weight: 700;
          margin-bottom: ${showProgress ? '8px' : '0'};
        }
        
        .timer-icon {
          font-size: ${compact ? '1.2rem' : '1.4rem'};
        }
        
        .time-warning {
          color: #ff4d4f;
          background-color: rgba(255, 77, 79, 0.1);
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

ExamTimer.propTypes = {
  secondsLeft: PropTypes.number.isRequired,
  totalDuration: PropTypes.number.isRequired,
  compact: PropTypes.bool,
  className: PropTypes.string,
  onTimeWarning: PropTypes.func,
  showProgress: PropTypes.bool
};

export default React.memo(ExamTimer);