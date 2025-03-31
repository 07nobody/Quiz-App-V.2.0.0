import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Typography, 
  Card, 
  Select, 
  Button, 
  Row, 
  Col, 
  Radio, 
  Space, 
  Divider, 
  message, 
  Tag, 
  Tooltip,
  Alert,
  Modal
} from 'antd';
import { 
  BookOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  InfoCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  FlagOutlined 
} from '@ant-design/icons';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { getAllExams } from '../../../apicalls/exams';
import PageTitle from '../../../components/PageTitle';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function StudyRoom() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');
  
  const fetchExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        // Filter out exams that don't have questions
        const validExams = response.data.filter(exam => 
          exam.questions && exam.questions.length > 0
        );
        setExams(validExams);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleExamSelect = (examId) => {
    setLoadingQuestions(true);
    const exam = exams.find(e => e._id === examId);
    setSelectedExam(exam);
    
    if (exam?.questions) {
      // Shuffle questions for variety
      const shuffledQuestions = [...exam.questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);
      resetQuizState();
    } else {
      setQuestions([]);
    }
    setLoadingQuestions(false);
  };
  
  const resetQuizState = () => {
    setSelectedOption("");
    setShowExplanation(false);
    setIsAnswered(false);
    setTotalCorrect(0);
  };

  const handleOptionSelect = (value) => {
    if (!isAnswered) {
      setSelectedOption(value);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) {
      message.warn("Please select an answer");
      return;
    }
    
    setIsAnswered(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctOption) {
      setTotalCorrect(totalCorrect + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
      setShowExplanation(false);
      setIsAnswered(false);
    } else {
      message.success("You've completed all questions in this set!");
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption("");
      setShowExplanation(false);
      setIsAnswered(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackType) {
      message.warn("Please select a feedback type");
      return;
    }
    
    try {
      // Here you would make an API call to save the feedback
      // For now, we'll just show a success message
      message.success("Thank you for your feedback!");
      setFeedbackModalVisible(false);
      setFeedbackType('');
      setFeedbackComment('');
    } catch (error) {
      message.error("Failed to submit feedback");
    }
  };
  
  const renderFeedbackModal = () => (
    <Modal
      title="Question Feedback"
      open={feedbackModalVisible}
      onCancel={() => setFeedbackModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setFeedbackModalVisible(false)}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmitFeedback}
        >
          Submit Feedback
        </Button>
      ]}
    >
      <div className="feedback-form">
        <div className="feedback-type">
          <Text strong>What issue are you reporting?</Text>
          <Radio.Group 
            onChange={(e) => setFeedbackType(e.target.value)} 
            value={feedbackType}
          >
            <Space direction="vertical">
              <Radio value="confusing">Question is confusing</Radio>
              <Radio value="incorrect">Answer is incorrect</Radio>
              <Radio value="typo">Typo or grammatical error</Radio>
              <Radio value="other">Other issue</Radio>
            </Space>
          </Radio.Group>
        </div>
        
        <div className="feedback-comment" style={{ marginTop: 16 }}>
          <Text strong>Additional comments (optional):</Text>
          <textarea 
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            placeholder="Provide more details about the issue..."
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '8px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
              minHeight: '80px'
            }}
          />
        </div>
      </div>
    </Modal>
  );

  useEffect(() => {
    fetchExams();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="study-room-container">
      <PageTitle title="Study Mode" />
      
      <div className="study-mode-header">
        <div className="study-mode-info">
          <BookOutlined className="study-icon" />
          <div className="study-text">
            <Title level={4}>Study at your own pace</Title>
            <Text type="secondary">
              Practice questions without time limits and see explanations
            </Text>
          </div>
        </div>
        
        <div className="exam-selector">
          <Select
            placeholder="Select an exam to study"
            style={{ width: 300 }}
            onChange={handleExamSelect}
            loading={loadingQuestions}
          >
            {exams.map((exam) => (
              <Option key={exam._id} value={exam._id}>
                {exam.name} ({exam.questions?.length || 0} questions)
              </Option>
            ))}
          </Select>
        </div>
      </div>
      
      {selectedExam && questions.length > 0 ? (
        <Card className="question-card">
          <div className="question-header">
            <div className="question-progress">
              <Tag color="blue">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Tag>
              <Text type="secondary">
                Total Correct: {totalCorrect}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
              </Text>
            </div>
            
            <div className="question-actions">
              <Tooltip title="Report this question">
                <Button 
                  icon={<FlagOutlined />} 
                  onClick={() => setFeedbackModalVisible(true)}
                />
              </Tooltip>
            </div>
          </div>
          
          <div className="question-content">
            <Title level={4}>{currentQuestion?.name}</Title>
            
            {/* Display image if available */}
            {currentQuestion?.mediaType === 'image' && currentQuestion?.mediaUrl && (
              <div className="question-media">
                <img 
                  src={currentQuestion.mediaUrl} 
                  alt="Question media" 
                  style={{ maxWidth: '100%', maxHeight: '300px', marginBottom: '16px' }}
                />
              </div>
            )}
            
            <div className="options-container">
              <Radio.Group 
                onChange={(e) => handleOptionSelect(e.target.value)} 
                value={selectedOption}
                className="options-group"
              >
                <Space direction="vertical" className="options-space">
                  {currentQuestion?.options && Object.keys(currentQuestion.options).map((key) => (
                    currentQuestion.options[key] && (
                      <Radio key={key} value={key} className="option-item">
                        <div className="option-content">
                          <span className="option-key">{key}:</span> 
                          <span className="option-text">{currentQuestion.options[key]}</span>
                          {isAnswered && (
                            <>
                              {key === currentQuestion.correctOption && (
                                <CheckCircleOutlined className="option-icon correct" />
                              )}
                              {selectedOption === key && key !== currentQuestion.correctOption && (
                                <CloseCircleOutlined className="option-icon incorrect" />
                              )}
                            </>
                          )}
                        </div>
                      </Radio>
                    )
                  ))}
                </Space>
              </Radio.Group>
            </div>
            
            {isAnswered && (
              <div className="answer-feedback">
                {selectedOption === currentQuestion.correctOption ? (
                  <Alert 
                    message="Correct!" 
                    type="success" 
                    showIcon
                    icon={<CheckCircleOutlined />} 
                  />
                ) : (
                  <Alert 
                    message={`Incorrect! The correct answer is ${currentQuestion.correctOption}.`} 
                    type="error" 
                    showIcon
                    icon={<CloseCircleOutlined />} 
                  />
                )}
              </div>
            )}
            
            {isAnswered && currentQuestion.explanation && (
              <div className="explanation-section">
                <Button 
                  type="link" 
                  icon={<InfoCircleOutlined />}
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </Button>
                
                {showExplanation && (
                  <Alert
                    message="Explanation"
                    description={currentQuestion.explanation}
                    type="info"
                    showIcon
                  />
                )}
              </div>
            )}
          </div>
          
          <Divider />
          
          <div className="navigation-buttons">
            <Button 
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <Space>
              {!isAnswered ? (
                <Button 
                  type="primary" 
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                >
                  Check Answer
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next Question
                </Button>
              )}
            </Space>
          </div>
        </Card>
      ) : (
        <div className="empty-state">
          {selectedExam ? (
            <Alert
              message="No questions available"
              description="This exam doesn't have any questions yet. Please select another exam."
              type="info"
              showIcon
            />
          ) : (
            <Card className="welcome-card">
              <div className="welcome-content">
                <BookOutlined className="welcome-icon" />
                <Title level={3}>Welcome to Study Mode!</Title>
                <Paragraph>
                  Select an exam from the dropdown above to start practicing.
                  Study Mode lets you practice without time pressure and see explanations.
                </Paragraph>
                <ul className="feature-list">
                  <li>Practice at your own pace</li>
                  <li>See explanations for answers</li>
                  <li>No time limits</li>
                  <li>Track your progress</li>
                </ul>
              </div>
            </Card>
          )}
        </div>
      )}
      
      {renderFeedbackModal()}
      
      <style jsx="true">{`
        .study-room-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }
        
        .study-mode-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .study-mode-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .study-icon {
          font-size: 32px;
          color: var(--primary-color);
          background: var(--primary-color-light);
          padding: 12px;
          border-radius: 50%;
        }
        
        .question-card {
          background: var(--background-primary);
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          margin-bottom: 24px;
        }
        
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .question-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .options-container {
          margin: 24px 0;
        }
        
        .options-space {
          width: 100%;
        }
        
        .option-item {
          width: 100%;
          margin-bottom: 12px !important;
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          transition: all 0.3s;
        }
        
        .option-item:hover {
          background-color: var(--background-secondary);
        }
        
        .option-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .option-key {
          font-weight: bold;
          margin-right: 8px;
          color: var(--primary-color);
        }
        
        .option-text {
          flex: 1;
        }
        
        .option-icon {
          margin-left: auto;
          font-size: 18px;
        }
        
        .option-icon.correct {
          color: var(--success-color);
        }
        
        .option-icon.incorrect {
          color: var(--error-color);
        }
        
        .answer-feedback {
          margin: 16px 0;
        }
        
        .explanation-section {
          margin: 16px 0;
        }
        
        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 0;
        }
        
        .welcome-card {
          max-width: 600px;
          width: 100%;
        }
        
        .welcome-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .welcome-icon {
          font-size: 48px;
          color: var(--primary-color);
          margin-bottom: 24px;
        }
        
        .feature-list {
          text-align: left;
          width: 100%;
          max-width: 400px;
          margin-top: 16px;
        }
        
        .feature-list li {
          margin-bottom: 8px;
        }
        
        @media (max-width: 768px) {
          .study-mode-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .exam-selector {
            width: 100%;
          }
          
          .exam-selector .ant-select {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default StudyRoom;