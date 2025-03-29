import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message, Table, Button, Popconfirm, Tag, Tooltip, Badge, Modal, Radio } from "antd";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, QuestionCircleOutlined, CopyOutlined, UsergroupAddOutlined, ReloadOutlined, TableOutlined, AppstoreOutlined } from "@ant-design/icons";
import PageTitle from "../../../components/PageTitle";
import ExamCard from "../../../components/ExamCard";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllExams, deleteExamById, regenerateExamToken } from "../../../apicalls/exams";
import moment from "moment";

function Exams() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [exams, setExams] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [regenerateModalVisible, setRegenerateModalVisible] = useState(false);
  const [examToRegenerate, setExamToRegenerate] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'

  const getExamsData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const confirmRegenerateToken = (exam) => {
    setExamToRegenerate(exam);
    setRegenerateModalVisible(true);
  };

  const handleRegenerateToken = async () => {
    if (!examToRegenerate) return;
    
    try {
      dispatch(ShowLoading());
      const response = await regenerateExamToken({
        examId: examToRegenerate._id
      });
      
      dispatch(HideLoading());
      if (response.success) {
        message.success("Exam token regenerated successfully and notifications sent");
        setRegenerateModalVisible(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        message.error(response.message || "Failed to regenerate token");
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getExamsData();
  }, [getExamsData, refreshTrigger]);

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name",
    },
    {
      title: "Duration (in seconds)",
      dataIndex: "duration",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
    },
    {
      title: "Exam Code",
      dataIndex: "examCode",
      render: (text) => (
        <div className="exam-code-container">
          <Tag color="blue">{text || "N/A"}</Tag>
          <Tooltip title="Copy exam code">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(text);
                message.success("Exam code copied to clipboard!");
              }}
              size="small"
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => {
        return <Tag color={text === "active" ? "green" : "red"}>{text ? text.toUpperCase() : 'INACTIVE'}</Tag>;
      },
    },
    {
      title: "Type",
      dataIndex: "isPaid",
      render: (isPaid) => {
        return isPaid ? 
          <Tag color="gold">PAID (₹{isPaid.price || 0})</Tag> : 
          <Tag color="green">FREE</Tag>;
      },
    },
    {
      title: "Registered Users",
      dataIndex: "registeredUsers",
      render: (registeredUsers) => {
        const count = registeredUsers?.length || 0;
        return (
          <Badge count={count} showZero overflowCount={999} style={{ backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9' }}>
            <Button 
              type="default" 
              icon={<UsergroupAddOutlined />} 
              size="small"
              disabled={count === 0}
            >
              View
            </Button>
          </Badge>
        );
      }
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD-MM-YYYY hh:mm:ss"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button 
            type="primary"
            shape="circle" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          />
          <Button 
            type="primary"
            shape="circle" 
            icon={<QuestionCircleOutlined />}
            onClick={() => navigate(`/admin/exams/questions/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this exam?"
            onConfirm={() => deleteExam(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
          <Tooltip title="Regenerate Token">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<ReloadOutlined />} 
              onClick={() => confirmRegenerateToken(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const openShareModal = (exam) => {
    setSelectedExam(exam);
    setShareModalVisible(true);
  };

  const handleShare = (method) => {
    if (!selectedExam) return;

    const examInfo = `
Exam Name: ${selectedExam.name}
Category: ${selectedExam.category}
Duration: ${Math.floor(selectedExam.duration / 60)} minutes
Exam Code: ${selectedExam.examCode}

This code is required to access the exam. Please keep it confidential.`;

    if (method === 'copy') {
      navigator.clipboard.writeText(examInfo);
      message.success('Exam details copied to clipboard!');
    } else if (method === 'email') {
      const subject = encodeURIComponent(`Exam Details: ${selectedExam.name}`);
      const body = encodeURIComponent(examInfo);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }

    setShareModalVisible(false);
  };

  const renderCardView = () => (
    <div className="cards-container">
      {exams.map((exam) => (
        <ExamCard 
          key={exam._id} 
          exam={exam} 
          onDelete={deleteExam}
          onRegenerateToken={confirmRegenerateToken}
        />
      ))}
    </div>
  );

  const renderTableView = () => (
    <Table 
      columns={columns} 
      dataSource={exams} 
      rowKey="_id" 
      pagination={{
        pageSize: 10,
        showSizeChanger: false
      }}
    />
  );

  return (
    <div>
      <div className="flex justify-between mt-2 items-center">
        <PageTitle title="Exams" />
        <Button 
          type="primary" 
          icon={<PlusCircleOutlined />}
          onClick={() => navigate("/admin/exams/add")}
        >
          Add Exam
        </Button>
      </div>
      <div className="divider"></div>

      <div className="view-toggle flex justify-end mb-4">
        <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle="solid">
          <Radio.Button value="table"><TableOutlined /> Table View</Radio.Button>
          <Radio.Button value="cards"><AppstoreOutlined /> Card View</Radio.Button>
        </Radio.Group>
      </div>

      {viewMode === 'table' ? renderTableView() : renderCardView()}

      <style jsx="true">{`
        .exam-code-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>

      <Modal
        title="Regenerate Exam Token"
        open={regenerateModalVisible}
        onOk={handleRegenerateToken}
        onCancel={() => setRegenerateModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to regenerate the token for this exam?</p>
      </Modal>

      <Modal
        title="Share Exam Details"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
      >
        {selectedExam && (
          <div>
            <p><strong>Exam Name:</strong> {selectedExam.name}</p>
            <p><strong>Category:</strong> {selectedExam.category}</p>
            <p><strong>Duration:</strong> {Math.floor(selectedExam.duration / 60)} minutes</p>
            <p><strong>Exam Code:</strong> {selectedExam.examCode}</p>
            <div className="mt-4 flex gap-2">
              <Button type="primary" onClick={() => handleShare('copy')}>Copy to Clipboard</Button>
              <Button onClick={() => handleShare('email')}>Share via Email</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Exams;
