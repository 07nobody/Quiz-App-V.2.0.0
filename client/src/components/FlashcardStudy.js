import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Space, Progress, Rate, Result } from 'antd';
import { 
  ArrowLeftOutlined, ArrowRightOutlined,
  EyeOutlined, ReloadOutlined, CheckOutlined 
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import { getSettingsByCategory } from '../apicalls/settings';
import { updateFlashcard, getDueFlashcards } from '../apicalls/flashcards';

// SuperMemo 2 algorithm implementation
const calculateNextReview = (confidence, previousInterval = 1, easeFactor = 2.5, consecutiveCorrect = 0) => {
  const normalizedConfidence = (confidence - 1) / 4;
  
  // Enhanced retention optimization
  const retentionFactor = Math.min(1.3, 1 + (consecutiveCorrect * 0.1));
  
  if (confidence < 3) {
    return {
      interval: Math.max(1, Math.floor(previousInterval * 0.5)), // More gradual backoff
      easeFactor: Math.max(1.3, easeFactor - 0.15 - (3 - confidence) * 0.1),
      consecutiveCorrect: 0
    };
  }

  let nextInterval;
  if (previousInterval === 1) {
    nextInterval = confidence >= 4 ? 3 : 1;
  } else if (previousInterval === 3) {
    nextInterval = confidence >= 4 ? 7 : 4;
  } else {
    // Apply retention factor and confidence-based adjustment
    const intervalMultiplier = easeFactor * retentionFactor * (0.8 + normalizedConfidence * 0.4);
    nextInterval = Math.round(previousInterval * intervalMultiplier);
  }

  // Cap maximum interval at 365 days
  nextInterval = Math.min(365, nextInterval);

  const newEaseFactor = easeFactor + (0.1 - (5 - confidence) * (0.08 + (5 - confidence) * 0.02));

  return {
    interval: nextInterval,
    easeFactor: Math.max(1.3, Math.min(3.0, newEaseFactor)),
    consecutiveCorrect: confidence >= 4 ? consecutiveCorrect + 1 : 0
  };
};

function FlashcardStudy({ deckId }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studySettings, setStudySettings] = useState(null);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const { studyMode } = useTheme();

  const loadStudySettings = async () => {
    try {
      const response = await getSettingsByCategory('study');
      if (response.success) {
        const settings = {};
        response.data.forEach(setting => {
          settings[setting.key] = setting.value;
        });
        setStudySettings(settings);
      }
    } catch (error) {
      console.error('Failed to load study settings:', error);
    }
  };

  const loadDueCards = useCallback(async () => {
    if (!studySettings) return;
    
    try {
      const response = await getDueFlashcards(deckId);
      if (response.success) {
        // Sort cards by due date and limit to cardsPerSession
        const sortedCards = response.data
          .sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview))
          .slice(0, studySettings.cardsPerSession);
        
        setCards(sortedCards);
      }
    } catch (error) {
      console.error('Failed to load flashcards:', error);
    }
  }, [deckId, studySettings]);

  useEffect(() => {
    loadStudySettings();
  }, []);

  useEffect(() => {
    if (studySettings) {
      loadDueCards();
    }
  }, [loadDueCards, studySettings]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionComplete(true);
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

  const handleConfidenceRating = async (rating) => {
    const currentCard = cards[currentIndex];
    const { interval, easeFactor, consecutiveCorrect } = calculateNextReview(
      rating,
      currentCard.reviewInterval,
      currentCard.easeFactor,
      currentCard.consecutiveCorrect || 0
    );

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    try {
      await updateFlashcard({
        id: currentCard._id,
        data: {
          lastReviewed: new Date(),
          nextReview,
          reviewInterval: interval,
          easeFactor,
          consecutiveCorrect,
          totalReviews: (currentCard.totalReviews || 0) + 1,
          successfulReviews: (currentCard.successfulReviews || 0) + (rating >= 3 ? 1 : 0),
          lastConfidence: rating
        }
      });

      // Update study stats immediately
      updateStudyStats(rating >= 3);
      setSessionProgress(((currentIndex + 1) / cards.length) * 100);
      handleNext();
    } catch (error) {
      console.error('Failed to update flashcard:', error);
    }
  };

  if (!studySettings || cards.length === 0) {
    return (
      <Result
        icon={<CheckOutlined />}
        title="No cards due for review!"
        subTitle="Great job! You're all caught up with your reviews."
        extra={
          <Button type="primary" onClick={loadDueCards}>
            <ReloadOutlined /> Check Again
          </Button>
        }
      />
    );
  }

  if (sessionComplete) {
    return (
      <Result
        status="success"
        title="Study Session Complete!"
        subTitle={\`You've reviewed \${cards.length} cards. Great job!\`}
        extra={[
          <Button key="again" type="primary" onClick={() => {
            setSessionComplete(false);
            setCurrentIndex(0);
            loadDueCards();
          }}>
            Start New Session
          </Button>
        ]}
      />
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flashcard-study">
      <Progress
        percent={sessionProgress}
        status="active"
        showInfo={false}
        className="study-progress"
      />
      
      <Card
        className={\`flashcard \${isFlipped ? 'flipped' : ''} mode-\${studyMode}\`}
        onClick={handleFlip}
      >
        <div className="card-content">
          <div className="front">
            {currentCard.front}
          </div>
          <div className="back">
            {currentCard.back}
          </div>
        </div>
      </Card>

      <Space direction="vertical" className="controls">
        <Space>
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            icon={<ArrowLeftOutlined />}
          >
            Previous
          </Button>
          <Button
            onClick={handleFlip}
            icon={<EyeOutlined />}
          >
            Flip
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            icon={<ArrowRightOutlined />}
          >
            Next
          </Button>
        </Space>

        {isFlipped && (
          <div className="confidence-rating">
            <p>How well did you know this?</p>
            <Rate
              count={5}
              onChange={handleConfidenceRating}
              tooltips={[
                'Complete blackout',
                'Wrong, but familiar',
                'Got it, but barely',
                'Got it after thinking',
                'Perfect recall'
              ]}
            />
          </div>
        )}
      </Space>

      <style jsx="true">{`
        .flashcard-study {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .study-progress {
          margin-bottom: 1rem;
        }

        .flashcard {
          perspective: 1000px;
          height: 400px;
          cursor: pointer;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .flashcard.flipped {
          transform: rotateY(180deg);
        }

        .card-content {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          padding: 2rem;
        }

        .front, .back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back {
          transform: rotateY(180deg);
        }

        .controls {
          margin-top: 2rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confidence-rating {
          text-align: center;
          margin-top: 1rem;
        }

        .mode-focus {
          background-color: var(--background-primary);
          color: var(--text-primary);
          box-shadow: var(--card-shadow);
        }

        .mode-night {
          background-color: var(--background-primary);
          color: var(--text-primary);
        }

        .mode-dyslexic {
          font-family: var(--font-family);
          line-height: var(--line-height);
          letter-spacing: var(--letter-spacing);
        }
      `}</style>
    </div>
  );
}

export default FlashcardStudy;