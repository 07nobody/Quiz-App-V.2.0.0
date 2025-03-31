import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { getExamById } from '../../apicalls/exams';
import Instructions from './Instructions';
import { addReport } from '../../apicalls/reports';
import QuizProgressNav from '../../components/QuizProgressNav';
import QuizTimer from '../../components/QuizTimer';

function WriteExam() {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});
  const [timeUp, setTimeUp] = useState(false);
  const [view, setView] = useState('instructions');
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById(params.id);
      if (response.success) {
        setExamData(response.data);
        setQuestions(response.data.questions);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExamData();
  }, []);

  const calculateResult = async () => {
    try {
      let correctAnswers = 0;
      let wrongAnswers = 0;

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers++;
        } else if (selectedOptions[index]) {
          wrongAnswers++;
        }
      });

      let verdict = 'Pass';
      if (correctAnswers < examData.passingMarks) {
        verdict = 'Fail';
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
        totalQuestions: questions.length,
      };
      setResult(tempResult);

      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
      });
      dispatch(HideLoading());

      if (response.success) {
        setView('result');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: optionIndex,
    });
  };

  if (view === 'instructions') {
    return <Instructions examData={examData} setView={setView} />;
  }

  return (
    <div className="write-exam-screen">
      <div className="quiz-header">
        <h3 className="quiz-title">{examData?.name}</h3>
        <QuizTimer 
          duration={examData?.duration || 0} 
          onTimeUp={() => {
            setTimeUp(true);
            calculateResult();
          }} 
        />
      </div>

      <div className="question-container">
        <div className="question-content">
          <h4 className="question-text">
            Q{selectedQuestionIndex + 1}. {questions[selectedQuestionIndex]?.name}
          </h4>
          
          <div className="options-list">
            {questions[selectedQuestionIndex]?.options.map((option, index) => (
              <div
                key={index}
                className={`option-item ${
                  selectedOptions[selectedQuestionIndex] === index ? 'selected' : ''
                }`}
                onClick={() => handleOptionSelect(selectedQuestionIndex, index)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="navigation-controls">
          {selectedQuestionIndex > 0 && (
            <button
              className="nav-btn prev"
              onClick={() => setSelectedQuestionIndex(selectedQuestionIndex - 1)}
            >
              Previous
            </button>
          )}
          
          {selectedQuestionIndex < questions.length - 1 && (
            <button
              className="nav-btn next"
              onClick={() => setSelectedQuestionIndex(selectedQuestionIndex + 1)}
            >
              Next
            </button>
          )}
          
          {selectedQuestionIndex === questions.length - 1 && (
            <button
              className="nav-btn submit"
              onClick={calculateResult}
            >
              Submit
            </button>
          )}
        </div>
      </div>

      <QuizProgressNav
        questions={questions}
        selectedQuestionIndex={selectedQuestionIndex}
        setSelectedQuestionIndex={setSelectedQuestionIndex}
        selectedOptions={selectedOptions}
      />

      <style jsx>{`
        .write-exam-screen {
          padding: 20px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .quiz-title {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .question-container {
          flex: 1;
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .question-text {
          font-size: 1.1rem;
          margin-bottom: 20px;
          color: #2d3748;
          line-height: 1.5;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-item {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .option-item:hover {
          background: #f7fafc;
        }

        .option-item.selected {
          background: #ebf4ff;
          border-color: #4f46e5;
          color: #4f46e5;
        }

        .navigation-controls {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 20px;
        }

        .nav-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-btn.prev {
          background: #f3f4f6;
          color: #4b5563;
        }

        .nav-btn.next {
          background: #4f46e5;
          color: white;
        }

        .nav-btn.submit {
          background: #10b981;
          color: white;
        }

        .nav-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .write-exam-screen {
            padding: 12px;
            gap: 12px;
          }

          .quiz-header {
            padding: 8px 12px;
          }

          .quiz-title {
            font-size: 1rem;
          }

          .question-container {
            padding: 16px;
          }

          .question-text {
            font-size: 1rem;
            margin-bottom: 16px;
          }

          .option-item {
            padding: 10px 14px;
            font-size: 0.95rem;
          }

          .navigation-controls {
            gap: 8px;
            margin-top: 16px;
          }
        }

        @media (max-width: 480px) {
          .write-exam-screen {
            padding: 8px;
            gap: 8px;
          }

          .quiz-header {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }

          .question-container {
            padding: 12px;
          }

          .question-text {
            font-size: 0.95rem;
            margin-bottom: 12px;
          }

          .option-item {
            padding: 8px 12px;
            font-size: 0.9rem;
          }

          .nav-btn {
            padding: 8px 12px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default WriteExam;