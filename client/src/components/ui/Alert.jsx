import React from 'react';
import PropTypes from 'prop-types';
import { Alert as AntAlert } from 'antd';
import { 
  CheckCircleOutlined, 
  InfoCircleOutlined, 
  WarningOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';

/**
 * Alert Component
 * A consistent alert component that wraps Ant Design's Alert with our styling
 */
const Alert = ({
  type = 'info',
  message,
  description,
  showIcon = true,
  closable = false,
  onClose,
  className = '',
  banner = false,
  action,
}) => {
  // Map type to icon
  const iconMap = {
    success: <CheckCircleOutlined />,
    info: <InfoCircleOutlined />,
    warning: <WarningOutlined />,
    error: <CloseCircleOutlined />
  };

  return (
    <AntAlert
      type={type}
      message={message}
      description={description}
      showIcon={showIcon}
      icon={showIcon ? iconMap[type] : null}
      closable={closable}
      onClose={onClose}
      className={`rounded-md ${className}`}
      banner={banner}
      action={action}
    />
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  message: PropTypes.node.isRequired,
  description: PropTypes.node,
  showIcon: PropTypes.bool,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  banner: PropTypes.bool,
  action: PropTypes.node
};

export default Alert;