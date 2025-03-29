import React, { useState, useEffect } from "react";
import { Form, message, Input, Button, Tabs } from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import axiosInstance from "../../../apicalls";
import { SetUser } from "../../../redux/usersSlice";
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  KeyOutlined,
  LoginOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm] = Form.useForm();
  const [forgotPasswordForm] = Form.useForm();
  const [otpForm] = Form.useForm();

  useEffect(() => {
    if (forgotPassword) {
      loginForm.resetFields();
    } else {
      forgotPasswordForm.resetFields();
      otpForm.resetFields();
      setOtpSent(false);
    }
  }, [forgotPassword, loginForm, forgotPasswordForm, otpForm]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || "Something went wrong";
    message.error(errorMessage);
    console.error("API Error:", error);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      dispatch(ShowLoading());

      const payload = {
        email: values.email.trim(),
        password: values.password,
      };

      const response = await axiosInstance.post("/users/login", payload);

      dispatch(HideLoading());
      setLoading(false);

      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem("token", response.data.data);

        const userResponse = await axiosInstance.post("/users/get-user-info");
        if (userResponse.data.success) {
          dispatch(SetUser(userResponse.data.data));
        }

        navigate("/");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      dispatch(HideLoading());
      handleApiError(error);
    }
  };

  const handleForgotPassword = async (values) => {
    try {
      setLoading(true);
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/users/forgot-password", { email: values.email });
      dispatch(HideLoading());
      setLoading(false);
      if (response.data.success) {
        message.success(response.data.message);
        setEmail(values.email);
        setOtpSent(true);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      dispatch(HideLoading());
      handleApiError(error);
    }
  };

  const handleVerifyOtp = async (values) => {
    try {
      setLoading(true);
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/users/verify-otp", {
        email,
        otp: values.otp
      });
      dispatch(HideLoading());
      setLoading(false);
      if (response.data.success) {
        message.success(response.data.message);
        navigate(`/reset-password/${encodeURIComponent(email)}`);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      dispatch(HideLoading());
      handleApiError(error);
    }
  };

  const renderLoginForm = () => (
    <Form
      form={loginForm}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ email: "", password: "" }}
      className="login-form"
    >
      <div className="form-title">
        <h1>Welcome Back</h1>
        <p>Login to your account to continue</p>
      </div>
      
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          type="email"
          placeholder="Email address"
          autoComplete="username email"
          disabled={loading}
          size="large"
          className="login-input"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          autoComplete="current-password"
          disabled={loading}
          size="large"
          className="login-input"
        />
      </Form.Item>

      <div className="forgot-password-link">
        <Button 
          type="link" 
          onClick={() => setForgotPassword(true)} 
          disabled={loading}
          className="forgot-btn"
        >
          Forgot Password?
        </Button>
      </div>

      <Form.Item className="login-button-container">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<LoginOutlined />}
          block
          size="large"
          className="login-button"
        >
          Log In
        </Button>
      </Form.Item>

      <div className="register-link">
        <span>Don't have an account? </span>
        <Link to="/register" className="register-link-text">
          Register Now
        </Link>
      </div>
    </Form>
  );
  
  const renderForgotPasswordForm = () => (
    <Form
      form={forgotPasswordForm}
      layout="vertical"
      onFinish={handleForgotPassword}
      initialValues={{ email: "" }}
      className="login-form"
    >
      <div className="form-title">
        <h1>Reset Password</h1>
        <p>Enter your email to receive a reset code</p>
      </div>
      
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          type="email"
          placeholder="Enter your registered email"
          disabled={loading}
          size="large"
          className="login-input"
        />
      </Form.Item>

      <Form.Item className="login-button-container">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          className="login-button"
        >
          Send OTP
        </Button>
      </Form.Item>

      <div className="back-to-login">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setForgotPassword(false)}
          disabled={loading}
          type="link"
        >
          Back to Login
        </Button>
      </div>
    </Form>
  );
  
  const renderOtpVerificationForm = () => (
    <Form
      form={otpForm}
      layout="vertical"
      onFinish={handleVerifyOtp}
      initialValues={{ otp: "" }}
      className="login-form"
    >
      <div className="form-title">
        <h1>Verify OTP</h1>
        <p>Enter the code sent to your email</p>
        <div className="email-sent-info">
          <MailOutlined /> {email}
        </div>
      </div>
      
      <Form.Item
        name="otp"
        rules={[{ required: true, message: "Please input the OTP!" }]}
      >
        <Input
          prefix={<KeyOutlined />}
          placeholder="Enter OTP"
          disabled={loading}
          size="large"
          className="login-input"
        />
      </Form.Item>

      <Form.Item className="login-button-container">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          className="login-button"
        >
          Verify OTP
        </Button>
      </Form.Item>

      <div className="back-to-login">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setForgotPassword(false)}
          disabled={loading}
          type="link"
        >
          Back to Login
        </Button>
      </div>
    </Form>
  );

  const renderActiveForm = () => {
    if (!forgotPassword) {
      return renderLoginForm();
    }
    if (otpSent) {
      return renderOtpVerificationForm();
    }
    return renderForgotPasswordForm();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-branding">
            <h2 className="logo">Quiz App</h2>
            <div className="tagline">Test Your Knowledge</div>
          </div>
          
          <div className="login-form-container">
            {renderActiveForm()}
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          padding: 2rem 1rem;
        }
        
        .login-container {
          width: 100%;
          max-width: 1000px;
        }
        
        .login-card {
          display: flex;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .login-branding {
          background: linear-gradient(135deg, rgba(67, 97, 238, 0.9) 0%, rgba(47, 73, 197, 0.9) 100%), url('/login-bg.jpg') center/cover;
          padding: 3rem;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        
        .login-branding::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        }
        
        .logo {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
        }
        
        .tagline {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-top: 0.5rem;
          position: relative;
          z-index: 1;
        }
        
        .login-form-container {
          padding: 3rem;
          width: 450px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .login-form {
          width: 100%;
        }
        
        .form-title {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .form-title h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-primary);
        }
        
        .form-title p {
          margin-top: 0.5rem;
          color: var(--text-secondary);
        }
        
        .login-input {
          height: 48px;
          border-radius: 6px;
        }
        
        .login-button-container {
          margin-top: 1.5rem;
        }
        
        .login-button {
          height: 48px;
          border-radius: 6px;
          background-color: var(--primary);
          border-color: var(--primary);
        }
        
        .login-button:hover {
          background-color: var(--primary-dark);
          border-color: var(--primary-dark);
        }
        
        .forgot-password-link {
          text-align: right;
          margin-top: -0.5rem;
          margin-bottom: 1rem;
        }
        
        .forgot-btn {
          padding: 0;
        }
        
        .register-link {
          text-align: center;
          margin-top: 1.5rem;
          color: var(--text-secondary);
        }
        
        .register-link-text {
          color: var(--primary);
          font-weight: 600;
          margin-left: 0.25rem;
        }
        
        .back-to-login {
          text-align: center;
          margin-top: 1.5rem;
        }
        
        .email-sent-info {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background-color: #e6f7ff;
          border-radius: 4px;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
          }
          
          .login-branding {
            padding: 2rem;
            text-align: center;
          }
          
          .login-form-container {
            width: 100%;
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
