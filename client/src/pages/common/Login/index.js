import React, { useState, useEffect } from "react";
import { Form, message, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { axiosInstance } from "../../../apicalls";
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

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || "Something went wrong";
    message.error(errorMessage);
    console.error("API Error:", error);
  };

  // Reset form fields when switching between login and forgot password
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

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
        label="Email"
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
        label="Password"
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
        label="Email"
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
        label="OTP"
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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-[#f6f8fd] to-[#edf2ff] p-4">
      <div className="w-full max-w-[900px] flex bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-primary to-primary-dark p-12 text-white flex flex-col justify-center flex-1 relative overflow-hidden">
          {/* Background animations with Tailwind classes */}
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-radial-gradient from-white/10 to-transparent animate-pulse-slow"></div>
          <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-radial-gradient from-white/10 to-transparent animate-pulse-slow animation-delay-2s"></div>
          
          <h2 className="text-4xl font-bold m-0 relative z-10">Quiz App</h2>
          <div className="text-xl opacity-90 mt-2 relative z-10">Test Your Knowledge</div>
        </div>
        
        <div className="p-12 w-[450px] flex flex-col justify-center">
          {renderActiveForm()}
        </div>
      </div>
    </div>
  );
}

export default Login;
