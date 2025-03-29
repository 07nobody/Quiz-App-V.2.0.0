import React from "react";

/**
 * InfoItem - A reusable component for displaying label-value pairs
 * 
 * @param {Object} props - Component props
 * @param {string|React.ReactNode} props.label - The label text
 * @param {string|React.ReactNode} props.value - The value to display
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {string} props.className - Additional CSS classes
 */
function InfoItem({ label, value, icon, className = "" }) {
  const classes = ["info-item", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {icon && <span className="info-icon">{icon}</span>}
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

export default InfoItem;