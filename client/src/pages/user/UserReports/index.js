import React, { useEffect, useCallback, useRef, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Tag, Radio, Empty } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import ResponsiveCard from "../../../components/ResponsiveCard";
import InfoItem from "../../../components/InfoItem";
import { TableOutlined, AppstoreOutlined, CheckCircleOutlined, CloseCircleOutlined, FileDoneOutlined } from "@ant-design/icons";
import moment from "moment";

function UserReports() {
  const [reportsData, setReportsData] = useState([]);
  const [viewMode, setViewMode] = useState("cards"); // 'table' or 'cards'
  const dispatch = useDispatch();
  const dataFetchedRef = useRef(false);

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam?.name || "Unknown Exam"}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam?.totalMarks || "N/A"}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam?.passingMarks || "N/A"}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result?.correctAnswers?.length || 0}</>,
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => {
        const verdict = record.result?.verdict || "N/A";
        return verdict === "Pass" ? (
          <Tag color="success">{verdict}</Tag>
        ) : verdict === "Fail" ? (
          <Tag color="error">{verdict}</Tag>
        ) : (
          <Tag>{verdict}</Tag>
        );
      },
    },
  ];

  const getData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response?.data?.message || "Something went wrong");
    }
  }, [dispatch]);

  useEffect(() => {
    // Only fetch data once when component mounts
    if (!dataFetchedRef.current) {
      dataFetchedRef.current = true;
      getData();
    }

    return () => {
      // Clean up
      dataFetchedRef.current = false;
    };
  }, [getData]);

  const getVerdictIcon = (verdict) => {
    if (verdict === "Pass") {
      return <CheckCircleOutlined className="verdict-icon pass" />;
    } else if (verdict === "Fail") {
      return <CloseCircleOutlined className="verdict-icon fail" />;
    }
    return null;
  };

  const renderTableView = () => (
    <div className="responsive-table">
      <Table 
        columns={columns} 
        dataSource={reportsData} 
        rowKey="_id"
        pagination={{ 
          pageSize: 10,
          hideOnSinglePage: true,
          showSizeChanger: false
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
                <span>{report.exam?.name || "Unknown Exam"}</span>
                {report.result?.verdict && (
                  <Tag 
                    color={report.result.verdict === "Pass" ? "success" : "error"}
                    className="verdict-tag"
                  >
                    {report.result.verdict}
                  </Tag>
                )}
              </div>
            }
          >
            <div className="report-info">
              <InfoItem 
                icon={<FileDoneOutlined />}
                label="Date:" 
                value={moment(report.createdAt).format("DD-MM-YYYY")} 
              />
              <InfoItem 
                label="Time:" 
                value={moment(report.createdAt).format("hh:mm A")} 
              />
              <InfoItem 
                label="Total Marks:" 
                value={report.exam?.totalMarks || "N/A"} 
              />
              <InfoItem 
                label="Passing Marks:" 
                value={report.exam?.passingMarks || "N/A"} 
              />
              <InfoItem 
                label="Obtained Marks:" 
                value={report.result?.correctAnswers?.length || 0} 
                className={report.result?.verdict === "Pass" ? "pass-text" : "fail-text"}
              />
              
              <div className="score-indicator">
                <div className="score-bar">
                  <div 
                    className={`score-progress ${report.result?.verdict === "Pass" ? "pass" : "fail"}`}
                    style={{ 
                      width: `${(report.result?.correctAnswers?.length / report.exam?.totalMarks) * 100}%` 
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
      <div className="reports-header">
        <PageTitle title="Your Reports" />
        <div className="view-toggle">
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle="solid">
            <Radio.Button value="cards"><AppstoreOutlined /> Cards</Radio.Button>
            <Radio.Button value="table"><TableOutlined /> Table</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div className="divider"></div>
      
      {viewMode === 'table' ? renderTableView() : renderCardView()}
      
      <style jsx="true">{`
        .reports-container {
          padding: 0.5rem;
        }
        
        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
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
        
        .verdict-icon {
          font-size: 1.5rem;
          margin-right: 0.5rem;
        }
        
        .verdict-icon.pass {
          color: var(--success);
        }
        
        .verdict-icon.fail {
          color: var(--danger);
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
          .reports-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .view-toggle {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default UserReports;
