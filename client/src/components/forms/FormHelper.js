import React, { useEffect } from 'react';
import { Form } from 'antd';

/**
 * FormHelper - A wrapper component to fix Ant Design Form warnings
 * 
 * This component ensures that any Form.Item components used without a parent Form
 * will be properly wrapped in a Form component to avoid warnings.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.name - Optional form name for debugging
 * @param {Object} props.formProps - Additional props to pass to the Form component
 * @returns {React.ReactElement} - Rendered component
 */
function FormHelper({ children, name = 'formHelper', formProps = {} }) {
  // More robust detection of Form.Item components
  const hasFormItems = React.Children.toArray(children).some(child => {
    // Check for Form.Item directly
    if (child?.type === Form.Item || child?.type?.displayName === 'FormItem' || 
        child?.type?.name === 'FormItem' || child?.type?.displayName?.includes('Form.Item')) {
      return true;
    }
    
    // Try to check for nested Form.Item components
    if (child?.props?.children) {
      const nestedChildren = Array.isArray(child.props.children) 
        ? child.props.children 
        : [child.props.children];
      
      return nestedChildren.some(nestedChild => 
        nestedChild?.type === Form.Item || 
        nestedChild?.type?.displayName === 'FormItem' ||
        nestedChild?.type?.name === 'FormItem'
      );
    }
    
    return false;
  });
  
  // Only create form instance if needed
  const [form] = hasFormItems ? Form.useForm() : [null];
  
  // Add effect to properly destroy the form instance when the component unmounts
  useEffect(() => {
    return () => {
      // Safely cleanup form when component unmounts
      if (form && typeof form.destroy === 'function') {
        form.destroy();
      }
    };
  }, [form]);
  
  // If we don't need a Form, just return the children directly
  if (!hasFormItems) {
    return <>{children}</>;
  }
  
  return (
    <Form 
      form={form} 
      component="div" 
      name={name}
      // Default form behavior settings
      autoComplete="off"
      validateTrigger={[]}
      // Allow user to override with custom props
      {...formProps}
    >
      {children}
    </Form>
  );
}

export default FormHelper;