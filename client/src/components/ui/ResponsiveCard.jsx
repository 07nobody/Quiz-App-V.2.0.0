import React from "react";

/**
 * ResponsiveCard - A reusable card component with responsive design
 * Updated to use Tailwind CSS classes
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
  // Use Tailwind classes instead of custom CSS classes
  const cardClasses = [
    "bg-white dark:bg-background-secondary rounded-lg shadow transition-all duration-200",
    bordered ? "border border-gray-200 dark:border-gray-700" : "",
    hoverable ? "hover:shadow-hover" : "",
    "p-4",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={cardClasses} style={style}>
      {(title || extra) && (
        <div className="flex justify-between items-center mb-4">
          {title && (typeof title === 'string' ? 
            <h3 className="text-lg font-bold text-text-primary dark:text-text-primary">{title}</h3> : 
            title)}
          {extra && <div className="flex items-center">{extra}</div>}
        </div>
      )}

      <div className="mb-4">
        {children}
      </div>

      {footer && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
          {footer}
        </div>
      )}
    </div>
  );
}

export default ResponsiveCard;