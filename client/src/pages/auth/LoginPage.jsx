import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@components/forms';
import { motion } from 'framer-motion';

/**
 * LoginPage - Page component for user authentication
 * Uses standardized LoginForm component
 */
const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    // Navigate based on user role
    if (user.role === 'admin') {
      navigate('/');
    } else {
      navigate('/available-exams');
    }
  };

  const backgroundVariants = {
    initial: {
      backgroundPosition: '0% 0%',
    },
    animate: {
      backgroundPosition: '100% 100%',
      transition: {
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 20,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Quiz Application</h1>
            <p className="text-text-secondary">Test your knowledge and learn new things</p>
          </div>
          
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
      
      {/* Right side - Animated background */}
      <motion.div
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary via-primary-light to-secondary"
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col justify-center items-center w-full h-full text-white p-12">
          <h2 className="text-4xl font-bold mb-6">Welcome to Quiz Application</h2>
          <p className="text-xl mb-8 text-center">
            Challenge yourself, test your knowledge, and track your progress
          </p>
          
          <ul className="space-y-4 text-lg">
            <li className="flex items-center">
              <span className="mr-2 text-2xl">✓</span> 
              Interactive learning experience
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-2xl">✓</span> 
              Wide range of quiz topics
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-2xl">✓</span> 
              Track your performance and progress
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-2xl">✓</span> 
              Compete with others on the leaderboard
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;