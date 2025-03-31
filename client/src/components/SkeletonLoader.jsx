import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../contexts/ThemeContext';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const { currentTheme } = useTheme();

  // Configure skeleton colors based on theme
  const baseColor = currentTheme === 'light' ? '#e2e8f0' : '#334155';
  const highlightColor = currentTheme === 'light' ? '#f1f5f9' : '#475569';

  // Different skeleton layouts based on type
  const renderSkeleton = () => {
    switch (type) {
      case 'exam-card':
        return (
          <div className={`quiz-card-skeleton ${className}`}>
            <div className="header">
              <Skeleton width={180} height={25} baseColor={baseColor} highlightColor={highlightColor} />
              <Skeleton width={60} height={20} baseColor={baseColor} highlightColor={highlightColor} />
            </div>
            <div className="meta">
              <Skeleton count={3} width={100} height={15} baseColor={baseColor} highlightColor={highlightColor} />
            </div>
            <div className="description">
              <Skeleton count={2} baseColor={baseColor} highlightColor={highlightColor} />
            </div>
            <div className="footer">
              <Skeleton width={120} height={32} baseColor={baseColor} highlightColor={highlightColor} />
            </div>
          </div>
        );
        
      case 'table-row':
        return (
          <div className={`table-row-skeleton ${className}`}>
            <Skeleton count={count} height={50} baseColor={baseColor} highlightColor={highlightColor} />
          </div>
        );
        
      case 'profile':
        return (
          <div className={`profile-skeleton ${className}`}>
            <div className="avatar">
              <Skeleton circle width={80} height={80} baseColor={baseColor} highlightColor={highlightColor} />
            </div>
            <div className="details">
              <Skeleton width={150} height={25} baseColor={baseColor} highlightColor={highlightColor} />
              <Skeleton width={250} height={15} baseColor={baseColor} highlightColor={highlightColor} />
              <Skeleton width={200} height={15} baseColor={baseColor} highlightColor={highlightColor} />
            </div>
          </div>
        );
        
      case 'stats':
        return (
          <div className={`stats-skeleton ${className}`}>
            {[...Array(count)].map((_, i) => (
              <div key={i} className="stat-item">
                <Skeleton width={60} height={40} baseColor={baseColor} highlightColor={highlightColor} />
                <Skeleton width={100} height={15} baseColor={baseColor} highlightColor={highlightColor} />
              </div>
            ))}
          </div>
        );
        
      case 'question':
        return (
          <div className={`question-skeleton ${className}`}>
            <Skeleton height={100} baseColor={baseColor} highlightColor={highlightColor} />
            <div className="options">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={50} baseColor={baseColor} highlightColor={highlightColor} />
              ))}
            </div>
          </div>
        );
        
      case 'card': 
      default:
        return <Skeleton count={count} baseColor={baseColor} highlightColor={highlightColor} className={className} />;
    }
  };

  return (
    <>
      {renderSkeleton()}
      <style jsx="true">{`
        .quiz-card-skeleton {
          padding: 16px;
          border-radius: 8px;
          background: ${currentTheme === 'light' ? 'white' : '#1e293b'};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .meta {
          display: flex;
          justify-content: space-between;
        }
        
        .profile-skeleton {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .stats-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }
        
        .stat-item {
          padding: 16px;
          border-radius: 8px;
          background: ${currentTheme === 'light' ? 'white' : '#1e293b'};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .question-skeleton {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      `}</style>
    </>
  );
};

export default SkeletonLoader;