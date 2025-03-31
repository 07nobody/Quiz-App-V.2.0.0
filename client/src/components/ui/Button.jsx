import React from 'react';
import PropTypes from 'prop-types';
import { Button as AntButton } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

/**
 * Custom Button component that extends Ant Design Button
 * with standardized styling and variants
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'middle',
  block = false,
  icon,
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  htmlType = 'button',
  ...rest
}) => {
  // Define consistent classes for each variant
  const variantClasses = {
    primary: 'quiz-button-primary',
    secondary: 'quiz-button-secondary',
    outline: 'quiz-button-outline',
    text: 'text-primary hover:bg-primary/5 hover:text-primary-dark',
    danger: 'bg-danger text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500/30',
    success: 'bg-success text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500/30',
  };

  // Size classes
  const sizeClasses = {
    small: 'text-xs h-8 px-3',
    middle: 'text-sm h-10 px-4',
    large: 'text-base h-12 px-5',
  };

  // Combine all classes
  const buttonClass = `
    ${variantClasses[variant] || variantClasses.primary} 
    ${sizeClasses[size] || sizeClasses.middle}
    ${block ? 'w-full' : ''}
    rounded-md font-medium transition-all duration-200 flex items-center justify-center
    focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed
    ${className}
  `.trim();

  return (
    <AntButton
      className={buttonClass}
      type={type}
      htmlType={htmlType}
      onClick={onClick}
      disabled={disabled || loading}
      icon={loading ? <LoadingOutlined /> : icon}
      {...rest}
    >
      {children}
    </AntButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  block: PropTypes.bool,
  icon: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  htmlType: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;