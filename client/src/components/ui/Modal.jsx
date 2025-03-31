import React from 'react';
import PropTypes from 'prop-types';
import { Modal as AntModal } from 'antd';
import Button from './Button';

/**
 * Modal Component
 * A consistent modal component that wraps Ant Design's Modal with our styling
 */
const Modal = ({
  title,
  open,
  onOk,
  onCancel,
  children,
  okText = 'OK',
  cancelText = 'Cancel',
  width = 520,
  centered = true,
  footer,
  confirmLoading = false,
  maskClosable = true,
  className = '',
  destroyOnClose = true,
  okButtonProps = {},
  cancelButtonProps = {},
}) => {
  // Custom footer with our Button component if not explicitly provided
  const customFooter = footer === undefined ? (
    <>
      <Button
        onClick={onCancel}
        variant="outline"
        {...cancelButtonProps}
      >
        {cancelText}
      </Button>
      <Button
        onClick={onOk}
        loading={confirmLoading}
        {...okButtonProps}
      >
        {okText}
      </Button>
    </>
  ) : footer;

  return (
    <AntModal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      width={width}
      centered={centered}
      footer={customFooter}
      confirmLoading={confirmLoading}
      maskClosable={maskClosable}
      className={`quiz-app-modal ${className}`}
      destroyOnClose={destroyOnClose}
    >
      {children}
    </AntModal>
  );
};

Modal.propTypes = {
  title: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  children: PropTypes.node,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  centered: PropTypes.bool,
  footer: PropTypes.node,
  confirmLoading: PropTypes.bool,
  maskClosable: PropTypes.bool,
  className: PropTypes.string,
  destroyOnClose: PropTypes.bool,
  okButtonProps: PropTypes.object,
  cancelButtonProps: PropTypes.object,
};

export default Modal;