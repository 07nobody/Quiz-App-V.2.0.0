import React from 'react';
import { Button, Space } from 'antd';
import { useMessage } from './MessageProvider';

/**
 * Example component demonstrating how to use the optimized message API
 * 
 * This shows how to replace direct imports of message from 'antd'
 * with the useMessage hook from our custom MessageProvider
 */
const MessageUsageExample = () => {
  // Use our custom hook instead of importing from antd directly
  const message = useMessage();

  const showSuccess = () => {
    message.success('This is a success message');
  };

  const showError = () => {
    message.error('This is an error message');
  };

  const showWarning = () => {
    message.warning('This is a warning message');
  };

  const showInfo = () => {
    message.info('This is an information message');
  };

  const showLoading = () => {
    const hide = message.loading('Action in progress...', 0);
    // Dismiss the loading message after 2.5 seconds
    setTimeout(hide, 2500);
  };

  return (
    <Space direction="vertical">
      <h3>Message Examples</h3>
      <Space>
        <Button type="primary" onClick={showSuccess}>Success</Button>
        <Button danger onClick={showError}>Error</Button>
        <Button type="dashed" onClick={showWarning}>Warning</Button>
        <Button onClick={showInfo}>Info</Button>
        <Button type="default" onClick={showLoading}>Loading</Button>
      </Space>
      <p>
        Note: Replace direct imports of message from 'antd' with useMessage() in your components
        to benefit from the performance optimizations.
      </p>
    </Space>
  );
};

export default MessageUsageExample;