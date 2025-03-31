import React from 'react';
import { useNavigate } from 'react-router-dom';

function QuizCard({ questionNumber, question, selectedOption, options, onClick }) {
  const navigate = useNavigate();

  return (
    <div className="quiz-card">
      <div className="question-header">
        <h3 className="question-number">Question {questionNumber}</h3>
        <p className="question-text">{question}</p>
      </div>

      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => onClick(option)}
          >
            <span className="option-indicator">{String.fromCharCode(65 + index)}</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .quiz-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin: 16px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .quiz-card:hover {
          transform: translateY(-2px);
        }

        .question-header {
          margin-bottom: 20px;
        }

        .question-number {
          color: #4f46e5;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .question-text {
          color: #1e293b;
          font-size: 1.2rem;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .option-button:hover {
          border-color: #4f46e5;
          background: #f8fafc;
        }

        .option-button.selected {
          border-color: #4f46e5;
          background: #eef2ff;
        }

        .option-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: #f1f5f9;
          border-radius: 50%;
          margin-right: 12px;
          color: #4f46e5;
          font-weight: 600;
          flex-shrink: 0;
        }

        .option-text {
          color: #475569;
          font-size: 1rem;
          line-height: 1.4;
        }

        .selected .option-indicator {
          background: #4f46e5;
          color: white;
        }

        .selected .option-text {
          color: #1e293b;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .quiz-card {
            padding: 20px;
            margin: 12px 0;
          }

          .question-text {
            font-size: 1.1rem;
            margin-bottom: 20px;
          }

          .option-button {
            padding: 14px;
          }
        }

        @media (max-width: 480px) {
          .quiz-card {
            padding: 16px;
            margin: 8px 0;
            border-radius: 8px;
          }

          .question-number {
            font-size: 1rem;
          }

          .question-text {
            font-size: 1rem;
            margin-bottom: 16px;
          }

          .option-button {
            padding: 12px;
          }

          .option-indicator {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            font-size: 0.9rem;
          }

          .option-text {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}

export default QuizCard;