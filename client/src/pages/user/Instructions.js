import React from 'react';
import { useNavigate } from 'react-router-dom';

function Instructions({ examData, setView }) {
  const navigate = useNavigate();

  return (
    <div className="instructions-container">
      <div className="instructions-card">
        <h1 className="title">Instructions</h1>
        
        <div className="exam-info">
          <div className="info-item">
            <span className="label">Exam Name:</span>
            <span className="value">{examData?.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Duration:</span>
            <span className="value">{examData?.duration} mins</span>
          </div>
          <div className="info-item">
            <span className="label">Total Marks:</span>
            <span className="value">{examData?.totalMarks}</span>
          </div>
          <div className="info-item">
            <span className="label">Passing Marks:</span>
            <span className="value">{examData?.passingMarks}</span>
          </div>
        </div>

        <div className="rules-section">
          <h2 className="section-title">Important Rules</h2>
          <ul className="rules-list">
            <li>The timer will start as soon as you begin the exam.</li>
            <li>You cannot pause the timer once the exam starts.</li>
            <li>Do not refresh the page during the exam.</li>
            <li>You can navigate between questions using the question panel.</li>
            <li>Questions marked in green are answered.</li>
            <li>The exam will auto-submit when the timer reaches zero.</li>
            <li>Ensure you have a stable internet connection.</li>
          </ul>
        </div>

        <div className="button-group">
          <button 
            className="btn secondary" 
            onClick={() => navigate('/user/write-exam')}
          >
            Close
          </button>
          <button 
            className="btn primary" 
            onClick={() => setView('questions')}
          >
            Start Exam
          </button>
        </div>
      </div>

      <style jsx>{`
        .instructions-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f7fafc;
        }

        .instructions-card {
          background: white;
          border-radius: 12px;
          padding: 32px;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 24px;
          text-align: center;
        }

        .exam-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .label {
          font-size: 0.9rem;
          color: #64748b;
        }

        .value {
          font-size: 1.1rem;
          font-weight: 500;
          color: #1e293b;
        }

        .section-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 16px;
        }

        .rules-list {
          list-style-type: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rules-list li {
          position: relative;
          padding-left: 24px;
          line-height: 1.5;
          color: #4a5568;
        }

        .rules-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #4f46e5;
          font-weight: bold;
        }

        .button-group {
          display: flex;
          gap: 16px;
          margin-top: 32px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn.primary {
          background: #4f46e5;
          color: white;
        }

        .btn.secondary {
          background: #e2e8f0;
          color: #475569;
        }

        .btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .instructions-card {
            padding: 24px;
          }

          .title {
            font-size: 1.6rem;
            margin-bottom: 20px;
          }

          .exam-info {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 12px;
            margin-bottom: 24px;
          }

          .section-title {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .instructions-container {
            padding: 12px;
          }

          .instructions-card {
            padding: 16px;
            border-radius: 8px;
          }

          .title {
            font-size: 1.4rem;
            margin-bottom: 16px;
          }

          .exam-info {
            padding: 12px;
            gap: 8px;
          }

          .value {
            font-size: 1rem;
          }

          .rules-list li {
            font-size: 0.95rem;
          }

          .button-group {
            flex-direction: column-reverse;
            gap: 8px;
            margin-top: 24px;
          }

          .btn {
            width: 100%;
            padding: 12px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Instructions;