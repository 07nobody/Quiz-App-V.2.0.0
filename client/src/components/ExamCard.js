import React, { useMemo, useCallback } from 'react';
import { Button, Tag, Dropdown } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  BookOutlined,
  FileTextOutlined,
  FieldTimeOutlined, 
  CheckCircleOutlined
} from '@ant-design/icons';
import ResponsiveCard from './ResponsiveCard';
import InfoItem from './InfoItem';

/**
 * Card component for displaying an exam in the admin section
 * 
 * @param {Object} props
 * @param {Object} props.exam - The exam data to display
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onQuestions - Function to call when add/edit questions button is clicked
 */
function ExamCard({ exam, onDelete, onEdit, onQuestions }) {
  // Memoize the status tag to prevent unnecessary re-renders
  const statusTag = useMemo(() => {
    if (!exam.isActive) {
      return <Tag color="error">Inactive</Tag>;
    }
    
    const hasQuestions = exam.questions?.length > 0;
    if (!hasQuestions) {
      return <Tag color="warning">No Questions</Tag>;
    }
    
    return <Tag color="success">Active</Tag>;
  }, [exam.isActive, exam.questions?.length]);
  
  // Use callbacks for event handlers to prevent recreating functions on each render
  const handleEdit = useCallback(() => onEdit(exam), [exam, onEdit]);
  const handleQuestions = useCallback(() => onQuestions(exam), [exam, onQuestions]);
  const handleDelete = useCallback(() => onDelete(exam), [exam, onDelete]);
  
  // Memoize menu items to prevent recreating the array on each render
  const menuItems = useMemo(() => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Exam",
      onClick: handleEdit
    },
    {
      key: "questions",
      icon: <FileTextOutlined />,
      label: "Manage Questions",
      onClick: handleQuestions
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Exam",
      danger: true,
      onClick: handleDelete
    }
  ], [handleEdit, handleQuestions, handleDelete]);
  
  // Memoize the card title to prevent unnecessary re-renders
  const cardTitle = useMemo(() => (
    <div className="exam-card-header">
      <div className="exam-name">{exam.name}</div>
      {statusTag}
    </div>
  ), [exam.name, statusTag]);
  
  // Memoize the card extra content to prevent unnecessary re-renders
  const cardExtra = useMemo(() => (
    <div className="card-actions-desktop hidden-mobile">
      <Button 
        type="primary" 
        icon={<EditOutlined />} 
        onClick={handleEdit} 
        className="edit-btn"
      >
        Edit
      </Button>
      <Button 
        type="default" 
        icon={<FileTextOutlined />} 
        onClick={handleQuestions} 
        className="questions-btn"
      >
        Questions
      </Button>
      <Button 
        type="text"
        icon={<DeleteOutlined />} 
        onClick={handleDelete} 
        danger
        className="delete-btn"
      >
        Delete
      </Button>
    </div>
  ), [handleEdit, handleQuestions, handleDelete]);
  
  // Memoize the card footer to prevent unnecessary re-renders
  const cardFooter = useMemo(() => (
    <div className="card-actions-mobile visible-mobile">
      <Dropdown 
        menu={{ items: menuItems }} 
        trigger={['click']} 
        placement="bottomRight"
      >
        <Button icon={<MoreOutlined />}>Actions</Button>
      </Dropdown>
    </div>
  ), [menuItems]);
  
  // Memoize the duration string to prevent recalculating on each render
  const durationString = useMemo(() => 
    `${Math.floor(exam.duration / 60)} mins`, 
    [exam.duration]
  );
  
  // Memoize the pass score string to prevent recalculating on each render
  const passScoreString = useMemo(() => 
    `${exam.passingMarks}/${exam.totalMarks}`, 
    [exam.passingMarks, exam.totalMarks]
  );
  
  return (
    <ResponsiveCard 
      className="admin-exam-card"
      title={cardTitle}
      extra={cardExtra}
      footer={cardFooter}
    >
      <div className="exam-card-content">
        <div className="exam-info">
          <InfoItem 
            icon={<BookOutlined className="info-icon" />}
            label="Category:" 
            value={exam.category}
          />
          
          <InfoItem 
            icon={<FieldTimeOutlined className="info-icon" />}
            label="Duration:" 
            value={durationString}
          />
          
          <div className="info-row">
            <InfoItem 
              label="Questions:" 
              value={exam.questions?.length || 0}
            />
            
            <InfoItem 
              icon={<CheckCircleOutlined className="info-icon success-icon" />}
              label="Pass Score:" 
              value={passScoreString}
            />
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .admin-exam-card {
          transition: all 0.3s ease;
        }
        
        .admin-exam-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .exam-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .exam-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        
        .exam-card-content {
          padding: 0.5rem 0;
        }
        
        .exam-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .info-row {
          display: flex;
          gap: 1.5rem;
        }
        
        .card-actions-desktop {
          display: flex;
          gap: 0.5rem;
        }
        
        .edit-btn {
          background-color: var(--primary);
          border-color: var(--primary);
        }
        
        .questions-btn {
          color: var(--primary);
          border-color: var(--primary);
        }
        
        .info-icon {
          color: var(--primary);
        }
        
        .success-icon {
          color: var(--success);
        }
        
        @media (max-width: 992px) {
          .info-row {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
    </ResponsiveCard>
  );
}

// Wrap the component with React.memo to prevent unnecessary re-renders
export default React.memo(ExamCard);
