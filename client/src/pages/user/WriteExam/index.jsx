import { message } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import LottiePlayer from "../../../components/LottiePlayer";
import Instructions from "./Instructions";
import AuthVerification from "./AuthVerification";

import {
  ClockCircleOutlined,
  CheckOutlined,
  WarningOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SaveOutlined,
  EyeOutlined
} from "@ant-design/icons";

function WriteExam() {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [result, setResult] = useState({});
  const [view, setView] = useState("auth");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  
  const getExamData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  const calculateResult = useCallback(async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };
      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, questions, selectedOptions, examData, params.id, user._id]);

  const resetExamState = () => {
    setSelectedQuestionIndex(0);
    setSelectedOptions({});
    setMarkedForReview([]);
    setSecondsLeft(examData.duration);
    setResult({});
    setTimeUp(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const startTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    let totalSeconds = examData.duration;
    const newIntervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(newIntervalId);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleReviewStatus = (index) => {
    if (markedForReview.includes(index)) {
      setMarkedForReview(markedForReview.filter((item) => item !== index));
    } else {
      setMarkedForReview([...markedForReview, index]);
    }
  };

  const getOptionClassName = (questionIndex, option) => {
    let className = "option";
    if (selectedOptions[questionIndex] === option) {
      className = "selected-option";
    }
    return className;
  };

  const getQuestionStatusClass = (index) => {
    if (markedForReview.includes(index)) {
      return "marked-for-review";
    }
    if (selectedOptions[index]) {
      return "answered";
    }
    return "not-answered";
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp, view, intervalId, calculateResult]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, [params.id, getExamData]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    examData && (
      <div className="write-exam-container">
        {view === "auth" && (
          <AuthVerification
            user={user}
            examData={examData}
            setView={setView}
          />
        )}

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && questions.length > 0 && (
          <div className="exam-ui">
            <div className="exam-header">
              <div className="exam-title-section">
                <h1 className="exam-title">{examData.name}</h1>
                <div className="exam-meta">
                  <span>{examData.category}</span>
                  <span>Total Questions: {questions.length}</span>
                  <span>Total Marks: {examData.totalMarks}</span>
                </div>
              </div>
              
              <div className="exam-timer">
                <ClockCircleOutlined className="timer-icon" />
                <span className="time-display">{formatTime(secondsLeft)}</span>
              </div>
            </div>

            <div className="exam-body">
              <div className="question-sidebar">
                <div className="question-status-legend">
                  <div className="status-item">
                    <div className="status-indicator not-answered"></div>
                    <span>Not Visited</span>
                  </div>
                  <div className="status-item">
                    <div className="status-indicator answered"></div>
                    <span>Answered</span>
                  </div>
                  <div className="status-item">
                    <div className="status-indicator marked-for-review"></div>
                    <span>Marked for Review</span>
                  </div>
                </div>
                
                <div className="question-nav">
                  <h3>Questions</h3>
                  <div className="question-grid">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`question-number ${getQuestionStatusClass(index)} ${index === selectedQuestionIndex ? 'current' : ''}`}
                        onClick={() => setSelectedQuestionIndex(index)}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="question-main">
                <div className="question-container">
                  <div className="question-header">
                    <h2>Question {selectedQuestionIndex + 1} of {questions.length}</h2>
                  </div>
                  
                  <div className="question-content">
                    <h3 className="question-text">
                      {questions[selectedQuestionIndex]?.name}
                    </h3>
                    
                    <div className="options-container">
                      {questions[selectedQuestionIndex]?.options &&
                        Object.keys(questions[selectedQuestionIndex].options).map(
                          (option) => {
                            return (
                              <div
                                className={getOptionClassName(selectedQuestionIndex, option)}
                                key={`${questions[selectedQuestionIndex]._id}_${option}`}
                                onClick={() => {
                                  setSelectedOptions({
                                    ...selectedOptions,
                                    [selectedQuestionIndex]: option,
                                  });
                                }}
                              >
                                <div className="option-marker">{option}</div>
                                <div className="option-text">
                                  {questions[selectedQuestionIndex].options[option]}
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div>
                
                <div className="question-actions">
                  {selectedQuestionIndex > 0 && (
                    <button
                      className="action-button"
                      onClick={() => setSelectedQuestionIndex(selectedQuestionIndex - 1)}
                    >
                      <ArrowLeftOutlined /> Previous
                    </button>
                  )}

                  <button
                    className={`action-button review ${markedForReview.includes(selectedQuestionIndex) ? 'active' : ''}`}
                    onClick={() => toggleReviewStatus(selectedQuestionIndex)}
                  >
                    <EyeOutlined /> {markedForReview.includes(selectedQuestionIndex) ? 'Unmark' : 'Mark'} for Review
                  </button>

                  {selectedQuestionIndex < questions.length - 1 ? (
                    <button
                      className="action-button primary"
                      onClick={() => setSelectedQuestionIndex(selectedQuestionIndex + 1)}
                    >
                      <SaveOutlined /> Save & Next
                    </button>
                  ) : (
                    <button
                      className="action-button submit"
                      onClick={() => {
                        // Confirmation before submitting
                        const confirmed = window.confirm(
                          "Are you sure you want to submit the exam? Once submitted, you cannot make changes."
                        );
                        if (confirmed) {
                          clearInterval(intervalId);
                          setTimeUp(true);
                        }
                      }}
                    >
                      <CheckOutlined /> Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="result-container">
            <div className="result-card">
              <div className="result-header">
                <h1>Exam Result</h1>
                <h2 className="exam-name">{examData.name}</h2>
              </div>
              
              <div className="result-content">
                <div className="result-summary">
                  <div className="result-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Questions</span>
                      <span className="stat-value">{questions.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Marks</span>
                      <span className="stat-value">{examData.totalMarks}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Passing Marks</span>
                      <span className="stat-value">{examData.passingMarks}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Correct Answers</span>
                      <span className="stat-value">{result.correctAnswers?.length || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Wrong Answers</span>
                      <span className="stat-value">{result.wrongAnswers?.length || 0}</span>
                    </div>
                    <div className="stat-item verdict">
                      <span className="stat-label">Verdict</span>
                      <span className={`stat-value ${result.verdict === "Pass" ? "pass" : "fail"}`}>
                        {result.verdict}
                      </span>
                    </div>
                  </div>

                  <div className="result-animation">
                    {result.verdict === "Pass" && (
                      <LottiePlayer
                        src="https://assets2.lottiefiles.com/packages/lf20_ya4ycrti.json"
                        background="transparent"
                        speed={1}
                        loop={true}
                        autoplay={true}
                        style={{ height: "300px", width: "300px" }}
                      />
                    )}

                    {result.verdict === "Fail" && (
                      <LottiePlayer
                        src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"
                        background="transparent"
                        speed={1}
                        loop={true}
                        autoplay={true}
                        style={{ height: "300px", width: "300px" }}
                      />
                    )}
                  </div>
                </div>

                <div className="result-actions">
                  <button
                    className="action-button"
                    onClick={() => {
                      resetExamState();
                      setView("instructions");
                    }}
                  >
                    Take Exam Again
                  </button>
                  <button
                    className="action-button primary"
                    onClick={() => {
                      setView("review");
                    }}
                  >
                    Review Answers
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="review-container">
            <div className="review-header">
              <h1>Review Answers</h1>
              <h2>{examData.name}</h2>
            </div>
            
            <div className="review-content">
              {questions.map((question, index) => {
                const isCorrect = question.correctOption === selectedOptions[index];
                return (
                  <div
                    key={question._id}
                    className={`review-item ${isCorrect ? "correct" : "incorrect"}`}
                  >
                    <div className="review-question">
                      <div className="question-number">Question {index + 1}:</div>
                      <div className="question-text">{question.name}</div>
                    </div>

                    <div className="review-options">
                      {Object.keys(question.options).map((option) => (
                        <div 
                          key={option} 
                          className={`review-option ${
                            option === question.correctOption 
                              ? "correct-option" 
                              : option === selectedOptions[index] && option !== question.correctOption
                                ? "wrong-option"
                                : ""
                          }`}
                        >
                          <span className="option-marker">{option}:</span>
                          <span className="option-text">{question.options[option]}</span>
                          {option === question.correctOption && (
                            <CheckOutlined className="correct-icon" />
                          )}
                          {option === selectedOptions[index] && option !== question.correctOption && (
                            <WarningOutlined className="wrong-icon" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="review-explanation">
                      <div className="your-answer">
                        Your answer: {selectedOptions[index] || "Not answered"}
                      </div>
                      <div className="correct-answer">
                        Correct answer: {question.correctOption}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="review-actions">
              <button
                className="action-button"
                onClick={() => {
                  navigate("/user/reports");
                }}
              >
                View All Reports
              </button>
              <button
                className="action-button primary"
                onClick={() => {
                  resetExamState();
                  setView("instructions");
                }}
              >
                Take Exam Again
              </button>
            </div>
          </div>
        )}
        
        <style jsx="true">{`
          .write-exam-container {
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            max-width: 1400px;
            margin: 0 auto;
          }
          
          /* Exam UI */
          .exam-ui {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 160px);
            overflow: hidden;
          }
          
          .exam-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            background: var(--primary-light);
            border-bottom: 1px solid var(--border-color);
          }
          
          .exam-title {
            font-size: 1.4rem;
            margin: 0;
            color: var(--primary);
          }
          
          .exam-meta {
            display: flex;
            gap: 16px;
            margin-top: 4px;
            font-size: 0.85rem;
            color: var(--text-secondary);
          }
          
          .exam-timer {
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          
          .timer-icon {
            font-size: 1.4rem;
            animation: pulse 1.5s infinite;
          }
          
          .time-display {
            font-size: 1.2rem;
            font-weight: 600;
            letter-spacing: 1px;
          }
          
          .exam-body {
            display: flex;
            flex-grow: 1;
            overflow: hidden;
          }
          
          /* Sidebar */
          .question-sidebar {
            width: 280px;
            padding: 16px;
            border-right: 1px solid var(--border-color);
            background: #f8f9fa;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .question-status-legend {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .status-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
          }
          
          .status-indicator {
            width: 16px;
            height: 16px;
            border-radius: 4px;
          }
          
          .question-nav h3 {
            margin-bottom: 12px;
            font-size: 1rem;
          }
          
          .question-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
          }
          
          .question-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            border: 1px solid #ddd;
          }
          
          .question-number.current {
            border: 2px solid var(--primary);
            background: var(--primary-light);
            transform: scale(1.05);
          }
          
          .not-answered {
            background: white;
          }
          
          .answered {
            background: #d4edda;
            border-color: #c3e6cb;
          }
          
          .marked-for-review {
            background: #fff3cd;
            border-color: #ffeeba;
          }
          
          /* Main question area */
          .question-main {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding: 20px;
            overflow-y: auto;
          }
          
          .question-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
            flex-grow: 1;
          }
          
          .question-header {
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .question-header h2 {
            margin: 0;
            font-size: 1.2rem;
            color: var(--text-secondary);
          }
          
          .question-content {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .question-text {
            font-size: 1.2rem;
            font-weight: 500;
            line-height: 1.5;
          }
          
          .options-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
          }
          
          .option {
            display: flex;
            padding: 16px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .option:hover {
            border-color: var(--primary);
            background: var(--primary-light);
            transform: translateY(-2px);
          }
          
          .selected-option {
            display: flex;
            padding: 16px;
            border: 2px solid var(--primary);
            border-radius: 8px;
            background: var(--primary-light);
            cursor: pointer;
            position: relative;
          }
          
          .option-marker {
            width: 30px;
            height: 30px;
            min-width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--light-accent);
            margin-right: 16px;
            font-weight: 600;
          }
          
          .selected-option .option-marker {
            background: var(--primary);
            color: white;
          }
          
          .option-text {
            flex-grow: 1;
            margin-top: 5px;
          }
          
          .question-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
          }
          
          .action-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            background: var(--light-accent);
            color: var(--text-primary);
          }
          
          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .action-button.primary {
            background: var(--primary);
            color: white;
          }
          
          .action-button.primary:hover {
            background: var(--primary-dark);
          }
          
          .action-button.submit {
            background: var(--success);
            color: white;
          }
          
          .action-button.submit:hover {
            background: #27ae60;
          }
          
          .action-button.review {
            background: #ffeeba;
            color: #856404;
          }
          
          .action-button.review:hover {
            background: #fff3cd;
          }
          
          .action-button.review.active {
            background: #fff3cd;
            border: 1px solid #ffeeba;
          }
          
          /* Result Page Styling */
          .result-container {
            padding: 24px;
          }
          
          .result-card {
            background: white;
            border-radius: 12px;
            box-shadow: var(--box-shadow);
            overflow: hidden;
          }
          
          .result-header {
            padding: 24px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            text-align: center;
          }
          
          .result-header h1 {
            margin: 0 0 8px 0;
            font-size: 2rem;
          }
          
          .result-content {
            padding: 32px;
          }
          
          .result-summary {
            display: flex;
            gap: 48px;
          }
          
          .result-stats {
            flex-grow: 1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          
          .stat-item {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 16px;
            border-radius: 8px;
            background: var(--light-accent);
          }
          
          .stat-label {
            font-size: 1rem;
            color: var(--text-secondary);
          }
          
          .stat-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
          }
          
          .stat-item.verdict {
            grid-column: span 2;
            background: var(--primary-light);
          }
          
          .stat-value.pass {
            color: var(--success);
          }
          
          .stat-value.fail {
            color: var(--danger);
          }
          
          .result-actions {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 32px;
          }
          
          /* Review Page Styling */
          .review-container {
            padding: 24px;
          }
          
          .review-header {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
          }
          
          .review-header h1 {
            margin: 0 0 8px 0;
            font-size: 1.8rem;
            color: var(--primary);
          }
          
          .review-header h2 {
            margin: 0;
            color: var(--text-secondary);
            font-size: 1.2rem;
          }
          
          .review-item {
            padding: 24px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border-left: 5px solid transparent;
          }
          
          .review-item.correct {
            border-left-color: var(--success);
            background: var(--success-light);
          }
          
          .review-item.incorrect {
            border-left-color: var(--danger);
            background: var(--danger-light);
          }
          
          .review-question {
            margin-bottom: 16px;
          }
          
          .question-number {
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-secondary);
          }
          
          .question-text {
            font-size: 1.1rem;
            line-height: 1.5;
          }
          
          .review-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
          }
          
          .review-option {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border-radius: 4px;
            background: white;
            border: 1px solid var(--border-color);
          }
          
          .review-option.correct-option {
            border-color: var(--success);
            background: var(--success-light);
          }
          
          .review-option.wrong-option {
            border-color: var(--danger);
            background: var(--danger-light);
          }
          
          .option-marker {
            font-weight: 600;
            margin-right: 12px;
            width: 24px;
          }
          
          .correct-icon {
            margin-left: auto;
            color: var(--success);
            font-size: 1.2rem;
          }
          
          .wrong-icon {
            margin-left: auto;
            color: var(--danger);
            font-size: 1.2rem;
          }
          
          .review-explanation {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px dashed var(--border-color);
            display: flex;
            gap: 32px;
          }
          
          .your-answer,
          .correct-answer {
            font-size: 0.9rem;
          }
          
          .review-actions {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 32px;
          }
          
          /* Animations */
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
          
          /* Responsive adjustments */
          @media (max-width: 992px) {
            .exam-body {
              flex-direction: column;
            }
            
            .question-sidebar {
              width: 100%;
              border-right: 0;
              border-bottom: 1px solid var(--border-color);
            }
            
            .question-grid {
              grid-template-columns: repeat(6, 1fr);
            }
            
            .result-summary {
              flex-direction: column;
            }
          }
          
          @media (max-width: 768px) {
            .exam-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }
            
            .exam-timer {
              align-self: flex-end;
            }
            
            .question-actions {
              flex-wrap: wrap;
              gap: 10px;
            }
            
            .result-stats {
              grid-template-columns: 1fr;
            }
            
            .stat-item.verdict {
              grid-column: span 1;
            }
            
            .review-explanation {
              flex-direction: column;
              gap: 8px;
            }
          }
        `}</style>
      </div>
    )
  );
}

export default WriteExam;
