import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { StarOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Question navigation sidebar component with question grid and stats
 */
const QuestionNavigation = ({
  questions,
  selectedQuestionIndex,
  selectedOptions,
  markedForReview,
  onQuestionSelect,
  onSubmit,
  onExit,
  examProgress,
  onCloseSidebar
}) => {
  // Determine question status classes for styling
  const getQuestionStatusClass = (index) => {
    let className = "question-number";
    
    if (selectedOptions[index] === undefined && !markedForReview.includes(index)) {
      className += " not-answered";
    } else if (markedForReview.includes(index)) {
      className += " marked-for-review";
      if (selectedOptions[index] !== undefined) {
        className += " answered-review";
      }
    } else if (selectedOptions[index] !== undefined) {
      className += " answered";
    }
    
    if (index === selectedQuestionIndex) {
      className += " current";
    }
    
    return className;
  };
  
  // Memoize stats calculation for better performance
  const stats = useMemo(() => {
    const total = questions.length;
    const answered = Object.keys(selectedOptions).length;
    const review = markedForReview.length;
    const remaining = total - answered;
    
    return { total, answered, review, remaining };
  }, [questions.length, selectedOptions, markedForReview]);

  return (
    <div className="questions-navigation">
      <div className="sidebar-header">
        <h2>Exam Progress</h2>
        {onCloseSidebar && (
          <Button 
            icon={<CloseOutlined />} 
            onClick={onCloseSidebar}
            shape="circle"
            className="sidebar-close"
          />
        )}
      </div>
      
      <div className="progress-stats-detailed">
        <div className="stats-item">
          <div className="stats-number">{stats.answered}</div>
          <div className="stats-label">Answered</div>
        </div>
        <div className="stats-item">
          <div className="stats-number">{stats.review}</div>
          <div className="stats-label">For Review</div>
        </div>
        <div className="stats-item">
          <div className="stats-number">{stats.remaining}</div>
          <div className="stats-label">Unanswered</div>
        </div>
      </div>

      <div className="questions-list">
        <div className="questions-header">
          <h3>Questions</h3>
          <div className="questions-legend">
            <div className="legend-item">
              <span className="legend-dot not-answered"></span>
              <span>Not Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot marked-for-review"></span>
              <span>Marked for Review</span>
            </div>
          </div>
        </div>

        <div className="question-grid">
          {questions.map((question, index) => (
            <motion.div
              key={index}
              className={getQuestionStatusClass(index)}
              onClick={() => onQuestionSelect(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {index + 1}
              {question.points > 1 && (
                <span className="question-points">
                  <StarOutlined /> {question.points}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="sidebar-actions">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={onSubmit}
            className="submit-btn"
            size="large"
            block
          >
            Submit Exam
          </Button>
          <Button
            type="default"
            danger
            icon={<CloseOutlined />}
            onClick={onExit}
            className="close-btn"
            block
          >
            Exit Exam
          </Button>
        </div>
      </div>
      
      <style jsx="true">{`
        .questions-navigation {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .sidebar-header h2 {
          margin: 0;
          font-size: 1.2rem;
          color: var(--text-primary);
        }
        
        .progress-stats-detailed {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          background-color: var(--background-secondary);
          border-radius: 8px;
          padding: 12px;
        }
        
        .stats-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stats-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .stats-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .questions-list {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        
        .questions-header {
          margin-bottom: 16px;
        }
        
        .questions-header h3 {
          margin-bottom: 12px;
          font-size: 1rem;
          color: var(--text-primary);
        }
        
        .questions-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px;
          background-color: var(--background-secondary);
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .legend-dot {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        
        .not-answered {
          background-color: var(--background-tertiary);
          border: 1px solid var(--border-color);
        }
        
        .answered {
          background-color: rgba(82, 196, 26, 0.2);
          border: 1px solid #52c41a;
        }
        
        .marked-for-review {
          background-color: rgba(250, 173, 20, 0.2);
          border: 1px solid #faad14;
        }
        
        .answered-review {
          background: linear-gradient(45deg, rgba(250, 173, 20, 0.2) 50%, rgba(82, 196, 26, 0.2) 50%);
          border: 1px solid #faad14;
        }
        
        .question-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .question-number {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        
        .question-points {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: var(--primary);
          color: white;
          font-size: 0.7rem;
          width: 16px;
          height: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          font-weight: bold;
        }
        
        .question-number.current {
          border: 2px solid var(--primary);
          background-color: var(--primary-light);
          color: var(--primary);
          transform: scale(1.05);
          font-weight: 600;
        }
        
        .sidebar-actions {
          margin-top: auto;
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        @media (max-width: 576px) {
          .question-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

QuestionNavigation.propTypes = {
  questions: PropTypes.array.isRequired,
  selectedQuestionIndex: PropTypes.number.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  markedForReview: PropTypes.array.isRequired,
  onQuestionSelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
  examProgress: PropTypes.object,
  onCloseSidebar: PropTypes.func
};

export default React.memo(QuestionNavigation);