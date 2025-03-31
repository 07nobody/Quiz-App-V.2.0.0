import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const ConfettiEffect = ({ 
  active = false, 
  duration = 5000, 
  colors = null,
  pieces = 200,
  gravity = 0.3
}) => {
  const { width, height } = useWindowSize();
  const [isActive, setIsActive] = useState(active);
  
  // Apply confetti effect when active prop changes
  useEffect(() => {
    if (active) {
      setIsActive(true);
      
      // Automatically disable confetti after duration
      const timer = setTimeout(() => {
        setIsActive(false);
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setIsActive(false);
    }
  }, [active, duration]);
  
  if (!isActive) return null;
  
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={pieces}
      recycle={false}
      gravity={gravity}
      colors={colors || ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']}
    />
  );
};

export default ConfettiEffect;