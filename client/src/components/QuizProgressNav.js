import React from 'react';
import { Badge } from 'antd';

function QuizProgressNav({ 
  questions, 
  selectedQuestionIndex,
  setSelectedQuestionIndex,
  selectedOptions 
}) {
  return (
    <div className="progress-nav">
      <div className="questions-grid">
        {questions.map((question, index) => (
          <button
            key={index}
            className={`question-btn ${
              selectedQuestionIndex === index ? 'active' : ''
            } ${selectedOptions[index] !== undefined ? 'answered' : ''}`}
            onClick={() => setSelectedQuestionIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <Badge status="default" text="Not Visited" />
        </div>
        <div className="legend-item">
          <Badge status="processing" text="Current" />
        </div>
        <div className="legend-item">
          <Badge status="success" text="Answered" />
        </div>
      </div>

      <style jsx>{`
        .progress-nav {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .questions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          gap: 8px;
          margin-bottom: 16px;
        }

        .question-btn {
          width: 100%;
          aspect-ratio: 1;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .question-btn:hover {
          background: #f7fafc;
          transform: translateY(-1px);
        }

        .question-btn.active {
          background: #ebf4ff;
          border-color: #4f46e5;
          color: #4f46e5;
        }

        .question-btn.answered {
          background: #f0fff4;
          border-color: #10b981;
          color: #10b981;
        }

        .question-btn.active.answered {
          background: #ebf4ff;
          border-color: #4f46e5;
          color: #4f46e5;
        }

        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          padding-top: 8px;
          border-top: 1px solid #e2e8f0;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .progress-nav {
            padding: 12px;
          }

          .questions-grid {
            grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
            gap: 6px;
            margin-bottom: 12px;
          }

          .question-btn {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .progress-nav {
            padding: 8px;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 12px 12px 0 0;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            max-height: 30vh;
            overflow-y: auto;
          }

          .questions-grid {
            grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
            gap: 4px;
            margin-bottom: 8px;
          }

          .question-btn {
            font-size: 0.85rem;
          }

          .legend {
            gap: 12px;
            justify-content: center;
            padding-top: 6px;
          }

          .legend-item {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default QuizProgressNav;