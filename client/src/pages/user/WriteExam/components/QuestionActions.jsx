import React from 'react';
import { Button } from 'antd';
import { EyeOutlined, SaveOutlined, CheckOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Action buttons for exam questions (mark for review, save & next, submit)
 */
const QuestionActions = ({
  currentIndex,
  totalQuestions,
  isMarkedForReview,
  onToggleReview,
  onNext,
  onSubmit,
  onPlaySound
}) => {
  const isLastQuestion = currentIndex === totalQuestions - 1;
  
  return (
    <div className="question-actions">
      <Button
        className={`action-button review-btn ${isMarkedForReview ? 'active' : ''}`}
        icon={<EyeOutlined />}
        onClick={() => {
          onToggleReview();
          if (onPlaySound) onPlaySound("click");
        }}
        aria-pressed={isMarkedForReview}
      >
        {isMarkedForReview ? 'Unmark' : 'Mark'} Review
      </Button>
      
      {!isLastQuestion ? (
        <Button
          className="action-button next-btn"
          icon={<SaveOutlined />}
          onClick={() => {
            onNext();
            if (onPlaySound) onPlaySound("click");
          }}
          type="primary"
        >
          Save & Next
        </Button>
      ) : (
        <Button
          className="action-button submit-btn"
          icon={<CheckOutlined />}
          onClick={onSubmit}
          type="primary"
          danger
        >
          Submit Exam
        </Button>
      )}
      
      <style jsx="true">{`
        .question-actions {
          display: flex;
          gap: 12px;
          padding: 16px;
          background-color: var(--card-background);
          border-top: 1px solid var(--border-color);
          z-index: 5;
        }
        
        .action-button {
          flex: 1;
          height: 40px;
        }
        
        .review-btn.active {
          background-color: #faad14;
          color: white;
          border-color: #faad14;
        }
        
        @media (max-width: 576px) {
          .question-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

QuestionActions.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  isMarkedForReview: PropTypes.bool.isRequired,
  onToggleReview: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onPlaySound: PropTypes.func
};

export default React.memo(QuestionActions);