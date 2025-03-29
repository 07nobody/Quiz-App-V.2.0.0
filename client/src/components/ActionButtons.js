import React from "react";
import { Space } from "antd";

/**
 * ActionButtons - A reusable component for consistent action button layouts
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode[]} props.children - Button elements to display
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.align - Alignment ('left', 'center', 'right', 'space-between')
 * @param {string} props.size - Size of the gap between buttons ('small', 'medium', 'large')
 * @param {boolean} props.responsive - Whether to stack buttons vertically on mobile
 */
function ActionButtons({ 
  children, 
  className = "", 
  align = "right",
  size = "middle",
  responsive = true 
}) {
  const containerClasses = [
    "action-buttons",
    `align-${align}`,
    responsive ? "responsive" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      <Space size={size} wrap={responsive}>
        {children}
      </Space>
    </div>
  );
}

export default ActionButtons;