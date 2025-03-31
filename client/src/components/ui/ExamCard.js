import React, { useMemo, useCallback } from 'react';
import { Button, Tag, Dropdown, Tooltip, Badge } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  BookOutlined,
  FileTextOutlined,
  FieldTimeOutlined, 
  CheckCircleOutlined,
  QuestionCircleOutlined,
  CalendarOutlined,
  ShareAltOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import ResponsiveCard from './ResponsiveCard';
import InfoItem from './InfoItem';
import { useTheme } from '../contexts/ThemeContext';
import moment from 'moment';

/**
 * Enhanced Card component for displaying an exam in the admin section
 * with modern styling, animations and better UX
 */
function ExamCard({ 
  exam, 
  onDelete, 
  onEdit, 
  onQuestions, 
  onShare, 
  onRegenerateToken,
  onView
}) {
  const { currentTheme } = useTheme();
  
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
  
  // Determine category style based on category name
  const categoryStyle = useMemo(() => {
    const lowerCategory = exam.category.toLowerCase();
    
    if (lowerCategory.includes('math')) return { color: '#4f46e5', bgColor: 'rgba(79, 70, 229, 0.1)' };
    if (lowerCategory.includes('science')) return { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' };
    if (lowerCategory.includes('history')) return { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' };
    if (lowerCategory.includes('language')) return { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
    if (lowerCategory.includes('tech') || lowerCategory.includes('computer')) return { color: '#0ea5e9', bgColor: 'rgba(14, 165, 233, 0.1)' };
    
    return { color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.1)' };
  }, [exam.category]);
  
  // Use callbacks for event handlers
  const handleEdit = useCallback(() => onEdit(exam), [exam, onEdit]);
  const handleQuestions = useCallback(() => onQuestions(exam), [exam, onQuestions]);
  const handleDelete = useCallback(() => onDelete(exam), [exam, onDelete]);
  const handleShare = useCallback(() => onShare && onShare(exam), [exam, onShare]);
  const handleRegenerateToken = useCallback(() => onRegenerateToken && onRegenerateToken(exam), [exam, onRegenerateToken]);
  const handleView = useCallback(() => onView && onView(exam), [exam, onView]);
  
  // Memoize menu items
  const menuItems = useMemo(() => {
    const items = [
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
      }
    ];
    
    if (onView) {
      items.push({
        key: "view",
        icon: <EyeOutlined />,
        label: "Preview Exam",
        onClick: handleView
      });
    }
    
    if (onShare) {
      items.push({
        key: "share",
        icon: <ShareAltOutlined />,
        label: "Share Exam",
        onClick: handleShare
      });
    }
    
    if (onRegenerateToken) {
      items.push({
        key: "regenerate",
        icon: <ReloadOutlined />,
        label: "Regenerate Token",
        onClick: handleRegenerateToken
      });
    }
    
    items.push({
      type: 'divider'
    });
    
    items.push({
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Exam",
      danger: true,
      onClick: handleDelete
    });
    
    return items;
  }, [handleEdit, handleQuestions, handleDelete, handleShare, handleRegenerateToken, handleView, onShare, onRegenerateToken, onView]);
  
  // Memoize the card title
  const cardTitle = useMemo(() => (
    <div className="flex justify-between items-center gap-2.5">
      <div className="font-semibold text-lg text-text-primary truncate">{exam.name}</div>
      {statusTag}
    </div>
  ), [exam.name, statusTag]);
  
  // Memoize the card extra content
  const cardExtra = useMemo(() => (
    <div className="hidden md:flex gap-2">
      <Tooltip title="Edit exam details">
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={handleEdit}
          shape="circle"
        />
      </Tooltip>
      <Tooltip title="Manage questions">
        <Button 
          type="default" 
          icon={<FileTextOutlined />} 
          onClick={handleQuestions}
          shape="circle"
        />
      </Tooltip>
      <Tooltip title="Delete exam">
        <Button 
          type="text"
          icon={<DeleteOutlined />} 
          onClick={handleDelete} 
          danger
          shape="circle"
        />
      </Tooltip>
    </div>
  ), [handleEdit, handleQuestions, handleDelete]);
  
  // Memoize the card footer
  const cardFooter = useMemo(() => (
    <div className="flex justify-end md:hidden">
      <Dropdown 
        menu={{ items: menuItems }} 
        trigger={['click']} 
        placement="bottomRight"
      >
        <Button icon={<MoreOutlined />}>Actions</Button>
      </Dropdown>
    </div>
  ), [menuItems]);
  
  // Memoize the duration string
  const durationString = useMemo(() => 
    `${Math.floor(exam.duration / 60)} mins`, 
    [exam.duration]
  );
  
  // Memoize the pass score string
  const passScoreString = useMemo(() => 
    `${exam.passingMarks}/${exam.totalMarks}`, 
    [exam.passingMarks, exam.totalMarks]
  );

  // Get relative time of exam creation
  const createdTimeAgo = useMemo(() => 
    moment(exam.createdAt).fromNow(), 
    [exam.createdAt]
  );
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ translateY: -5 }}
      className="h-full"
    >
      <ResponsiveCard 
        className="transition-all duration-300 h-full flex flex-col"
        title={cardTitle}
        extra={cardExtra}
        footer={cardFooter}
      >
        <div className="py-2 flex-1 flex flex-col gap-4">
          <div 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2"
            style={{color: categoryStyle.color, backgroundColor: categoryStyle.bgColor}}
          >
            <BookOutlined className="mr-1" />
            {exam.category}
          </div>
          
          <div className="flex flex-col flex-1 gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <FieldTimeOutlined className="text-lg text-text-secondary mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs text-text-secondary">Duration</div>
                  <div className="font-medium text-text-primary">{durationString}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <QuestionCircleOutlined className="text-lg text-text-secondary mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs text-text-secondary">Questions</div>
                  <div className="font-medium text-text-primary">{exam.questions?.length || 0}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircleOutlined className="text-lg text-success mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs text-text-secondary">Pass Score</div>
                  <div className="font-medium text-text-primary">{passScoreString}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CalendarOutlined className="text-lg text-text-secondary mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs text-text-secondary">Created</div>
                  <div className="font-medium text-text-primary">{createdTimeAgo}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center mt-auto">
              {exam.registeredUsers?.length > 0 && (
                <Badge count={exam.registeredUsers.length} overflowCount={999} showZero={false} />
              )}
              
              {exam.isFree ? (
                <Tag color="success">Free</Tag>
              ) : (
                <Tag color="blue">Premium</Tag>
              )}
              
              {exam.examCode && (
                <Tooltip title="Exam Code">
                  <Tag color="purple">{exam.examCode}</Tag>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </ResponsiveCard>
    </motion.div>
  );
}

// Wrap the component with React.memo to prevent unnecessary re-renders
export default React.memo(ExamCard);
