import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

/**
 * EmptyState Component
 * Displays a consistent empty state with optional action button
 */
const EmptyState = ({
  image,
  title = 'No Data',
  description = 'No data available at the moment',
  actionText,
  actionIcon = <PlusOutlined />,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-6 flex flex-col items-center justify-center text-center ${className}`}>
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <h3 className="font-medium text-lg mb-2">{title}</h3>
            <p className="text-text-secondary">{description}</p>
          </div>
        }
      />
      
      {actionText && onAction && (
        <Button 
          type="primary"
          icon={actionIcon}
          onClick={onAction}
          className="mt-4"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  image: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  actionText: PropTypes.string,
  actionIcon: PropTypes.node,
  onAction: PropTypes.func,
  className: PropTypes.string,
};

export default EmptyState;