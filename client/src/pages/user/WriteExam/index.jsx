import { message, Progress, Badge, Button, Tooltip, Modal } from "antd";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { motion, AnimatePresence } from "framer-motion";
import Instructions from "./Instructions";
import QuestionContainer from "./QuestionContainer";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EyeOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  WarningOutlined,
  SoundOutlined,
  MenuOutlined,
  StarOutlined
} from "@ant-design/icons";
import errorHandler from "../../../utils/errorHandler";
import AuthVerification from "./AuthVerification";
import QuizCompletionCard from "../../../components/QuizCompletionCard";

function WriteExam() {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});
  const [view, setView] = useState("auth"); // auth, instructions, questions, result
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [levelUp, setLevelUp] = useState(null);
  const [isShowingSidebar, setIsShowingSidebar] = useState(false);
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  const { currentTheme } = useTheme();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const audioRef = useRef(null);
  
  // Use simpler animation variants and lower animation workload
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 } // Reduced from 0.5
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  // Define sidebar animation for use in the component
  const sidebarAnimation = isShowingSidebar ? 
    { x: 0, transition: { type: "tween", duration: 0.2 } } : 
    { x: '100%', transition: { type: "tween", duration: 0.2 } };

  const getExamData = useCallback(async () => {
    await errorHandler.tryCatch(async () => {
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
    });
  }, [dispatch, params.id]);

  const calculateResult = useCallback(async () => {
    await errorHandler.tryCatch(async () => {
      let correctAnswers = [];
      let wrongAnswers = [];
      let skippedQuestions = [];

      questions.forEach((question, index) => {
        if (selectedOptions[index] === undefined) {
          skippedQuestions.push(question);
        } else if (question.correctOption === selectedOptions[index]) {
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
        skippedQuestions,
        verdict,
      };
      
      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
        secondsLeft,
        timeSpent: examData.duration - secondsLeft,
        examData: examData
      });
      
      dispatch(HideLoading());
      if (response.success) {
        if (response.levelUp) {
          setLevelUp(response.levelUp);
          playSound("levelup");
        } else if (verdict === "Pass") {
          playSound("success");
        } else {
          playSound("fail");
        }
        
        setView("result");
      } else {
        message.error(response.message);
      }
    });
  }, [dispatch, questions, selectedOptions, examData, params.id, user._id, secondsLeft]);

  const playSound = (type) => {
    if (!audioRef.current) return;
    
    switch(type) {
      case "warning":
        audioRef.current.src = "/sounds/warning.mp3";
        break;
      case "timeup":
        audioRef.current.src = "/sounds/timeup.mp3";
        break;
      case "success":
        audioRef.current.src = "/sounds/success.mp3";
        break;
      case "levelup":
        audioRef.current.src = "/sounds/levelup.mp3";
        break;
      case "fail":
        audioRef.current.src = "/sounds/fail.mp3";
        break;
      default:
        audioRef.current.src = "/sounds/click.mp3";
    }
    
    audioRef.current.play().catch(e => console.log("Audio play error:", e));
  };

  const resetExamState = () => {
    setSelectedQuestionIndex(0);
    setSelectedOptions({});
    setMarkedForReview([]);
    setSecondsLeft(examData.duration);
    setResult({});
    setTimeUp(false);
    setLevelUp(null);
    setIsTimeWarning(false);
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
        
        // Time warning when 20% time is left
        if (totalSeconds === Math.floor(examData.duration * 0.2) && !isTimeWarning) {
          setIsTimeWarning(true);
          message.warning({
            content: "Only 20% of your time remains!",
            duration: 5,
            icon: <ClockCircleOutlined style={{ color: "#ff4d4f" }} />
          });
          playSound("warning");
        }
      } else {
        playSound("timeup");
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
      playSound("click");
      setMarkedForReview([...markedForReview, index]);
    }
  };

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
  
  // Get stats about the exam progress
  const getProgress = useCallback(() => {
    const total = questions.length;
    const answered = Object.keys(selectedOptions).length;
    const review = markedForReview.length;
    const remaining = total - answered;
    const percent = (answered / total) * 100;
    
    return {
      total,
      answered,
      review,
      remaining,
      percent
    };
  }, [questions.length, selectedOptions, markedForReview]);

  // Show confirmation dialog before submitting or exiting
  const confirmAction = (action, message) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <InfoCircleOutlined />,
      content: message,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        if (action === 'submit') {
          clearInterval(intervalId);
          calculateResult();
        } else if (action === 'exit') {
          clearInterval(intervalId);
          navigate("/available-exams");
        }
      }
    });
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
    <AnimatePresence mode="wait">
      {examData && (
        <motion.div 
          className="write-exam-container"
          key={view}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <audio ref={audioRef} className="hidden" />
          
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
                    <Badge color={examData.isActive ? "green" : "red"} text={examData.category} />
                    <span>{questions.length} Questions</span>
                    <span>Total: {examData.totalMarks} pts</span>
                  </div>
                </div>
                
                <div className="exam-controls">
                  <div className={`exam-timer mobile-timer ${secondsLeft < examData.duration * 0.2 ? 'time-warning' : ''}`}>
                    <ClockCircleOutlined className="timer-icon" />
                    <span>{formatTime(secondsLeft)}</span>
                  </div>
                  
                  <Button 
                    icon={<MenuOutlined />}
                    className="sidebar-toggle"
                    onClick={() => setIsShowingSidebar(!isShowingSidebar)}
                    shape="circle"
                  />
                </div>
              </div>

              <div className="exam-body">
                {/* Mobile question navigation */}
                <div className="mobile-nav">
                  <div className="progress-container">
                    <Progress 
                      percent={getProgress().percent} 
                      size="small" 
                      showInfo={false}
                      strokeColor="var(--primary)"
                    />
                    <div className="progress-stats">
                      <span className="answered-count">{getProgress().answered} answered</span>
                      <span className="total-count">of {getProgress().total}</span>
                    </div>
                  </div>
                  
                  <div className="navigation-buttons">
                    <Tooltip title="Previous question">
                      <Button 
                        icon={<ArrowLeftOutlined />}
                        disabled={selectedQuestionIndex === 0}
                        onClick={() => {
                          setSelectedQuestionIndex(prev => prev - 1);
                          playSound("click");
                        }}
                        shape="circle"
                        className="nav-btn prev"
                      />
                    </Tooltip>
                    
                    <span className="question-counter">
                      {selectedQuestionIndex + 1} / {questions.length}
                    </span>
                    
                    <Tooltip title="Next question">
                      <Button 
                        icon={<ArrowRightOutlined />}
                        onClick={() => {
                          if (selectedQuestionIndex < questions.length - 1) {
                            setSelectedQuestionIndex(prev => prev + 1);
                            playSound("click");
                          }
                        }}
                        disabled={selectedQuestionIndex === questions.length - 1}
                        shape="circle"
                        className="nav-btn next"
                      />
                    </Tooltip>
                  </div>
                </div>

                {/* Question content */}
                <div className="question-content">
                  <AnimatePresence mode="wait">
                    <QuestionContainer
                      key={selectedQuestionIndex}
                      question={questions[selectedQuestionIndex]}
                      index={selectedQuestionIndex}
                      onSelect={(option) => {
                        playSound("click");
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                      selectedOption={selectedOptions[selectedQuestionIndex]}
                    />
                  </AnimatePresence>
                </div>

                {/* Mobile action buttons */}
                <div className="mobile-actions">
                  <Button
                    className={`action-button review-btn ${markedForReview.includes(selectedQuestionIndex) ? 'active' : ''}`}
                    icon={<EyeOutlined />}
                    onClick={() => toggleReviewStatus(selectedQuestionIndex)}
                  >
                    {markedForReview.includes(selectedQuestionIndex) ? 'Unmark' : 'Mark'} Review
                  </Button>
                  
                  {selectedQuestionIndex < questions.length - 1 ? (
                    <Button
                      className="action-button next-btn"
                      icon={<SaveOutlined />}
                      onClick={() => {
                        playSound("click");
                        setSelectedQuestionIndex(selectedQuestionIndex + 1);
                      }}
                      type="primary"
                    >
                      Save & Next
                    </Button>
                  ) : (
                    <Button
                      className="action-button submit-btn"
                      icon={<CheckOutlined />}
                      onClick={() => confirmAction('submit', 'Are you sure you want to submit your exam?')}
                      type="primary"
                      danger
                    >
                      Submit Exam
                    </Button>
                  )}
                </div>

                {/* Question sidebar - desktop and mobile overlay */}
                <motion.div 
                  className={`questions-sidebar ${isShowingSidebar ? 'showing' : ''}`}
                  animate={sidebarAnimation}
                >
                  <div className="sidebar-header">
                    <h2>Exam Progress</h2>
                    <Button 
                      icon={<CloseOutlined />} 
                      onClick={() => setIsShowingSidebar(false)}
                      shape="circle"
                      className="sidebar-close"
                    />
                  </div>
                  
                  <div className="timer-section">
                    <div className={`timer-display ${secondsLeft < examData.duration * 0.2 ? 'time-warning' : ''}`}>
                      <ClockCircleOutlined className="timer-icon" />
                      <span>{formatTime(secondsLeft)}</span>
                    </div>
                    
                    <Progress 
                      percent={(1 - secondsLeft / examData.duration) * 100} 
                      size="small" 
                      showInfo={false}
                      strokeColor={secondsLeft < examData.duration * 0.2 ? "#ff4d4f" : "var(--primary)"}
                    />
                  </div>
                  
                  <div className="progress-stats-detailed">
                    <div className="stats-item">
                      <div className="stats-number">{getProgress().answered}</div>
                      <div className="stats-label">Answered</div>
                    </div>
                    <div className="stats-item">
                      <div className="stats-number">{getProgress().review}</div>
                      <div className="stats-label">For Review</div>
                    </div>
                    <div className="stats-item">
                      <div className="stats-number">{getProgress().remaining}</div>
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
                          onClick={() => {
                            setSelectedQuestionIndex(index);
                            setIsShowingSidebar(false);
                            playSound("click");
                          }}
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
                        onClick={() => confirmAction('submit', 'Are you sure you want to submit your exam?')}
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
                        onClick={() => confirmAction('exit', 'Are you sure you want to exit? Your progress will be lost.')}
                        className="close-btn"
                        block
                      >
                        Exit Exam
                      </Button>
                    </div>
                  </div>
                </motion.div>
                
                {/* Overlay when sidebar is shown on mobile */}
                {isShowingSidebar && (
                  <motion.div 
                    className="sidebar-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsShowingSidebar(false)}
                  />
                )}
              </div>
            </div>
          )}

          {view === "result" && (
            <QuizCompletionCard
              result={result}
              examData={examData}
              levelUp={levelUp}
              onViewReview={() => navigate(`/user/exam-results/${params.id}`)}
              onTakeAgain={() => {
                resetExamState();
                setView("instructions");
              }}
              onViewReports={() => navigate("/user/reports")}
              onGoHome={() => navigate("/available-exams")}
            />
          )}
          
          <style jsx="true">{`
            .write-exam-container {
              display: flex;
              flex-direction: column;
              height: 100%;
              background-color: var(--background-primary);
              overflow: hidden;
            }
            
            .exam-ui {
              display: flex;
              flex-direction: column;
              height: 100vh;
              max-height: 100vh;
            }
            
            .exam-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px;
              border-bottom: 1px solid var(--border-color);
              background-color: var(--card-background);
              z-index: 10;
            }
            
            .exam-title-section {
              flex-grow: 1;
            }
            
            .exam-title {
              margin: 0;
              font-size: 1.3rem;
              font-weight: 600;
              color: var(--text-primary);
            }
            
            .exam-meta {
              display: flex;
              gap: 16px;
              color: var(--text-secondary);
              font-size: 0.85rem;
              margin-top: 4px;
              flex-wrap: wrap;
              align-items: center;
            }
            
            .exam-controls {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            
            .exam-timer {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 1.2rem;
              font-weight: 600;
              color: var(--primary);
              padding: 4px 12px;
              border-radius: 20px;
              background-color: var(--primary-light);
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
            
            .exam-body {
              display: flex;
              flex-grow: 1;
              position: relative;
              overflow: hidden;
            }
            
            /* Mobile navigation */
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
            
            /* Main question content */
            .question-content {
              flex-grow: 1;
              overflow-y: auto;
              padding: 16px;
              height: 100%;
            }
            
            /* Mobile action buttons */
            .mobile-actions {
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
            
            /* Question sidebar */
            .questions-sidebar {
              position: fixed;
              right: 0;
              top: 0;
              bottom: 0;
              width: 320px;
              background-color: var(--card-background);
              border-left: 1px solid var(--border-color);
              display: flex;
              flex-direction: column;
              z-index: 1000;
              box-shadow: -5px 0 15px rgba(0,0,0,0.1);
              padding: 16px;
              height: 100vh; /* Use viewport height */
              overflow-y: auto;
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
            
            .timer-section {
              margin-bottom: 20px;
            }
            
            .timer-display {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 16px;
              background-color: var(--primary-light);
              color: var(--primary);
              border-radius: 8px;
              font-size: 1.5rem;
              font-weight: 700;
              margin-bottom: 8px;
            }
            
            .timer-icon {
              font-size: 1.2rem;
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
            
            .sidebar-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: black;
              z-index: 999;
            }
            
            .hidden {
              display: none;
            }
            
            @media (min-width: 992px) {
              .exam-body {
                flex-direction: row;
              }
              
              .sidebar-toggle {
                display: none;
              }
              
              .questions-sidebar {
                position: relative;
                transform: none !important;
              }
              
              .sidebar-overlay {
                display: none;
              }
              
              .sidebar-close {
                display: none;
              }
              
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
            
            @media (max-width: 991px) {
              .questions-sidebar {
                transform: translateX(100%);
              }
            }
            
            @media (max-width: 576px) {
              .exam-title {
                font-size: 1.1rem;
              }
              
              .question-grid {
                grid-template-columns: repeat(4, 1fr);
              }
              
              .mobile-actions {
                flex-direction: column;
              }
            }
            
            /* Dark theme specific styles */
            .${currentTheme === 'dark' ? 'time-warning' : 'no-dark-mode'} {
              background-color: rgba(255, 77, 79, 0.2);
            }
            
            .${currentTheme === 'dark' ? 'questions-sidebar' : 'no-dark-mode'} {
              box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WriteExam;
