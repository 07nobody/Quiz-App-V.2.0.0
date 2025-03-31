import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Checkbox, Input, Typography, Space, Card } from 'antd';
import { QUESTION_TYPES } from '@constants';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * QuestionCard Component
 * Renders different types of quiz questions based on question type
 */
const QuestionCard = ({
  question,
  selectedOptions,
  onChange,
  disabled = false,
  showAnswer = false,
  className = '',
}) => {
  const renderOptions = () => {
    const { type, options, answer } = question;

    switch (type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return (
          <Radio.Group 
            onChange={(e) => onChange(e.target.value)} 
            value={selectedOptions} 
            disabled={disabled}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {options.map((option, index) => (
                <Radio 
                  key={index} 
                  value={option} 
                  className={`
                    p-3 border rounded-md w-full
                    ${showAnswer && answer === option ? 'bg-success/10 border-success' : ''}
                    ${showAnswer && selectedOptions === option && option !== answer ? 'bg-danger/10 border-danger' : ''}
                  `}
                >
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <Checkbox.Group
            onChange={(values) => onChange(values)}
            value={selectedOptions || []}
            disabled={disabled}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              {options.map((option, index) => {
                const isCorrectAnswer = answer.includes(option);
                const isSelectedWrongly = selectedOptions?.includes(option) && !isCorrectAnswer;
                const isCorrectlySelected = selectedOptions?.includes(option) && isCorrectAnswer;
                
                return (
                  <Checkbox
                    key={index}
                    value={option}
                    className={`
                      p-3 border rounded-md w-full
                      ${showAnswer && isCorrectAnswer ? 'bg-success/10 border-success' : ''}
                      ${showAnswer && isSelectedWrongly ? 'bg-danger/10 border-danger' : ''}
                      ${showAnswer && isCorrectlySelected ? 'bg-success/10 border-success' : ''}
                    `}
                  >
                    {option}
                  </Checkbox>
                );
              })}
            </Space>
          </Checkbox.Group>
        );

      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <Radio.Group 
            onChange={(e) => onChange(e.target.value)} 
            value={selectedOptions} 
            disabled={disabled}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              <Radio 
                value="true" 
                className={`
                  p-3 border rounded-md w-full
                  ${showAnswer && answer === 'true' ? 'bg-success/10 border-success' : ''}
                  ${showAnswer && selectedOptions === 'true' && answer !== 'true' ? 'bg-danger/10 border-danger' : ''}
                `}
              >
                True
              </Radio>
              <Radio 
                value="false" 
                className={`
                  p-3 border rounded-md w-full
                  ${showAnswer && answer === 'false' ? 'bg-success/10 border-success' : ''}
                  ${showAnswer && selectedOptions === 'false' && answer !== 'false' ? 'bg-danger/10 border-danger' : ''}
                `}
              >
                False
              </Radio>
            </Space>
          </Radio.Group>
        );

      case QUESTION_TYPES.SHORT_ANSWER:
        return (
          <div>
            <Input
              placeholder="Type your answer here..."
              value={selectedOptions}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="w-full"
            />
            {showAnswer && (
              <div className="mt-3 p-3 bg-success/10 border border-success rounded-md">
                <Text strong className="text-success">Correct Answer:</Text>
                <Paragraph className="mt-1">{answer}</Paragraph>
              </div>
            )}
          </div>
        );

      case QUESTION_TYPES.LONG_ANSWER:
        return (
          <div>
            <TextArea
              placeholder="Type your answer here..."
              value={selectedOptions}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              rows={4}
              className="w-full"
            />
            {showAnswer && (
              <div className="mt-3 p-3 bg-success/10 border border-success rounded-md">
                <Text strong className="text-success">Suggested Answer:</Text>
                <Paragraph className="mt-1">{answer}</Paragraph>
              </div>
            )}
          </div>
        );

      default:
        return <Text type="danger">Unsupported question type</Text>;
    }
  };

  return (
    <Card className={`shadow-sm transition-all hover:shadow-md ${className}`}>
      <div className="mb-4">
        <Space className="mb-1">
          <Text type="secondary">Question {question.index || ''}:</Text>
          {question.marks && <Text type="secondary">[{question.marks} {question.marks === 1 ? 'mark' : 'marks'}]</Text>}
        </Space>
        <Title level={5} className="mb-3">{question.questionText}</Title>
        {question.description && (
          <Paragraph className="text-text-secondary mb-4">{question.description}</Paragraph>
        )}
        {question.image && (
          <div className="mb-4">
            <img 
              src={question.image} 
              alt="Question" 
              className="max-w-full h-auto rounded-md border" 
            />
          </div>
        )}
      </div>
      {renderOptions()}
      
      {showAnswer && question.explanation && (
        <div className="mt-4 p-3 bg-info/5 border border-info/30 rounded-md">
          <Text strong>Explanation:</Text>
          <Paragraph className="mt-1">{question.explanation}</Paragraph>
        </div>
      )}
    </Card>
  );
};

QuestionCard.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string.isRequired,
    questionText: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    options: PropTypes.array,
    answer: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    explanation: PropTypes.string,
    marks: PropTypes.number,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  selectedOptions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  showAnswer: PropTypes.bool,
  className: PropTypes.string,
};

export default QuestionCard;