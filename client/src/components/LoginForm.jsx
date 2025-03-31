import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import errorHandler from '../utils/errorHandler';

const LoginForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [form] = Form.useForm(); // Create form instance

  const onFinish = async (values) => {
    // Use the errorHandler utility for better error handling
    await errorHandler.tryCatch(async () => {
      setLoading(true);
      
      // Use try-finally to ensure loading state is properly reset
      try {
        // Simulate API call (replace with actual API call)
        // const response = await loginUser(values);
        
        // For demo purpose, simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock response for demonstration
        const response = { token: 'mock-jwt-token', user: { name: 'Demo User' } };
        
        // Save token to localStorage
        localStorage.setItem('token', response.token);
        
        // Show success message
        message.success({
          content: 'Login successful! Welcome back.',
          duration: 2,
        });
        
        // Call the success callback or redirect
        if (onSuccess) {
          onSuccess(response);
        } else {
          // Redirect to home page
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    }, {
      // Custom error options
      message: 'Login failed. Please check your credentials and try again.',
      handleUnauthorized: false, // Don't redirect on 401 as we're already on login page
    });
  };

  // Animation variants for form items
  const formItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1 }
    })
  };

  const handleGoogleSignIn = () => {
    message.info('Google Sign In is coming soon!');
  };

  const handleGithubSignIn = () => {
    message.info('GitHub Sign In is coming soon!');
  };

  return (
    <motion.div 
      className="login-form-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Form
        form={form}
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
        layout="vertical"
      >
        <motion.div 
          custom={1}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Enter your email"
              className="login-input"
            />
          </Form.Item>
        </motion.div>
        
        <motion.div
          custom={2}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
        >
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              className="login-input"
            />
          </Form.Item>
        </motion.div>

        <motion.div
          custom={3}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          className="remember-forgot-row"
        >
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          
          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </motion.div>

        <motion.div
          custom={4}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
        >
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-button" 
              block 
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </motion.div>
        
        <motion.div
          custom={5}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="register-now-container">
            <span className="register-text">Don't have an account?</span>
            <Link to="/register" className="register-link">Register now</Link>
          </div>
        </motion.div>

        <motion.div
          custom={6}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
        >
          <Divider plain>or login with</Divider>
          
          <div className="social-login">
            <Button 
              icon={<GoogleOutlined />} 
              className="google-button" 
              onClick={handleGoogleSignIn}
              size="large"
            >
              Google
            </Button>
            <Button 
              icon={<GithubOutlined />} 
              className="github-button"
              onClick={handleGithubSignIn}
              size="large"
            >
              GitHub
            </Button>
          </div>
        </motion.div>
      </Form>

      <style jsx="true">{`
        .login-form-container {
          max-width: 400px;
          width: 100%;
          padding: 24px;
          border-radius: var(--border-radius-lg);
          background-color: var(--card-background);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
        }

        .login-input {
          height: 48px;
          border-radius: var(--border-radius);
        }

        .login-button {
          height: 48px;
          border-radius: var(--border-radius);
          font-weight: 600;
          font-size: 16px;
          background: var(--primary);
          border-color: var(--primary);
        }
        
        .login-button:hover {
          background: var(--primary-dark);
          border-color: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .remember-forgot-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .forgot-link {
          color: var(--primary);
          transition: all 0.3s ease;
        }
        
        .forgot-link:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        .register-now-container {
          text-align: center;
          margin-top: 16px;
        }
        
        .register-text {
          margin-right: 8px;
          color: var(--text-secondary);
        }
        
        .register-link {
          color: var(--primary);
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .register-link:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        .social-login {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }

        .google-button, .github-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius);
          transition: all 0.3s ease;
        }
        
        .google-button:hover, .github-button:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .google-button {
          background-color: ${currentTheme === 'dark' ? 'rgba(234, 67, 53, 0.1)' : 'rgba(234, 67, 53, 0.05)'};
          color: #EA4335;
          border-color: #EA4335;
        }
        
        .github-button {
          background-color: ${currentTheme === 'dark' ? 'rgba(36, 41, 47, 0.2)' : 'rgba(36, 41, 47, 0.05)'};
          color: ${currentTheme === 'dark' ? '#ffffff' : '#24292F'};
          border-color: ${currentTheme === 'dark' ? '#ffffff' : '#24292F'};
        }
      `}</style>
    </motion.div>
  );
};

export default LoginForm;