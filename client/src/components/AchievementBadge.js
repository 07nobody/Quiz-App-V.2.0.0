import React from 'react';
import { Tooltip, Badge } from 'antd';
import { motion } from 'framer-motion';
import {
  TrophyOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  FireOutlined,
  StarOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  BookOutlined,
  SafetyOutlined
} from '@ant-design/icons';

/**
 * Achievement Badge Component
 * Displays a badge for user achievements with animation and tooltip
 */
const AchievementBadge = ({ 
  type, 
  level = 1, 
  name, 
  description, 
  date, 
  isNew = false, 
  onClick,
  size = 'default',
  animation = true
}) => {
  // Define badge properties based on type
  const badgeTypes = {
    perfectScore: {
      icon: <StarOutlined />,
      colors: ['#FFD700', '#FFC107', '#FF9800'], // Gold shades for different levels
      title: 'Perfect Score',
    },
    speedDemon: {
      icon: <ThunderboltOutlined />,
      colors: ['#2196F3', '#1E88E5', '#1976D2'], // Blue shades
      title: 'Speed Demon',
    },
    consistency: {
      icon: <CheckCircleOutlined />,
      colors: ['#4CAF50', '#43A047', '#388E3C'], // Green shades
      title: 'Consistency King',
    },
    hotStreak: {
      icon: <FireOutlined />,
      colors: ['#F44336', '#E53935', '#D32F2F'], // Red shades
      title: 'Hot Streak',
    },
    firstExam: {
      icon: <RocketOutlined />,
      colors: ['#9C27B0', '#8E24AA', '#7B1FA2'], // Purple shades
      title: 'First Exam',
    },
    topScore: {
      icon: <CrownOutlined />,
      colors: ['#FF5722', '#F4511E', '#E64A19'], // Orange shades
      title: 'Top Score',
    },
    dedication: {
      icon: <HeartOutlined />,
      colors: ['#E91E63', '#D81B60', '#C2185B'], // Pink shades
      title: 'Dedication',
    },
    studyMaster: {
      icon: <BookOutlined />,
      colors: ['#607D8B', '#546E7A', '#455A64'], // Blue-gray shades
      title: 'Study Master',
    },
    allRounder: {
      icon: <SafetyOutlined />,
      colors: ['#795548', '#6D4C41', '#5D4037'], // Brown shades
      title: 'All-Rounder',
    },
  };

  // Get badge configuration or use default
  const badgeConfig = badgeTypes[type] || {
    icon: <TrophyOutlined />,
    colors: ['#673AB7', '#5E35B1', '#512DA8'], // Default purple shades
    title: 'Achievement',
  };

  // Set sizes based on the size prop
  const sizes = {
    small: {
      outer: 40,
      inner: 30,
      icon: 16,
      ribbon: 8
    },
    default: {
      outer: 60,
      inner: 45,
      icon: 24,
      ribbon: 12
    },
    large: {
      outer: 80,
      inner: 60,
      icon: 32,
      ribbon: 16
    }
  };

  const currentSize = sizes[size] || sizes.default;
  const badgeColor = badgeConfig.colors[Math.min(level - 1, badgeConfig.colors.length - 1)];
  
  // Format date if provided
  const formattedDate = date ? new Date(date).toLocaleDateString() : '';
  
  // Define the tooltip content
  const tooltipTitle = (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{name || badgeConfig.title}</div>
      {level > 1 && <div style={{ marginBottom: 4 }}>Level: {level}</div>}
      {description && <div style={{ marginBottom: 4 }}>{description}</div>}
      {formattedDate && <div style={{ fontSize: '12px', opacity: 0.7 }}>Earned on {formattedDate}</div>}
    </div>
  );

  return (
    <Tooltip title={tooltipTitle} placement="top">
      <motion.div
        whileHover={animation ? { scale: 1.1 } : {}}
        whileTap={animation ? { scale: 0.95 } : {}}
        onClick={onClick}
        style={{ 
          position: 'relative', 
          display: 'inline-flex', 
          cursor: onClick ? 'pointer' : 'default'
        }}
      >
        {isNew && (
          <Badge
            count="NEW"
            style={{
              backgroundColor: '#f50',
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 2
            }}
          />
        )}
        
        <motion.div
          initial={animation ? { scale: 0, rotate: -180 } : false}
          animate={animation ? { scale: 1, rotate: 0 } : false}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.1
          }}
          style={{
            backgroundColor: badgeColor,
            width: currentSize.outer,
            height: currentSize.outer,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
            position: 'relative'
          }}
        >
          {/* Inner circle */}
          <div style={{
            backgroundColor: 'white',
            width: currentSize.inner,
            height: currentSize.inner,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Icon */}
            <div style={{
              color: badgeColor,
              fontSize: currentSize.icon
            }}>
              {badgeConfig.icon}
            </div>
          </div>
          
          {/* Level indicator for levels > 1 */}
          {level > 1 && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#fff',
              color: badgeColor,
              borderRadius: '50%',
              width: currentSize.ribbon,
              height: currentSize.ribbon,
              fontSize: currentSize.ribbon * 0.7,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              border: `1px solid ${badgeColor}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}>
              {level}
            </div>
          )}
        </motion.div>
      </motion.div>
    </Tooltip>
  );
};

export default AchievementBadge;