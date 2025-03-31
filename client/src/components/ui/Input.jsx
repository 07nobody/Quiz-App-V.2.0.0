import React from 'react';
import { Input as AntInput } from 'antd';
import PropTypes from 'prop-types';

/**
 * Enhanced Input component that extends Ant Design Input
 * with additional styling using Tailwind CSS
 */
const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  readOnly = false,
  className = '',
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  size = 'middle',
  status,
  ...rest
}) => {
  // Base classes shared by all input types
  const baseClasses = `
    rounded-md border-gray-300 focus:border-primary focus:shadow
    transition-all placeholder:text-gray-400
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}
    ${readOnly ? 'bg-gray-50' : ''}
    ${status === 'error' ? 'border-danger focus:border-danger' : ''}
    ${status === 'warning' ? 'border-warning focus:border-warning' : ''}
    ${className}
  `;

  // Render different input types
  if (type === 'password') {
    return (
      <AntInput.Password
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        prefix={prefix}
        suffix={suffix}
        addonBefore={addonBefore}
        addonAfter={addonAfter}
        className={baseClasses}
        size={size}
        status={status}
        {...rest}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <AntInput.TextArea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        className={baseClasses}
        size={size}
        status={status}
        {...rest}
      />
    );
  }

  // Default text input
  return (
    <AntInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled}
      readOnly={readOnly}
      prefix={prefix}
      suffix={suffix}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      className={baseClasses}
      size={size}
      status={status}
      {...rest}
    />
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'textarea', 'search', 'tel', 'url']),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  addonBefore: PropTypes.node,
  addonAfter: PropTypes.node,
  size: PropTypes.oneOf(['small', 'middle', 'large']),
  status: PropTypes.oneOf(['error', 'warning']),
};

export default Input;