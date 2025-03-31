import React, { useState } from 'react';
import { Modal, Radio, Space, Button, Input, Typography, message, Rate, Tag } from 'antd';
import { 
  FlagOutlined, 
  BulbOutlined, 
  QuestionCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

/**
 * Question Feedback Component
 * 
 * Allows users to provide feedback on questions, report issues,
 * and suggest improvements
 * 
 * @param {Object} props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.question - The question object being reviewed
 * @param {string} props.examId - The ID of the exam the question belongs to
 * @param {string} props.questionId - The ID of the question being reviewed
 */
const QuestionFeedback = ({ 
  visible, 
  onClose, 
  question, 
  examId, 
  questionId 
}) => {
  const [feedbackType, setFeedbackType] = useState('');
  const [comment, setComment] = useState('');
  const [difficultyRating, setDifficultyRating] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!feedbackType) {
      message.warning('Please select a feedback type');
      return;
    }

    try {
      setSubmitting(true);
      
      // In a real app, you'd make an API call here to submit the feedback
      // Example:
      // await submitQuestionFeedback({
      //   examId,
      //   questionId,
      //   feedbackType,
      //   comment,
      //   difficultyRating
      // });
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      message.success('Thank you for your feedback!');
      
      // Reset after 2 seconds and close
      setTimeout(() => {
        handleReset();
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      message.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFeedbackType('');
    setComment('');
    setDifficultyRating(3);
    setSuccess(false);
  };

  const feedbackTypes = [
    { 
      value: 'incorrect_answer', 
      label: 'Incorrect answer', 
      description: 'The answer marked as correct is wrong',
      icon: <CloseCircleOutlined style={{ color: '#f5222d' }} />
    },
    { 
      value: 'confusing', 
      label: 'Question is confusing', 
      description: 'The question is unclear or poorly worded',
      icon: <QuestionCircleOutlined style={{ color: '#faad14' }} />
    },
    { 
      value: 'typo', 
      label: 'Typo or grammatical error', 
      description: 'There are spelling or grammar mistakes',
      icon: <FlagOutlined style={{ color: '#1890ff' }} />
    },
    { 
      value: 'improvement', 
      label: 'Suggestion for improvement', 
      description: 'I have an idea to make this question better',
      icon: <BulbOutlined style={{ color: '#52c41a' }} />
    },
    { 
      value: 'other', 
      label: 'Other issue', 
      description: 'Another issue not listed above',
      icon: <FlagOutlined style={{ color: '#722ed1' }} />
    }
  ];

  const renderSuccessContent = () => (
    <div className="feedback-success">
      <div className="success-icon">
        <CheckCircleOutlined />
      </div>
      <Title level={4}>Thank You!</Title>
      <Paragraph>
        Your feedback has been submitted successfully. Our team will review it soon.
      </Paragraph>
    </div>
  );

  const renderFeedbackForm = () => (
    <div className="feedback-form">
      <div className="question-preview">
        <Text strong>Question:</Text>
        <div className="question-text">
          {question?.name || 'Question content not available'}
        </div>
        
        {question?.correctOption && (
          <Tag color="green" className="correct-answer">
            Correct answer: {question.correctOption}
          </Tag>
        )}
      </div>

      <div className="feedback-section">
        <Text strong>What issue are you reporting?</Text>
        <Radio.Group 
          onChange={(e) => setFeedbackType(e.target.value)} 
          value={feedbackType}
          className="feedback-options"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {feedbackTypes.map(type => (
              <Radio 
                key={type.value} 
                value={type.value}
                className="feedback-option-item"
              >
                <div className="feedback-option-content">
                  <div className="feedback-option-icon">
                    {type.icon}
                  </div>
                  <div className="feedback-option-text">
                    <Text strong>{type.label}</Text>
                    <Text type="secondary" className="option-description">
                      {type.description}
                    </Text>
                  </div>
                </div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>

      <div className="difficulty-section">
        <Text strong>How difficult was this question?</Text>
        <div className="difficulty-rating">
          <Rate 
            value={difficultyRating} 
            onChange={setDifficultyRating} 
          />
          <Text type="secondary" className="difficulty-label">
            {
              difficultyRating === 1 ? 'Very Easy' :
              difficultyRating === 2 ? 'Easy' :
              difficultyRating === 3 ? 'Moderate' :
              difficultyRating === 4 ? 'Difficult' :
              'Very Difficult'
            }
          </Text>
        </div>
      </div>
      
      <div className="comment-section">
        <Text strong>Additional comments (optional):</Text>
        <TextArea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please provide more details about the issue..."
          rows={4}
          className="comment-textarea"
        />
      </div>
    </div>
  );

  return (
    <Modal
      title={
        <div className="feedback-modal-title">
          <FlagOutlined className="title-icon" />
          <span>Question Feedback</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={success ? null : [
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          loading={submitting}
        >
          Submit Feedback
        </Button>
      ]}
      width={520}
      destroyOnClose
      className="question-feedback-modal"
    >
      {success ? renderSuccessContent() : renderFeedbackForm()}

      <style jsx="true">{`
        .feedback-modal-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .title-icon {
          color: var(--primary-color);
        }
        
        .question-preview {
          margin-bottom: 16px;
          padding: 12px;
          background-color: var(--background-secondary);
          border-radius: var(--border-radius);
          border-left: 3px solid var(--primary-color);
        }
        
        .question-text {
          margin: 8px 0;
          font-size: 14px;
        }
        
        .correct-answer {
          margin-top: 8px;
        }
        
        .feedback-section, 
        .difficulty-section,
        .comment-section {
          margin-bottom: 16px;
        }
        
        .feedback-options {
          margin-top: 8px;
          width: 100%;
        }
        
        .feedback-option-item {
          padding: 8px 0;
          display: block;
          width: 100%;
        }
        
        .feedback-option-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .feedback-option-icon {
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .feedback-option-text {
          display: flex;
          flex-direction: column;
        }
        
        .option-description {
          font-size: 12px;
        }
        
        .difficulty-rating {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .difficulty-label {
          margin-left: 8px;
        }
        
        .comment-textarea {
          margin-top: 8px;
          resize: vertical;
        }
        
        .feedback-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 0;
        }
        
        .success-icon {
          font-size: 48px;
          color: var(--success-color);
          margin-bottom: 16px;
        }
        
        @media (max-width: 576px) {
          .feedback-option-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          
          .feedback-option-icon {
            margin-left: 8px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default QuestionFeedback;