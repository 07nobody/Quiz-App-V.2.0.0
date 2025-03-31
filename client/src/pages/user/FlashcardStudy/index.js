import React, { useState, useEffect } from 'react';
import { 
  Button, Card, Progress, Tag, Space, message, 
  Tooltip, Modal, Rate, Divider 
} from 'antd';
import { 
  ArrowLeftOutlined, ArrowRightOutlined, 
  ReloadOutlined, StarOutlined, StarFilled,
  SoundOutlined, EditOutlined, InfoCircleOutlined,
  ClockCircleOutlined, CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import {
  getDeckFlashcards,
  reviewFlashcard,
  updateFlashcard,
  getDeckStats
} from '../../../apicalls/flashcards';
import PageTitle from '../../../components/PageTitle';
import ResponsiveCard from '../../../components/ResponsiveCard';

function FlashcardStudy() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stats, setStats] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const { deckId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    loadCards();
    loadStats();
  }, []);

  useEffect(() => {
    if (cards.length > 0) {
      setStartTime(Date.now());
    }
  }, [currentIndex]);

  const loadCards = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getDeckFlashcards(deckId);
      if (response.success) {
        setCards(response.data);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to load flashcards');
    }
  };

  const loadStats = async () => {
    try {
      const response = await getDeckStats(deckId);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      message.error('Failed to load deck statistics');
    }
  };

  const handleNext = async () => {
    if (confidence > 0) {
      const timeSpent = Date.now() - startTime;
      await submitReview(timeSpent);
      setConfidence(0);
      
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setShowHint(false);
      } else {
        showCompletionModal();
      }
    } else {
      message.warning('Please rate your confidence before moving to the next card');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowHint(false);
      setConfidence(0);
    }
  };

  const submitReview = async (timeSpent) => {
    try {
      const card = cards[currentIndex];
      await reviewFlashcard(card._id, {
        confidence,
        timeSpent
      });
    } catch (error) {
      message.error('Failed to save review');
    }
  };

  const toggleStar = async () => {
    try {
      const card = cards[currentIndex];
      const response = await updateFlashcard(card._id, {
        isStarred: !card.isStarred
      });
      if (response.success) {
        const updatedCards = [...cards];
        updatedCards[currentIndex] = {
          ...card,
          isStarred: !card.isStarred
        };
        setCards(updatedCards);
      }
    } catch (error) {
      message.error('Failed to update card');
    }
  };

  const showCompletionModal = () => {
    Modal.success({
      title: 'Study Session Complete!',
      content: (
        <div className="completion-modal">
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-value">{cards.length}</div>
              <div className="stat-label">Cards Reviewed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {cards.filter(c => c.confidenceLevel >= 4).length}
              </div>
              <div className="stat-label">Mastered</div>
            </div>
          </div>
          <Divider />
          <div className="next-review">
            Next review recommended in: 
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {cards[currentIndex].interval} days
            </Tag>
          </div>
        </div>
      ),
      onOk: () => navigate('/decks')
    });
  };

  const renderProgress = () => (
    <div className="progress-section">
      <Progress 
        percent={Math.round((currentIndex / cards.length) * 100)} 
        size="small"
        format={() => \`\${currentIndex + 1} / \${cards.length}\`}
      />
    </div>
  );

  const renderControls = () => (
    <div className="controls-section">
      <Space size="middle">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button 
          type="primary"
          icon={<ArrowRightOutlined />} 
          onClick={handleNext}
          disabled={confidence === 0}
        >
          {currentIndex === cards.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Space>
    </div>
  );

  const renderConfidenceRating = () => (
    <div className="confidence-section">
      <div className="confidence-label">
        Rate your confidence:
      </div>
      <Rate 
        value={confidence}
        onChange={setConfidence}
        character={({ index }) => {
          const icons = [
            <CloseOutlined style={{ color: '#ff4d4f' }} />,
            <CloseOutlined style={{ color: '#ffa39e' }} />,
            <CheckOutlined style={{ color: '#95de64' }} />,
            <CheckOutlined style={{ color: '#73d13d' }} />,
            <CheckOutlined style={{ color: '#52c41a' }} />
          ];
          return icons[index];
        }}
      />
      <div className="confidence-text">
        {confidence === 0 && 'Click to rate'}
        {confidence === 1 && 'Need more review'}
        {confidence === 2 && 'Somewhat familiar'}
        {confidence === 3 && 'Good understanding'}
        {confidence === 4 && 'Very confident'}
        {confidence === 5 && 'Perfect recall'}
      </div>
    </div>
  );

  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return (
      <div className="flashcard-study-container">
        <PageTitle 
          title="Study Session"
          subtitle="Loading flashcards..."
        />
      </div>
    );
  }

  return (
    <div className="flashcard-study-container">
      <PageTitle 
        title="Study Session"
        subtitle={stats ? \`Mastered: \${stats.masteredCards} / \${stats.totalCards} cards\` : ''}
      />

      {renderProgress()}

      <div className="flashcard-container">
        <ResponsiveCard onClick={() => setIsFlipped(!isFlipped)}>
          <div className={\`flashcard \${isFlipped ? 'flipped' : ''}\`}>
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div className="card-content">
                  {currentCard.front}
                </div>
                <div className="card-footer">
                  <Space>
                    {currentCard.hints?.length > 0 && (
                      <Tooltip title="Show Hint">
                        <Button 
                          icon={<InfoCircleOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(!showHint);
                          }}
                        />
                      </Tooltip>
                    )}
                    {currentCard.media && (
                      <Tooltip title="Play Audio">
                        <Button 
                          icon={<SoundOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement audio playback
                          }}
                        />
                      </Tooltip>
                    )}
                    <Tooltip title={currentCard.isStarred ? 'Unstar' : 'Star'}>
                      <Button 
                        icon={currentCard.isStarred ? <StarFilled /> : <StarOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar();
                        }}
                      />
                    </Tooltip>
                  </Space>
                </div>
                {showHint && currentCard.hints?.length > 0 && (
                  <div className="hint-section">
                    <div className="hint-label">Hint:</div>
                    <div className="hint-content">{currentCard.hints[0]}</div>
                  </div>
                )}
              </div>
              <div className="flashcard-back">
                <div className="card-content">
                  {currentCard.back}
                </div>
                {currentCard.examples?.length > 0 && (
                  <div className="examples-section">
                    <div className="examples-label">Example:</div>
                    <div className="examples-content">
                      {currentCard.examples[0]}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResponsiveCard>
      </div>

      {renderConfidenceRating()}
      {renderControls()}

      <style jsx="true">{`
        .flashcard-study-container {
          padding: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .progress-section {
          margin-bottom: 2rem;
        }

        .flashcard-container {
          perspective: 1000px;
          margin-bottom: 2rem;
        }

        .flashcard {
          position: relative;
          width: 100%;
          height: 300px;
          cursor: pointer;
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
          transform-style: preserve-3d;
        }

        .flashcard-front,
        .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
        }

        .flashcard-back {
          transform: rotateY(180deg);
        }

        .card-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          text-align: center;
        }

        .card-footer {
          display: flex;
          justify-content: center;
          padding-top: 1rem;
        }

        .hint-section,
        .examples-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
          font-size: 0.9rem;
        }

        .hint-label,
        .examples-label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }

        .confidence-section {
          margin: 2rem 0;
          text-align: center;
        }

        .confidence-label {
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .confidence-text {
          margin-top: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .controls-section {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .completion-modal .stats-row {
          display: flex;
          justify-content: space-around;
          text-align: center;
          margin: 1rem 0;
        }

        .completion-modal .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary);
        }

        .completion-modal .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .completion-modal .next-review {
          text-align: center;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .flashcard {
            height: 250px;
          }

          .card-content {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default FlashcardStudy;