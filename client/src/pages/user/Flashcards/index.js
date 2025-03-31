import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Empty, Select, Space, Radio, message } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  ReloadOutlined,
  StarOutlined,
  StarFilled,
  SoundOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import PageTitle from '../../../components/PageTitle';
import ResponsiveCard from '../../../components/ResponsiveCard';

const { Option } = Select;

function Flashcards() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [studyMode, setStudyMode] = useState('all'); // all, starred, unlearned
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedDeck) {
      loadFlashcards();
    }
  }, [selectedDeck, studyMode]);

  const loadFlashcards = async () => {
    try {
      dispatch(ShowLoading());
      // TODO: Replace with actual API call
      const mockCards = Array(10).fill().map((_, i) => ({
        id: i + 1,
        front: `Question ${i + 1}`,
        back: `Answer for question ${i + 1}`,
        isStarred: i % 3 === 0,
        lastReviewed: new Date(Date.now() - Math.random() * 864000000).toISOString(),
        confidence: Math.floor(Math.random() * 5),
        category: 'Mathematics'
      }));
      setCards(mockCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to load flashcards');
      console.error("Error loading flashcards:", error);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStar = () => {
    const updatedCards = [...cards];
    updatedCards[currentIndex].isStarred = !updatedCards[currentIndex].isStarred;
    setCards(updatedCards);
  };

  const handleConfidenceRating = (rating) => {
    const updatedCards = [...cards];
    updatedCards[currentIndex].confidence = rating;
    setCards(updatedCards);
  };

  const renderProgressBar = () => (
    <div className="progress-container">
      <Progress 
        percent={Math.round((currentIndex + 1) / cards.length * 100)} 
        size="small" 
        format={() => `${currentIndex + 1}/${cards.length}`}
      />
    </div>
  );

  const renderCard = () => {
    if (!cards.length) return null;
    const currentCard = cards[currentIndex];

    return (
      <div className="flashcard-wrapper" onClick={handleFlip}>
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="card-content">{currentCard.front}</div>
            </div>
            <div className="flashcard-back">
              <div className="card-content">{currentCard.back}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderControls = () => (
    <div className="controls">
      <Space size="large">
        <Button 
          icon={<LeftOutlined />} 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        />
        <Button 
          icon={cards[currentIndex]?.isStarred ? <StarFilled /> : <StarOutlined />}
          onClick={handleStar}
        />
        <Button 
          icon={<ReloadOutlined />} 
          onClick={() => setIsFlipped(!isFlipped)}
        />
        <Button 
          icon={<RightOutlined />} 
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        />
      </Space>
    </div>
  );

  const renderConfidenceRating = () => (
    <div className="confidence-rating">
      <Radio.Group
        value={cards[currentIndex]?.confidence}
        onChange={(e) => handleConfidenceRating(e.target.value)}
      >
        <Radio.Button value={1}>Again</Radio.Button>
        <Radio.Button value={2}>Hard</Radio.Button>
        <Radio.Button value={3}>Good</Radio.Button>
        <Radio.Button value={4}>Easy</Radio.Button>
      </Radio.Group>
    </div>
  );

  return (
    <div className="flashcards-container">
      <PageTitle 
        title="Flashcards" 
        subtitle="Review and memorize with interactive flashcards"
      />

      <div className="study-controls">
        <Select
          placeholder="Select a deck"
          style={{ width: 200 }}
          onChange={setSelectedDeck}
        >
          <Option value="mathematics">Mathematics</Option>
          <Option value="science">Science</Option>
          <Option value="english">English</Option>
        </Select>

        <Radio.Group 
          value={studyMode} 
          onChange={(e) => setStudyMode(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="all">All Cards</Radio.Button>
          <Radio.Button value="starred">Starred</Radio.Button>
          <Radio.Button value="unlearned">Unlearned</Radio.Button>
        </Radio.Group>
      </div>

      {cards.length > 0 ? (
        <div className="flashcards-content">
          {renderProgressBar()}
          {renderCard()}
          {renderControls()}
          {isFlipped && renderConfidenceRating()}
        </div>
      ) : (
        <Empty 
          description={
            selectedDeck 
              ? "No flashcards found in this deck" 
              : "Select a deck to start studying"
          }
        />
      )}

      <style jsx="true">{`
        .flashcards-container {
          padding: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .study-controls {
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .progress-container {
          margin-bottom: 1rem;
        }

        .flashcard-wrapper {
          perspective: 1000px;
          height: 400px;
          margin: 2rem 0;
          cursor: pointer;
        }

        .flashcard {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }

        .flashcard.flipped {
          transform: rotateY(180deg);
        }

        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transform-style: preserve-3d;
        }

        .flashcard-front,
        .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border-radius: var(--border-radius-lg);
          background: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .flashcard-back {
          transform: rotateY(180deg);
          background: var(--primary-light);
        }

        .card-content {
          font-size: 1.5rem;
          line-height: 1.4;
        }

        .controls {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }

        .confidence-rating {
          margin-top: 1.5rem;
          text-align: center;
        }

        @media (max-width: 768px) {
          .study-controls {
            flex-direction: column;
          }

          .flashcard-wrapper {
            height: 300px;
          }

          .card-content {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Flashcards;