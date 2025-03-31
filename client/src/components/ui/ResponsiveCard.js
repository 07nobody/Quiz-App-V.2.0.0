import React from "react";

/**
 * ResponsiveCard - A reusable card component with responsive design
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.title - Card title content
 * @param {React.ReactNode} props.extra - Extra content for the header (usually actions)
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.bordered - Whether to show border
 * @param {boolean} props.hoverable - Whether to apply hover effect
 * @param {Object} props.style - Additional inline styles
 */
function ResponsiveCard({ 
  title, 
  extra, 
  children, 
  footer,
  className = "",
  bordered = true,
  hoverable = true,
  style = {}
}) {
  const cardClasses = [
    "responsive-card",
    bordered ? "card-bordered" : "",
    hoverable ? "card-hoverable" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={cardClasses} style={style}>
      {(title || extra) && (
        <div className="card-header">
          {title && (typeof title === 'string' ? <h3>{title}</h3> : title)}
          {extra && <div className="card-extra">{extra}</div>}
        </div>
      )}

      <div className="card-body">
        {children}
      </div>

      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export default ResponsiveCard;