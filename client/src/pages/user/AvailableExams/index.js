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
      // No need to pass userId explicitly as auth middleware will add it
      const response = await checkExamRegistration({
        examId
      });
      
      if (response.success) {
        setRegistrationStatus(prev => ({
          ...prev,
          [examId]: response.data
        }));
      } else {
        console.warn(`Failed to check registration for exam ${examId}: ${response.message}`);
      }
    } catch (error) {
      console.error(`Error checking registration for exam ${examId}:`, error);
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

  const handleFilter = useCallback(() => {
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
  }, [exams, searchTerm, selectedCategory]);

  useEffect(() => {
    getExamsData();
  }, [getExamsData]);

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

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
        <div>
          <div>
            {text}
            {record.isPaid && (
              <Tag color="gold">
                <DollarOutlined /> Paid
              </Tag>
            )}
          </div>
          <div>
            <BookOutlined />
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
          <div>
            <FieldTimeOutlined />
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
          <CheckCircleOutlined />
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
      scroll={{ x: 'max-content' }}
    />
  );

  const renderCardView = () => (
    <div>
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
    <div>
      <div>
        <PageTitle title="Available Exams" />
        <div>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Select category"
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
      <div></div>

      {filteredExams.length > 0 ? (
        viewMode === 'table' ? renderTableView() : renderCardView()
      ) : (
        <Empty 
          description="No exams available matching your criteria" 
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
          <div>
            <h3>{selectedExam.name}</h3>
            
            {registrationStatus[selectedExam?._id]?.isRegistered ? (
              <div>
                <div>
                  <Badge status="success" text="You are registered for this exam" />
                </div>
                
                {selectedExam.isPaid && (
                  <div>
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
                
                <div>
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
                
                <div>
                  <div>
                    <span>Category:</span>
                    <span>{selectedExam.category}</span>
                  </div>
                  <div>
                    <span>Duration:</span>
                    <span>{Math.floor(selectedExam.duration / 60)} minutes</span>
                  </div>
                  <div>
                    <span>Total Questions:</span>
                    <span>{selectedExam.questions?.length || 0}</span>
                  </div>
                  <div>
                    <span>Pass Score:</span>
                    <span>{selectedExam.passingMarks}/{selectedExam.totalMarks}</span>
                  </div>
                </div>
                
                <div>
                  <LockOutlined />
                  <div>
                    <h4>Exam Access</h4>
                    <p>After registration, an exam token will be emailed to: <strong>{user.email}</strong></p>
                    <p>You'll need this token to access the exam.</p>
                  </div>
                </div>
                
                {selectedExam.isPaid && (
                  <div>
                    <h4><DollarOutlined /> Paid Exam</h4>
                    <p><strong>Price:</strong> ₹{selectedExam.price}</p>
                    <p>After registration, you will need to complete the payment to access the exam.</p>
                  </div>
                )}
                
                <div>
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
    </div>
  );
}

export default AvailableExams;