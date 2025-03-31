import React, { useState, useEffect } from 'react';
import { Table, Button, Empty, Modal, Card, Row, Col, message, Tooltip } from 'antd';
import { 
  DownloadOutlined, 
  EyeOutlined, 
  ShareAltOutlined,
  TrophyOutlined,
  FilePdfOutlined,
  LinkedinOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import PageTitle from '../../../components/PageTitle';
import ResponsiveCard from '../../../components/ResponsiveCard';

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      dispatch(ShowLoading());
      // TODO: Replace with actual API call
      const mockCertificates = [
        {
          id: 1,
          examName: 'Advanced Mathematics',
          issueDate: '2025-03-15',
          score: 95,
          certificateId: 'CERT-001',
          status: 'issued',
          downloadUrl: '#',
          previewUrl: '#'
        },
        {
          id: 2,
          examName: 'Physics Fundamentals',
          issueDate: '2025-03-10',
          score: 88,
          certificateId: 'CERT-002',
          status: 'issued',
          downloadUrl: '#',
          previewUrl: '#'
        }
      ];
      setCertificates(mockCertificates);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to load certificates');
    }
  };

  const handlePreview = (certificate) => {
    setSelectedCertificate(certificate);
    setPreviewVisible(true);
  };

  const handleDownload = (certificate) => {
    // TODO: Implement actual download
    message.success('Certificate download started');
  };

  const handleShare = (certificate) => {
    // TODO: Implement sharing functionality
    message.info('Sharing options coming soon');
  };

  const columns = [
    {
      title: 'Certificate ID',
      dataIndex: 'certificateId',
      key: 'certificateId',
      render: (id) => <span className="certificate-id">{id}</span>
    },
    {
      title: 'Exam',
      dataIndex: 'examName',
      key: 'examName',
      render: (name) => (
        <div className="exam-name">
          <TrophyOutlined className="exam-icon" />
          <span>{name}</span>
        </div>
      )
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <span className={score >= 90 ? 'high-score' : 'normal-score'}>
          {score}%
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="certificate-actions">
          <Tooltip title="Preview">
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button 
              icon={<DownloadOutlined />} 
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          <Tooltip title="Share">
            <Button 
              icon={<ShareAltOutlined />} 
              onClick={() => handleShare(record)}
            />
          </Tooltip>
        </div>
      )
    }
  ];

  const renderCertificateStats = () => (
    <Row gutter={[16, 16]} className="stats-row">
      <Col xs={24} sm={8}>
        <ResponsiveCard>
          <div className="stat-content">
            <FilePdfOutlined className="stat-icon" />
            <div>
              <div className="stat-value">{certificates.length}</div>
              <div className="stat-label">Total Certificates</div>
            </div>
          </div>
        </ResponsiveCard>
      </Col>
      <Col xs={24} sm={8}>
        <ResponsiveCard>
          <div className="stat-content">
            <TrophyOutlined className="stat-icon" />
            <div>
              <div className="stat-value">
                {certificates.filter(c => c.score >= 90).length}
              </div>
              <div className="stat-label">With Distinction</div>
            </div>
          </div>
        </ResponsiveCard>
      </Col>
      <Col xs={24} sm={8}>
        <ResponsiveCard>
          <div className="stat-content">
            <LinkedinOutlined className="stat-icon" />
            <div>
              <div className="stat-value">
                {certificates.filter(c => c.shared).length}
              </div>
              <div className="stat-label">Shared</div>
            </div>
          </div>
        </ResponsiveCard>
      </Col>
    </Row>
  );

  return (
    <div className="certificates-container">
      <PageTitle 
        title="Certificates" 
        subtitle="View and manage your achievement certificates"
      />

      {renderCertificateStats()}

      <ResponsiveCard>
        {certificates.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={certificates}
            rowKey="id"
            pagination={{
              pageSize: 10,
              hideOnSinglePage: true
            }}
          />
        ) : (
          <Empty 
            description="No certificates earned yet" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </ResponsiveCard>

      <Modal
        title="Certificate Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(selectedCertificate)}
          >
            Download
          </Button>
        ]}
        width={800}
      >
        {selectedCertificate && (
          <div className="certificate-preview">
            {/* TODO: Add actual certificate preview */}
            <div className="preview-placeholder">
              Certificate Preview for {selectedCertificate.examName}
            </div>
          </div>
        )}
      </Modal>

      <style jsx="true">{`
        .certificates-container {
          padding: 1rem;
        }

        .stats-row {
          margin-bottom: 2rem;
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          font-size: 2rem;
          color: var(--primary);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .certificate-id {
          font-family: monospace;
          background: var(--background-secondary);
          padding: 0.25rem 0.5rem;
          border-radius: var(--border-radius);
        }

        .exam-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .exam-icon {
          color: var(--primary);
        }

        .high-score {
          color: var(--success);
          font-weight: 600;
        }

        .normal-score {
          color: var(--warning);
        }

        .certificate-actions {
          display: flex;
          gap: 0.5rem;
        }

        .preview-placeholder {
          background: var(--background-secondary);
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .certificate-actions {
            flex-direction: column;
          }

          .stat-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Certificates;