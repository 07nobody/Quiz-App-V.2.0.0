import React, { useState } from "react";
import { message, Checkbox } from "antd";
import { 
  ClockCircleOutlined, 
  FileTextOutlined, 
  ExclamationCircleOutlined, 
  RightCircleOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";

function Instructions({ examData, setView, startTimer }) {
  const [agreed, setAgreed] = useState(false);

  const handleStartExam = () => {
    if (agreed) {
      startTimer();
      setView("questions");
    } else {
      message.error("You must agree to the instructions before starting the exam.");
    }
  };

  return (
    <div className="instructions-container">
      <div className="instructions-card">
        <div className="instructions-header">
          <h1>Exam Instructions</h1>
          <h2>{examData.name}</h2>
        </div>
        
        <div className="instructions-content">
          <div className="instructions-section">
            <h3>
              <FileTextOutlined /> Exam Details
            </h3>
            <div className="exam-details">
              <div className="detail-item">
                <label>Duration:</label>
                <span>{Math.floor(examData.duration / 60)} minutes</span>
              </div>
              <div className="detail-item">
                <label>Total Questions:</label>
                <span>{examData.totalMarks}</span>
              </div>
              <div className="detail-item">
                <label>Passing Marks:</label>
                <span>{examData.passingMarks}</span>
              </div>
              <div className="detail-item">
                <label>Category:</label>
                <span>{examData.category}</span>
              </div>
            </div>
          </div>

          <div className="instructions-section">
            <h3>
              <ExclamationCircleOutlined /> Important Instructions
            </h3>
            <ul className="instruction-list">
              <li>This exam consists of multiple-choice questions (MCQs).</li>
              <li>All questions carry equal marks.</li>
              <li>There is no negative marking in this examination.</li>
              <li><strong>Timer:</strong> A countdown timer in the top-right corner will display the remaining time.</li>
              <li><strong>Do not refresh</strong> the page during the examination as it may result in termination of your exam.</li>
              <li>You can review and change your answers before final submission.</li>
              <li>The exam will be automatically submitted when the timer expires.</li>
            </ul>
          </div>

          <div className="instructions-section">
            <h3>
              <QuestionCircleOutlined /> Question Navigation
            </h3>
            <ul className="instruction-list">
              <li><strong>Save & Next:</strong> Saves your answer and moves to the next question.</li>
              <li><strong>Mark for Review:</strong> Allows you to flag questions to review later.</li>
              <li><strong>Question Panel:</strong> Use the numbered buttons on the left to navigate between questions.</li>
              <li>Different colors indicate the status of questions (Answered, Not Answered, Marked for Review).</li>
              <li>You can change your answers at any time before submitting the exam.</li>
            </ul>
          </div>

          <div className="instructions-section">
            <h3>
              <RightCircleOutlined /> Submission Guidelines
            </h3>
            <ul className="instruction-list">
              <li>Click on the "Submit" button to end the exam once you've answered all questions.</li>
              <li>After submission, your answers will be evaluated and results displayed immediately.</li>
              <li>You can review your answers and see explanations after submission.</li>
            </ul>
          </div>

          <div className="agreement-section">
            <Checkbox 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)}
              className="agreement-checkbox"
            >
              <strong>Declaration:</strong> I have read and understood the instructions. I agree not to use any unfair means during the exam and understand that violation of any instructions may result in cancellation of my results.
            </Checkbox>
          </div>
        </div>

        <div className="instructions-footer">
          <div className="timer-reminder">
            <ClockCircleOutlined /> Exam Duration: <strong>{Math.floor(examData.duration / 60)} minutes</strong>
          </div>
          <div className="instruction-actions">
            <button className="back-button" onClick={() => setView("auth")}>
              Back
            </button>
            <button 
              className={`start-button ${agreed ? '' : 'disabled'}`} 
              onClick={handleStartExam}
              disabled={!agreed}
            >
              <CheckCircleOutlined /> I am Ready to Begin
            </button>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .instructions-container {
          padding: 24px;
          display: flex;
          justify-content: center;
        }
        
        .instructions-card {
          background: white;
          border-radius: 12px;
          box-shadow: var(--box-shadow);
          overflow: hidden;
          width: 100%;
          max-width: 900px;
        }
        
        .instructions-header {
          padding: 24px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          text-align: center;
        }
        
        .instructions-header h1 {
          margin: 0 0 8px 0;
          font-size: 1.8rem;
        }
        
        .instructions-header h2 {
          margin: 0;
          font-size: 1.3rem;
          opacity: 0.9;
        }
        
        .instructions-content {
          padding: 32px;
          max-height: 60vh;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--primary) #f0f0f0;
        }
        
        .instructions-content::-webkit-scrollbar {
          width: 8px;
        }
        
        .instructions-content::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 10px;
        }
        
        .instructions-content::-webkit-scrollbar-thumb {
          background-color: var(--primary);
          border-radius: 10px;
        }
        
        .instructions-section {
          margin-bottom: 32px;
        }
        
        .instructions-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.2rem;
          color: var(--primary);
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .exam-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          background-color: var(--primary-light);
          padding: 12px 16px;
          border-radius: 8px;
        }
        
        .detail-item label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        
        .detail-item span {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1.1rem;
        }
        
        .instruction-list {
          padding-left: 20px;
          margin: 0;
        }
        
        .instruction-list li {
          margin-bottom: 10px;
          line-height: 1.6;
          color: var(--text-primary);
        }
        
        .agreement-section {
          margin-top: 32px;
          padding: 16px;
          background-color: #fff3cd;
          border-left: 4px solid #ffeeba;
          border-radius: 4px;
        }
        
        .agreement-checkbox {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #856404;
        }
        
        .instructions-footer {
          padding: 20px 32px;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f8f9fa;
        }
        
        .timer-reminder {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }
        
        .timer-reminder strong {
          color: var(--primary);
        }
        
        .instruction-actions {
          display: flex;
          gap: 16px;
        }
        
        .back-button {
          padding: 10px 20px;
          background-color: white;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .back-button:hover {
          background-color: #f0f0f0;
        }
        
        .start-button {
          padding: 10px 20px;
          background-color: var(--success);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .start-button:hover {
          background-color: #27ae60;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .start-button.disabled {
          background-color: #a0a0a0;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        @media (max-width: 768px) {
          .instructions-container {
            padding: 16px;
          }
          
          .exam-details {
            grid-template-columns: 1fr;
          }
          
          .instructions-footer {
            flex-direction: column;
            gap: 16px;
          }
          
          .instruction-actions {
            width: 100%;
          }
          
          .back-button, 
          .start-button {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Instructions;
