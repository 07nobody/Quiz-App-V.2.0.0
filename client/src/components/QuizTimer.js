import React, { useState, useEffect } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';

function QuizTimer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 300 && !isWarning) { // 5 minutes warning
            setIsWarning(true);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`timer ${isWarning ? 'warning' : ''}`}>
      <ClockCircleOutlined className="timer-icon" />
      <span className="timer-text">{formatTime(timeLeft)}</span>

      <style jsx>{`
        .timer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .timer.warning {
          background: #fff5f5;
          color: #e53e3e;
          animation: pulse 2s infinite;
        }

        .timer-icon {
          font-size: 1.1rem;
        }

        .timer-text {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: 600;
          min-width: 85px;
          text-align: center;
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

        @media (max-width: 768px) {
          .timer {
            padding: 6px 12px;
          }

          .timer-icon {
            font-size: 1rem;
          }

          .timer-text {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .timer {
            padding: 4px 10px;
            border-radius: 16px;
          }

          .timer-text {
            font-size: 0.95rem;
            min-width: 75px;
          }

          .timer.warning {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(229, 62, 62, 0.2);
          }
        }
      `}</style>
    </div>
  );
}

export default QuizTimer;