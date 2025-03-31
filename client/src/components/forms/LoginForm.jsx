import React, { useState } from 'react';
import { Form, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Input } from '@ui';
import { useFormState } from '@hooks';
import { VALIDATION_RULES } from '@constants';
import { loginUser } from '@api';
import { SetUser } from '@redux/usersSlice';

/**
 * LoginForm - Component for user authentication
 * Uses our standardized UI components and form handling hook
 */
const LoginForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  
  const { form, loading, error, handleSubmit } = useFormState({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values) => {
      const response = await loginUser(values.email, values.password);
      
      if (response.data.success) {
        // Store token and dispatch user to Redux store
        localStorage.setItem('token', response.data.data.token);
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        dispatch(SetUser(response.data.data));
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
      
      return response;
    },
    successMessage: 'Login successful!',
    errorMessage: 'Login failed. Please check your credentials.'
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="form-title">
        <h1>Welcome Back</h1>
        <p>Enter your credentials to access your account</p>
      </div>
      
      {error && (
        <Alert 
          message="Login Failed" 
          description={error.message || "Invalid email or password"} 
          type="error" 
          showIcon 
          className="mb-6"
        />
      )}
      
      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[VALIDATION_RULES.REQUIRED, VALIDATION_RULES.EMAIL]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Email"
            type="email"
            size="large"
            className="login-input"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[VALIDATION_RULES.REQUIRED, VALIDATION_RULES.PASSWORD]}
        >
          <Input
            prefix={<LockOutlined className="text-gray-400" />}
            type="password"
            placeholder="Password"
            size="large"
            className="login-input"
          />
        </Form.Item>

        <div className="flex justify-between items-center mb-4">
          <Checkbox 
            checked={rememberMe} 
            onChange={e => setRememberMe(e.target.checked)}
          >
            Remember me
          </Checkbox>
          
          <Link to="/forgot-password" className="text-primary hover:text-primary-dark">
            Forgot password?
          </Link>
        </div>

        <Form.Item className="login-button-container">
          <Button 
            variant="primary" 
            htmlType="submit" 
            block 
            size="large" 
            loading={loading}
            className="login-button"
          >
            Log In
          </Button>
        </Form.Item>
      </Form>
      
      <div className="register-link">
        Don't have an account?
        <Link to="/register" className="register-link-text">
          Register now
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;