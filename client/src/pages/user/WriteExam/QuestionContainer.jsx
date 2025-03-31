import React from "react";
import { motion } from "framer-motion";
import { Tooltip } from "antd";
import { useTheme } from "../../../contexts/ThemeContext";

function QuestionContainer({ question, index, onSelect, selectedOption }) {
  const { currentTheme } = useTheme();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const optionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      className="question-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="question-header"
        variants={contentVariants}
      >
        <h2 className="question-number">Question {index + 1}</h2>
        {question.points && (
          <span className="question-points">
            {question.points} {question.points > 1 ? 'points' : 'point'}
          </span>
        )}
      </motion.div>

      <motion.div 
        className="question-content"
        variants={contentVariants}
      >
        <motion.div 
          className="question-text"
          dangerouslySetInnerHTML={{ __html: question.name }}
        />
        
        <div className="options-container">
          {Object.keys(question.options).map((option, optionIndex) => (
            <Tooltip 
              title={selectedOption === option ? "Selected" : "Click to select"} 
              placement="right"
              key={option}
            >
              <motion.div
                className={`option-item ${selectedOption === option ? "selected-option" : ""}`}
                onClick={() => onSelect(option)}
                variants={optionVariants}
                whileHover="hover"
                whileTap="tap"
                custom={optionIndex}
                role="button"
                tabIndex={0}
                aria-checked={selectedOption === option}
                aria-label={`Option ${option}: ${question.options[option]}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelect(option);
                  }
                }}
              >
                <div className="option-indicator">
                  <span>{option}</span>
                </div>
                <div 
                  className="option-text"
                  dangerouslySetInnerHTML={{ __html: question.options[option] }}
                />
              </motion.div>
            </Tooltip>
          ))}
        </div>
      </motion.div>

      <style jsx="true">{`
        .question-container {
          background-color: var(--card-background);
          border-radius: var(--border-radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--border-color);
        }

        .question-number {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .question-points {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.9rem;
        }

        .question-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .question-text {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--text-primary);
          font-weight: 500;
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-item {
          display: flex;
          align-items: center;
          padding: 14px;
          border-radius: var(--border-radius);
          background-color: var(--background-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--border-color);
          gap: 12px;
        }

        .option-item:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        .option-indicator {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--background-tertiary);
          color: var(--text-secondary);
          font-weight: 600;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .option-text {
          flex: 1;
          color: var(--text-primary);
        }

        .selected-option {
          background-color: var(--primary-light);
          border-color: var(--primary);
        }

        .selected-option .option-indicator {
          background-color: var(--primary);
          color: white;
        }

        @media (max-width: 576px) {
          .question-container {
            padding: 16px;
            margin-bottom: 16px;
          }

          .question-header {
            margin-bottom: 16px;
          }

          .question-text {
            font-size: 1rem;
          }

          .option-item {
            padding: 12px;
          }
        }

        /* Dark theme specific styles */
        .${currentTheme === 'dark' ? 'question-container' : 'no-dark-mode'} {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .${currentTheme === 'dark' ? 'option-item' : 'no-dark-mode'} {
          background-color: var(--background-tertiary);
        }

        .${currentTheme === 'dark' ? 'selected-option' : 'no-dark-mode'} {
          background-color: rgba(var(--primary-rgb), 0.2);
        }
      `}</style>
    </motion.div>
  );
}

export default QuestionContainer;