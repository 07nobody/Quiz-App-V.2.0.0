import React, { useEffect, useState, useCallback } from "react";
import { message, Table, Select, Input, Button, Tag, Tooltip, Empty, Modal, Space, Badge, Result, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllExams, registerForExam, checkExamRegistration } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import AvailableExamCard from "../../../components/AvailableExamCard";
import { 
  SearchOutlined, 
  FieldTimeOutlined, 
  BookOutlined, 
  CheckCircleOutlined,
  DollarOutlined,
  UserAddOutlined,
  MailOutlined,
  LockOutlined,
  TableOutlined,
  AppstoreOutlined
} from "@ant-design/icons";

const { Option } = Select;

function AvailableExams() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [registrationStatus, setRegistrationStatus] = useState({});
  const [registrationLoading, setRegistrationLoading] = useState({});
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // 'table' or 'cards'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getExamsData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      
      if (response.success) {
        const activeExams = response.data.filter(
          (exam) => exam.status === "active"
        );
        
        setExams(activeExams);
        setFilteredExams(activeExams);
        
        // Extract unique categories
        const uniqueCategories = [
          ...new Set(activeExams.map((exam) => exam.category)),
        ];
        setCategories(uniqueCategories);
        
        // Check registration status for each exam
        activeExams.forEach(exam => {
          checkRegistrationStatus(exam._id);
        });
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);
  
  const checkRegistrationStatus = async (examId) => {
    try {
      const response = await checkExamRegistration({
        examId,
        userId: user._id
      });
      
      if (response.success) {
        setRegistrationStatus(prev => ({
          ...prev,
          [examId]: response.data
        }));
      }
    } catch (error) {
      console.error("Error checking registration status:", error);
    }
  };
  
  const handleRegisterClick = (exam) => {
    setSelectedExam(exam);
    setShowRegistrationModal(true);
  };
  
  const handleRegisterConfirm = async () => {
    if (!selectedExam) return;
    
    try {
      setRegistrationLoading(prev => ({
        ...prev,
        [selectedExam._id]: true
      }));
      
      const response = await registerForExam({
        examId: selectedExam._id,
        userId: user._id,
        email: user.email
      });
      
      if (response.success) {
        await checkRegistrationStatus(selectedExam._id);
        setShowRegistrationModal(false);
        setShowSuccessModal(true);
      } else {
        message.error(response.message);
      }
      
      setRegistrationLoading(prev => ({
        ...prev,
        [selectedExam._id]: false
      }));
    } catch (error) {
      setRegistrationLoading(prev => ({
        ...prev,
        [selectedExam._id]: false
      }));
      message.error("Failed to register for exam: " + error.message);
    }
  };

  useEffect(() => {
    getExamsData();
  }, [getExamsData]);

  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedCategory, exams]);

  const handleFilter = () => {
    let filtered = [...exams];
    
    if (searchTerm) {
      filtered = filtered.filter(
        (exam) => 
          exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(
        (exam) => exam.category === selectedCategory
      );
    }
    
    setFilteredExams(filtered);
  };

  const getDifficultyTag = (marks, totalQuestions) => {
    const ratio = marks / totalQuestions;
    if (ratio >= 0.9) return <Tag color="red">Hard</Tag>;
    if (ratio >= 0.75) return <Tag color="orange">Moderate</Tag>;
    return <Tag color="green">Easy</Tag>;
  };

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="exam-name-cell">
          <div className="exam-title">
            {text}
            {record.isPaid && (
              <Tag color="gold" style={{ marginLeft: 8 }}>
                <DollarOutlined /> Paid
              </Tag>
            )}
          </div>
          <div className="exam-category">
            <BookOutlined style={{ marginRight: 8 }} />
            {record.category}
          </div>
        </div>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (duration) => (
        <Tooltip title={`${duration} seconds`}>
          <div className="duration-cell">
            <FieldTimeOutlined style={{ marginRight: 8 }} />
            {Math.floor(duration / 60)} mins
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Questions",
      dataIndex: "questions",
      render: (questions) => questions?.length || 0,
    },
    {
      title: "Difficulty",
      dataIndex: "passingMarks",
      render: (passingMarks, record) => 
        getDifficultyTag(passingMarks, record.totalMarks),
    },
    {
      title: "Pass Score",
      dataIndex: "totalMarks",
      render: (totalMarks, record) => (
        <span>
          <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />
          {record.passingMarks}/{totalMarks}
        </span>
      ),
    },
    {
      title: "Status",
      key: "registrationStatus",
      render: (_, record) => {
        const status = registrationStatus[record._id];
        if (!status) return <Tag>Not Registered</Tag>;
        
        if (status.isRegistered) {
          if (record.isPaid && status.paymentStatus !== "completed") {
            return <Tag color="orange">Payment Pending</Tag>;
          }
          return <Tag color="green">Registered</Tag>;
        }
        return <Tag>Not Registered</Tag>;
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        const status = registrationStatus[record._id];
        const isRegistered = status?.isRegistered;
        const isPaid = record.isPaid;
        const paymentComplete = !isPaid || (status?.paymentStatus === "completed");
        
        if (isRegistered && paymentComplete) {
          return (
            <Space>
              <Tooltip title="Exam code sent to your email">
                <Button
                  type="default"
                  icon={<MailOutlined />}
                  size="small"
                />
              </Tooltip>
              <Button 
                type="primary" 
                onClick={() => navigate(`/user/write-exam/${record._id}`)}
                className="start-exam-btn"
              >
                Start Exam
              </Button>
            </Space>
          );
        }
        
        if (isRegistered && !paymentComplete) {
          return (
            <Button
              type="primary" 
              icon={<DollarOutlined />}
              onClick={() => navigate(`/payment-portal/${record._id}`)}
              className="payment-btn"
              danger
            >
              Complete Payment
            </Button>
          );
        }
        
        return (
          <Button
            type="primary" 
            icon={<UserAddOutlined />}
            onClick={() => handleRegisterClick(record)}
            loading={registrationLoading[record._id]}
            className="register-btn"
          >
            Register
          </Button>
        );
      },
    },
  ];

  const renderTableView = () => (
    <Table
      columns={columns}
      dataSource={filteredExams}
      rowKey="_id"
      pagination={{
        pageSize: 10,
        hideOnSinglePage: true,
        showSizeChanger: false,
      }}
      className="exams-table"
      scroll={{ x: 'max-content' }}
    />
  );

  const renderCardView = () => (
    <div className="exams-card-container">
      {filteredExams.map(exam => (
        <AvailableExamCard 
          key={exam._id}
          exam={exam}
          registrationStatus={registrationStatus[exam._id]}
          onRegisterClick={handleRegisterClick}
          registrationLoading={registrationLoading[exam._id]}
        />
      ))}
    </div>
  );

  return (
    <div className="available-exams-container">
      <div className="header">
        <PageTitle title="Available Exams" />
        <div className="filters">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search exams..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Select category"
            className="category-select"
            value={selectedCategory}
            onChange={setSelectedCategory}
            allowClear
            style={{ width: 200 }}
          >
            {categories.map((category) => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle="solid">
            <Radio.Button value="cards"><AppstoreOutlined /> Cards</Radio.Button>
            <Radio.Button value="table"><TableOutlined /> Table</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div className="divider"></div>

      {filteredExams.length > 0 ? (
        viewMode === 'table' ? renderTableView() : renderCardView()
      ) : (
        <Empty 
          description="No exams available matching your criteria" 
          className="no-exams-found"
        />
      )}
      
      {/* Registration Modal */}
      <Modal
        title={
          selectedExam?.isPaid 
            ? "Paid Exam Registration" 
            : "Exam Registration"
        }
        open={showRegistrationModal}
        onCancel={() => setShowRegistrationModal(false)}
        footer={null}
      >
        {selectedExam && (
          <div className="registration-modal-content">
            <h3>{selectedExam.name}</h3>
            
            {registrationStatus[selectedExam?._id]?.isRegistered ? (
              <div>
                <div className="registration-status">
                  <Badge status="success" text="You are registered for this exam" />
                </div>
                
                {selectedExam.isPaid && (
                  <div className="payment-status">
                    <p>Payment Status: {' '}
                      {registrationStatus[selectedExam._id].paymentStatus === "completed" 
                        ? <Tag color="green">Completed</Tag> 
                        : <Tag color="orange">Pending</Tag>
                      }
                    </p>
                    
                    {registrationStatus[selectedExam._id].paymentStatus !== "completed" && (
                      <Button type="primary" danger>
                        Complete Payment (₹{selectedExam.price})
                      </Button>
                    )}
                  </div>
                )}
                
                <div className="exam-access">
                  <p>Your exam code has been sent to your email: <strong>{user.email}</strong></p>
                  <Button 
                    type="primary" 
                    onClick={() => navigate(`/user/write-exam/${selectedExam._id}`)}
                  >
                    Go to Exam
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p>You are about to register for this exam.</p>
                
                <div className="exam-details-card">
                  <div className="detail-item">
                    <span className="label">Category:</span>
                    <span className="value">{selectedExam.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Duration:</span>
                    <span className="value">{Math.floor(selectedExam.duration / 60)} minutes</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Total Questions:</span>
                    <span className="value">{selectedExam.questions?.length || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Pass Score:</span>
                    <span className="value">{selectedExam.passingMarks}/{selectedExam.totalMarks}</span>
                  </div>
                </div>
                
                <div className="token-info">
                  <LockOutlined className="token-icon" />
                  <div className="token-text">
                    <h4>Exam Access</h4>
                    <p>After registration, an exam token will be emailed to: <strong>{user.email}</strong></p>
                    <p>You'll need this token to access the exam.</p>
                  </div>
                </div>
                
                {selectedExam.isPaid && (
                  <div className="exam-payment-info">
                    <h4><DollarOutlined /> Paid Exam</h4>
                    <p><strong>Price:</strong> ₹{selectedExam.price}</p>
                    <p>After registration, you will need to complete the payment to access the exam.</p>
                  </div>
                )}
                
                <div className="modal-actions">
                  <Space>
                    <Button onClick={() => setShowRegistrationModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleRegisterConfirm}
                      loading={registrationLoading[selectedExam._id]}
                    >
                      Register Now
                    </Button>
                  </Space>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        footer={null}
        onCancel={() => setShowSuccessModal(false)}
        width={500}
        centered
      >
        <Result
          status="success"
          title="Registration Successful!"
          subTitle={
            <div>
              <p>You have successfully registered for the exam.</p>
              <p>An email with your exam token has been sent to:</p>
              <p><strong>{user?.email}</strong></p>
            </div>
          }
          extra={[
            <Button 
              type="primary" 
              key="console" 
              onClick={() => {
                setShowSuccessModal(false);
                if (selectedExam) {
                  navigate(`/user/write-exam/${selectedExam._id}`);
                }
              }}
            >
              Go to Exam
            </Button>,
            <Button 
              key="mail" 
              onClick={() => setShowSuccessModal(false)}
            >
              Check Email Later
            </Button>,
          ]}
        />
      </Modal>
      
      <style jsx="true">{`
        .available-exams-container {
          background: #fff;
          border-radius: var(--border-radius);
          padding: 20px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .filters {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .search-input {
          width: 250px;
        }
        
        .exams-table {
          margin-top: 20px;
        }
        
        .exams-card-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-top: 20px;
        }
        
        .exam-name-cell {
          display: flex;
          flex-direction: column;
        }
        
        .exam-title {
          font-weight: 500;
          font-size: 16px;
          color: var(--text-primary);
          display: flex;
          align-items: center;
        }
        
        .exam-category {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        
        .duration-cell {
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        .start-exam-btn {
          background: var(--primary);
          border-color: var(--primary);
        }
        
        .start-exam-btn:hover {
          background: var(--primary-dark);
          border-color: var(--primary-dark);
        }
        
        .register-btn {
          background: var(--success);
          border-color: var(--success);
        }
        
        .register-btn:hover {
          background: var(--success-dark);
          border-color: var(--success-dark);
        }
        
        .payment-btn {
          background: #ff4d4f;
          border-color: #ff4d4f;
        }
        
        .payment-btn:hover {
          background: #ff7875;
          border-color: #ff7875;
        }
        
        .no-exams-found {
          margin: 40px 0;
        }
        
        .registration-modal-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .registration-status {
          margin-bottom: 16px;
        }
        
        .payment-status,
        .exam-access,
        .exam-payment-info {
          background-color: #f9f9f9;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 16px;
        }
        
        .exam-details-card {
          background-color: #f9f9f9;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 16px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .label {
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .value {
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .token-info {
          display: flex;
          gap: 16px;
          background-color: #e6f7ff;
          border-left: 4px solid #1890ff;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 16px;
        }
        
        .token-icon {
          font-size: 28px;
          color: #1890ff;
        }
        
        .token-text h4 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #1890ff;
        }
        
        .token-text p {
          margin-bottom: 4px;
        }
        
        .exam-payment-info {
          background-color: #fff9e6;
          border-left: 4px solid #ffcc00;
        }
        
        .exam-payment-info h4 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #d48806;
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }
        
        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filters {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-input {
            width: 100%;
          }
          
          .category-select {
            width: 100% !important;
          }
          
          .exams-card-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AvailableExams;