import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Space, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const { Title } = Typography;

/**
 * PageHeader Component
 * Provides a consistent header for pages with title, breadcrumbs and actions
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  className = '',
}) => {
  // Generate breadcrumbs based on provided data
  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;

    return (
      <Breadcrumb className="mb-2">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        {breadcrumbs.map((crumb, index) => (
          <Breadcrumb.Item key={index}>
            {crumb.path ? (
              <Link to={crumb.path}>{crumb.label}</Link>
            ) : (
              crumb.label
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };

  return (
    <div className={`mb-6 ${className}`}>
      {renderBreadcrumbs()}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={2} className="mb-1 !text-2xl md:!text-3xl">
            {title}
          </Title>
          {subtitle && (
            <Typography.Paragraph className="text-text-secondary mb-0">
              {subtitle}
            </Typography.Paragraph>
          )}
        </div>
        
        {actions && (
          <Space className="flex-wrap">
            {actions}
          </Space>
        )}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ),
  actions: PropTypes.node,
  className: PropTypes.string,
};

export default PageHeader;