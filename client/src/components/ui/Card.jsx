import React from 'react';
import PropTypes from 'prop-types';
import { Card as AntCard } from 'antd';
import { useTheme } from '@contexts';

/**
 * Custom Card component that extends Ant Design Card
 * with standardized styling and variants
 */
const Card = ({
  children,
  title,
  subtitle,
  variant = 'default',
  bordered = true,
  hoverable = false,
  shadow = 'sm',
  extra,
  className = '',
  bodyStyle = {},
  ...rest
}) => {
  const { theme } = useTheme();
  
  // Define shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };
  
  // Define variant classes
  const variantClasses = {
    default: '',
    primary: 'border-primary/30 bg-primary/5',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-danger/30 bg-danger/5',
    info: 'border-info/30 bg-info/5',
  };
  
  // Combine all classes
  const cardClass = `
    rounded-lg transition-all
    ${shadowClasses[shadow] || shadowClasses.sm}
    ${variantClasses[variant] || variantClasses.default}
    ${hoverable ? 'hover:shadow-md cursor-pointer' : ''}
    ${theme === 'dark' ? 'border-neutral-700' : ''}
    ${className}
  `.trim();

  return (
    <AntCard
      title={title && (
        <div>
          <div className="text-lg font-medium">{title}</div>
          {subtitle && <div className="text-sm text-secondary mt-1">{subtitle}</div>}
        </div>
      )}
      bordered={bordered}
      className={cardClass}
      extra={extra}
      bodyStyle={{
        padding: '1rem',
        ...bodyStyle,
      }}
      {...rest}
    >
      {children}
    </AntCard>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  bordered: PropTypes.bool,
  hoverable: PropTypes.bool,
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  extra: PropTypes.node,
  className: PropTypes.string,
  bodyStyle: PropTypes.object,
};

export default Card;