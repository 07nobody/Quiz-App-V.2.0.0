import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined, MailOutlined } from "@ant-design/icons";
import LottiePlayer from "../../../components/LottiePlayer";
import { checkExamRegistration } from "../../../apicalls/exams";

function AuthVerification({ user, examData, setView }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [codeFromEmail, setCodeFromEmail] = useState(false);

  // Check if user is already registered for this exam
  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const response = await checkExamRegistration({
          examId: examData._id,
          userId: user._id
        });

        if (response.success && response.data.isRegistered) {
          setRegistrationStatus(response.data);
          if (response.data.examCode) {
            // Show a message that they can use the code from email
            message.info("You can use the exam code sent to your email to access this exam.");
            setCodeFromEmail(true);
          }
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    if (user && examData) {
      checkRegistration();
    }
  }, [user, examData]);

  const onFinish = (values) => {
    setLoading(true);
    
    // Verify the exam code
    if (values.examCode === examData.examCode) {
      // Successful verification
      message.success("Authentication successful! Proceeding to instructions.");
      
      // Wait for the message to be visible
      setTimeout(() => {
        setView("instructions");
      }, 1000);
    } else {
      message.error("Incorrect exam code. Please check and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-verification">
      <div className="auth-header">
        <h2>Exam Authentication</h2>
        <p>{examData.name}</p>
      </div>
      
      <div className="auth-body">
        <div className="auth-animation">
          <LottiePlayer
            src="https://assets5.lottiefiles.com/packages/lf20_q5qvqtnr.json"
            background="transparent"
            speed={1}
            loop={true}
            autoplay={true}
            style={{ height: "180px", width: "180px" }}
          />
        </div>
        
        <div className="auth-info">
          <p>Please verify your identity before proceeding to the examination.</p>
          
          {codeFromEmail && (
            <div className="auth-notice">
              <MailOutlined /> Check your email for the exam access code sent when you registered.
            </div>
          )}
        </div>

        <Form
          form={form}
          name="exam_auth"
          onFinish={onFinish}
          layout="vertical"
          className="auth-form"
        >
          <div className="user-info">
            <div className="user-info-row">
              <span className="user-info-label">Name:</span>
              <span className="user-info-value">{user?.name}</span>
            </div>
            <div className="user-info-row">
              <span className="user-info-label">Email:</span>
              <span className="user-info-value">{user?.email}</span>
            </div>
            {examData.isPaid && (
              <div className="user-info-row">
                <span className="user-info-label">Payment:</span>
                <span className="user-info-value">
                  {registrationStatus?.paymentStatus === "completed" 
                    ? "Completed" 
                    : "Pending"}
                </span>
              </div>
            )}
          </div>
          
          {(!examData.isPaid || (registrationStatus?.paymentStatus === "completed")) && (
            <>
              <div className="auth-form-group">
                <label>Exam Access Code</label>
                <Form.Item
                  name="examCode"
                  rules={[{ required: true, message: 'Please enter the exam code' }]}
                  noStyle
                >
                  <Input 
                    prefix={<SafetyOutlined />} 
                    placeholder="Enter exam code sent to your email" 
                  />
                </Form.Item>
              </div>

              <button 
                type="submit" 
                className="auth-submit" 
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Start Exam'}
              </button>
            </>
          )}
          
          {examData.isPaid && registrationStatus?.paymentStatus !== "completed" && (
            <div className="payment-required">
              <h4>Payment Required</h4>
              <p>You need to complete payment before you can take this exam.</p>
              <button 
                className="auth-submit payment-button"
                onClick={() => window.history.back()}
                type="button"
              >
                Go Back & Complete Payment
              </button>
            </div>
          )}
        </Form>
        
        <div className="auth-message">
          Having trouble? Contact support at support@quizapp.com
        </div>
      </div>
    </div>
  );
}

export default AuthVerification;