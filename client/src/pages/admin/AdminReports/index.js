import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Input, Radio, Button, Tag, Empty } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import ResponsiveCard from "../../../components/ResponsiveCard";
import InfoItem from "../../../components/InfoItem";
import ActionButtons from "../../../components/ActionButtons";
import { TableOutlined, AppstoreOutlined, SearchOutlined, ClearOutlined, FileTextOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => (
        <span className="font-medium">{record.exam.name}</span>
      ),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => (
        <span className="font-medium">{record.user.name}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <span>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</span>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <span>{record.exam.totalMarks}</span>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <span>{record.exam.passingMarks}</span>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => (
        <span className="font-medium">{record.result.correctAnswers.length}</span>
      ),
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => {
        return record.result.verdict === "Pass" ? (
          <Tag color="success">{record.result.verdict}</Tag>
        ) : (
          <Tag color="error">{record.result.verdict}</Tag>
        );
      },
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters);
  }, []);

  const handleFiltersChange = (e, field) => {
    setFilters({
      ...filters,
      [field]: e.target.value
    });
  };

  const handleSearch = () => {
    getData(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      examName: "",
      userName: "",
    };
    setFilters(clearedFilters);
    getData(clearedFilters);
  };

  const renderTableView = () => (
    <div className="responsive-table">
      <Table 
        columns={columns} 
        dataSource={reportsData} 
        rowKey="_id"
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"],
          hideOnSinglePage: true
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );

  const renderCardView = () => (
    <div className="responsive-grid">
      {reportsData.length > 0 ? (
        reportsData.map((report) => (
          <ResponsiveCard
            key={report._id}
            className="report-card"
            title={
              <div className="report-card-title">
                <span>{report.exam.name}</span>
                <Tag 
                  color={report.result.verdict === "Pass" ? "success" : "error"}
                  className="verdict-tag"
                >
                  {report.result.verdict}
                </Tag>
              </div>
            }
          >
            <div className="report-info">
              <InfoItem 
                icon={<UserOutlined />}
                label="User:" 
                value={report.user.name}
              />
              <InfoItem 
                icon={<FileTextOutlined />}
                label="Date:" 
                value={moment(report.createdAt).format("DD-MM-YYYY")}
              />
              <InfoItem 
                label="Time:" 
                value={moment(report.createdAt).format("hh:mm A")}
              />
              <InfoItem 
                label="Total Marks:" 
                value={report.exam.totalMarks}
              />
              <InfoItem 
                label="Passing Marks:" 
                value={report.exam.passingMarks}
              />
              <InfoItem 
                label="Obtained Marks:" 
                value={report.result.correctAnswers.length}
                className={report.result.verdict === "Pass" ? "pass-text" : "fail-text"}
              />
              
              <div className="score-indicator">
                <div className="score-bar">
                  <div 
                    className={`score-progress ${report.result.verdict === "Pass" ? "pass" : "fail"}`}
                    style={{ 
                      width: `${(report.result.correctAnswers.length / report.exam.totalMarks) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </ResponsiveCard>
        ))
      ) : (
        <Empty description="No reports found" />
      )}
    </div>
  );

  return (
    <div className="reports-container">
      <ResponsiveCard
        title={<PageTitle title="Exam Reports" />}
        extra={
          <div className="view-toggle">
            <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle="solid">
              <Radio.Button value="table"><TableOutlined /> Table</Radio.Button>
              <Radio.Button value="cards"><AppstoreOutlined /> Cards</Radio.Button>
            </Radio.Group>
          </div>
        }
      >
        <div className="filters-container flex-column-mobile">
          <div className="filter-group">
            <label className="filter-label">Filter by Exam</label>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by exam name"
              value={filters.examName}
              onChange={(e) => handleFiltersChange(e, "examName")}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Filter by User</label>
            <Input
              prefix={<UserOutlined />}
              placeholder="Search by user name"
              value={filters.userName}
              onChange={(e) => handleFiltersChange(e, "userName")}
              className="filter-input"
            />
          </div>
          <div className="filter-actions">
            <ActionButtons align="left" responsive={true}>
              <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                Clear
              </Button>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Search
              </Button>
            </ActionButtons>
          </div>
        </div>

        {viewMode === 'table' ? renderTableView() : renderCardView()}
      </ResponsiveCard>
      
      <style jsx="true">{`
        .reports-container {
          padding: 0.5rem;
        }
        
        .filters-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: flex-end;
        }
        
        .filter-group {
          flex: 1;
          min-width: 200px;
        }
        
        .filter-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .filter-input {
          width: 100%;
        }
        
        .filter-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .report-card-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        
        .report-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .pass-text {
          color: var(--success);
          font-weight: bold;
        }
        
        .fail-text {
          color: var(--danger);
          font-weight: bold;
        }
        
        .score-indicator {
          margin-top: 0.75rem;
        }
        
        .score-bar {
          height: 8px;
          background-color: var(--light-accent);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .score-progress {
          height: 100%;
          border-radius: 4px;
        }
        
        .score-progress.pass {
          background-color: var(--success);
        }
        
        .score-progress.fail {
          background-color: var(--danger);
        }
        
        @media (max-width: 768px) {
          .view-toggle {
            margin-top: 1rem;
          }
          
          .filter-actions {
            width: 100%;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminReports;
