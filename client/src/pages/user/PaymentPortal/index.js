import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, message, Steps, Radio, Result, Card, Divider, Tooltip, Alert } from 'antd';
import {
  CreditCardOutlined,
  BankOutlined,
  CheckCircleOutlined,
  LockOutlined,
  SafetyOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  BookOutlined
} from '@ant-design/icons';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { getExamById } from '../../../apicalls/exams';
import { createPayment, completePayment } from '../../../apicalls/payments';
import LottiePlayer from '../../../components/LottiePlayer';

const { Step } = Steps;

function PaymentPortal() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [examData, setExamData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    getExamDetails();
  }, []);

  const getExamDetails = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({ examId });
      dispatch(HideLoading());
      
      if (response.success) {
        setExamData(response.data);
        // Check if the exam is not a paid exam
        if (!response.data.isPaid) {
          message.error("This exam doesn't require payment");
          navigate(`/user/available-exams`);
        }
      } else {
        message.error(response.message);
        navigate(`/user/available-exams`);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      navigate(`/user/available-exams`);
    }
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await createPayment({
        examId,
        userId: user._id,
        paymentMethod
      });
      
      if (response.success) {
        setPaymentIntent(response.data);
        setCurrentStep(1);
        message.success("Payment initiated successfully");
      } else {
        message.error(response.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const processPayment = async (values) => {
    try {
      setLoading(true);
      // Simulating a payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await completePayment({
        paymentId: paymentIntent.paymentId,
        transactionId: paymentIntent.transactionId,
        ...values
      });
      
      if (response.success) {
        setReceipt(response.data);
        setPaymentSuccess(true);
        setCurrentStep(2);
        message.success("Payment completed successfully");
      } else {
        message.error(response.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const renderPaymentMethodStep = () => {
    return (
      <div className="payment-step-container">
        <Card className="payment-card">
          <div className="exam-summary">
            <div className="exam-icon">
              <BookOutlined />
            </div>
            <div className="exam-details">
              <h2>{examData?.name}</h2>
              <p className="category">{examData?.category}</p>
              <div className="price-tag">
                <DollarOutlined /> ₹{examData?.price}
              </div>
            </div>
          </div>
          
          <Divider />
          
          <h3>Select Payment Method</h3>
          <div className="payment-methods">
            <Radio.Group 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              value={paymentMethod}
              className="payment-radio-group"
            >
              <Radio.Button value="credit_card" className="payment-option">
                <div className="payment-option-content">
                  <CreditCardOutlined className="payment-icon" />
                  <div>
                    <div className="payment-option-title">Credit Card</div>
                    <div className="payment-option-desc">Pay securely with your credit card</div>
                  </div>
                </div>
              </Radio.Button>
              <Radio.Button value="debit_card" className="payment-option">
                <div className="payment-option-content">
                  <CreditCardOutlined className="payment-icon" />
                  <div>
                    <div className="payment-option-title">Debit Card</div>
                    <div className="payment-option-desc">Use your bank debit card</div>
                  </div>
                </div>
              </Radio.Button>
              <Radio.Button value="netbanking" className="payment-option">
                <div className="payment-option-content">
                  <BankOutlined className="payment-icon" />
                  <div>
                    <div className="payment-option-title">Net Banking</div>
                    <div className="payment-option-desc">Pay directly from your bank</div>
                  </div>
                </div>
              </Radio.Button>
              <Radio.Button value="upi" className="payment-option">
                <div className="payment-option-content">
                  <SafetyOutlined className="payment-icon" />
                  <div>
                    <div className="payment-option-title">UPI</div>
                    <div className="payment-option-desc">Pay using UPI apps</div>
                  </div>
                </div>
              </Radio.Button>
            </Radio.Group>
          </div>
          
          <div className="payment-actions">
            <Button onClick={() => navigate('/user/available-exams')} icon={<ArrowLeftOutlined />}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={initiatePayment} 
              loading={loading} 
              icon={<LockOutlined />}
            >
              Proceed to Pay ₹{examData?.price}
            </Button>
          </div>
          
          <div className="payment-security-info">
            <LockOutlined /> Your payment information is secure and encrypted
          </div>
        </Card>
      </div>
    );
  };

  const renderPaymentDetailsStep = () => {
    return (
      <div className="payment-step-container">
        <Card className="payment-card">
          <div className="transaction-info">
            <div className="transaction-header">
              <h3>Complete Your Payment</h3>
              <div className="transaction-amount">₹{examData?.price}</div>
            </div>
            
            <Alert
              message="Demo Payment"
              description="This is a simulated payment for demonstration. No actual payment will be processed."
              type="info"
              showIcon
              style={{ marginBottom: '20px' }}
            />

            <Form layout="vertical" onFinish={processPayment}>
              {paymentMethod === 'credit_card' || paymentMethod === 'debit_card' ? (
                <>
                  <div className="form-row">
                    <Form.Item
                      name="cardNumber"
                      label="Card Number"
                      rules={[{ required: true, message: 'Please enter your card number' }]}
                      className="form-item-wide"
                    >
                      <Input 
                        placeholder="1234 5678 9012 3456" 
                        prefix={<CreditCardOutlined />} 
                        maxLength={19}
                        onChange={(e) => {
                          // Format card number with spaces
                          const value = e.target.value.replace(/\s/g, '');
                          if (value.length <= 16) {
                            const formatted = value.replace(/(.{4})/g, '$1 ').trim();
                            e.target.value = formatted;
                          }
                        }}
                      />
                    </Form.Item>
                  </div>
                  
                  <div className="form-row">
                    <Form.Item
                      name="cardName"
                      label="Cardholder Name"
                      rules={[{ required: true, message: 'Please enter the cardholder name' }]}
                      className="form-item-wide"
                    >
                      <Input placeholder="John Doe" />
                    </Form.Item>
                  </div>
                  
                  <div className="form-row">
                    <Form.Item
                      name="expiryDate"
                      label="Expiry Date"
                      rules={[{ required: true, message: 'Please enter the expiry date' }]}
                    >
                      <Input placeholder="MM/YY" maxLength={5} />
                    </Form.Item>
                    
                    <Form.Item
                      name="cvv"
                      label="CVV"
                      rules={[{ required: true, message: 'Please enter the CVV' }]}
                    >
                      <Input placeholder="123" maxLength={3} type="password" />
                    </Form.Item>
                  </div>
                </>
              ) : paymentMethod === 'netbanking' ? (
                <>
                  <Form.Item
                    name="bankName"
                    label="Select Bank"
                    rules={[{ required: true, message: 'Please select your bank' }]}
                  >
                    <Radio.Group>
                      <div className="bank-options-grid">
                        <Radio.Button value="sbi">SBI</Radio.Button>
                        <Radio.Button value="hdfc">HDFC</Radio.Button>
                        <Radio.Button value="icici">ICICI</Radio.Button>
                        <Radio.Button value="axis">Axis</Radio.Button>
                        <Radio.Button value="pnb">PNB</Radio.Button>
                        <Radio.Button value="bob">BOB</Radio.Button>
                      </div>
                    </Radio.Group>
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    name="upiId"
                    label="UPI ID"
                    rules={[{ required: true, message: 'Please enter your UPI ID' }]}
                  >
                    <Input placeholder="yourname@upi" />
                  </Form.Item>
                </>
              )}
              
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Exam Fee:</span>
                  <span>₹{examData?.price}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>₹0</span>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{examData?.price}</span>
                </div>
              </div>
              
              <div className="payment-actions">
                <Button onClick={() => setCurrentStep(0)} icon={<ArrowLeftOutlined />}>
                  Back
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<LockOutlined />}
                >
                  Pay Now
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    );
  };

  const renderSuccessStep = () => {
    return (
      <div className="payment-step-container">
        <Card className="payment-card success-card">
          <Result
            status="success"
            title="Payment Successful!"
            subTitle={`Receipt Number: ${receipt?.receiptNumber}`}
            icon={<LottiePlayer 
              src="https://assets10.lottiefiles.com/packages/lf20_s2lryxtd.json" 
              background="transparent"
              speed={0.8}
              style={{ width: 200, height: 200 }}
              loop={false}
              autoplay={true}
            />}
            extra={[
              <Button
                type="primary"
                key="exam"
                onClick={() => navigate(`/user/write-exam/${examId}`)}
              >
                Take Exam Now
              </Button>,
              <Button 
                key="dashboard" 
                onClick={() => navigate('/user/available-exams')}
              >
                Back to Dashboard
              </Button>,
            ]}
          />
          
          <div className="success-details">
            <div className="info-row">
              <span className="label">Exam:</span>
              <span className="value">{examData?.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Access Code:</span>
              <span className="value code">{receipt?.examCode}</span>
            </div>
            <div className="info-row">
              <span className="label">Payment Method:</span>
              <span className="value">{paymentMethod.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="info-row">
              <span className="label">Amount Paid:</span>
              <span className="value">₹{examData?.price}</span>
            </div>
            <div className="info-row">
              <span className="label">Transaction ID:</span>
              <span className="value">{paymentIntent?.transactionId}</span>
            </div>
            <div className="info-row">
              <span className="label">Date:</span>
              <span className="value">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="payment-note">
            A receipt has been sent to your email.
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="payment-portal-container">
      <div className="payment-header">
        <h1>Payment Portal</h1>
      </div>
      
      <div className="payment-steps-container">
        <Steps current={currentStep} className="payment-steps">
          <Step title="Method" description="Select payment" />
          <Step title="Details" description="Complete payment" />
          <Step title="Confirmation" description="Payment complete" />
        </Steps>
      </div>
      
      {examData && (
        <>
          {currentStep === 0 && renderPaymentMethodStep()}
          {currentStep === 1 && renderPaymentDetailsStep()}
          {currentStep === 2 && renderSuccessStep()}
        </>
      )}
      
      <style jsx="true">{`
        .payment-portal-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .payment-header {
          margin-bottom: 20px;
          text-align: center;
        }
        
        .payment-header h1 {
          color: var(--primary);
          font-size: 28px;
          font-weight: 500;
        }
        
        .payment-steps-container {
          margin-bottom: 40px;
        }
        
        .payment-steps {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .payment-step-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .payment-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          border: none;
        }
        
        .exam-summary {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 20px;
        }
        
        .exam-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }
        
        .exam-details h2 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 500;
        }
        
        .exam-details .category {
          margin: 0;
          color: var(--text-secondary);
        }
        
        .price-tag {
          margin-top: 8px;
          font-size: 20px;
          font-weight: 600;
          color: var(--primary);
          display: inline-block;
          padding: 4px 12px;
          background: var(--primary-light);
          border-radius: 8px;
        }
        
        .payment-methods {
          margin-bottom: 24px;
        }
        
        .payment-radio-group {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .payment-option {
          height: auto !important;
          padding: 16px !important;
          display: block;
          width: 100%;
          text-align: left;
          border-radius: 8px !important;
          border: 1px solid #e8e8e8 !important;
          margin-right: 0 !important;
        }
        
        .payment-option-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .payment-icon {
          font-size: 24px;
          color: var(--primary);
        }
        
        .payment-option-title {
          font-weight: 500;
          font-size: 16px;
        }
        
        .payment-option-desc {
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .payment-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
        }
        
        .payment-security-info {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .transaction-info {
          padding: 10px;
        }
        
        .transaction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .transaction-header h3 {
          margin: 0;
          font-size: 20px;
        }
        
        .transaction-amount {
          font-size: 24px;
          font-weight: 600;
          color: var(--primary);
        }
        
        .form-row {
          display: flex;
          gap: 16px;
        }
        
        .form-row .ant-form-item {
          flex: 1;
        }
        
        .form-item-wide {
          width: 100%;
        }
        
        .bank-options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 10px;
          margin-top: 8px;
        }
        
        .bank-options-grid .ant-radio-button-wrapper {
          text-align: center;
          padding: 8px;
          height: auto;
        }
        
        .payment-summary {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 16px;
          margin-top: 24px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .summary-row.total {
          font-weight: 600;
        }
        
        .success-card {
          text-align: center;
          padding: 24px;
        }
        
        .success-details {
          max-width: 500px;
          margin: 24px auto;
          text-align: left;
          background: #f9f9f9;
          border-radius: 8px;
          padding: 16px;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px dashed #eee;
        }
        
        .info-row .label {
          flex: 1;
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .info-row .value {
          flex: 2;
          font-weight: 500;
        }
        
        .info-row .code {
          color: var(--primary);
          font-weight: 600;
          font-family: monospace;
          font-size: 16px;
          letter-spacing: 1px;
        }
        
        .payment-note {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 16px;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .bank-options-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default PaymentPortal;