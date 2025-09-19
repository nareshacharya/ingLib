import React from "react";
import { emptyStateStyles } from "../../styles";

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const Empty: React.FC<EmptyProps> = ({
  title = "No data found",
  description = "There are no items to display",
  icon,
  action,
}) => {
  return (
    <div className={emptyStateStyles.container}>
      {icon && <div className={emptyStateStyles.icon}>{icon}</div>}
      {!icon && (
        <svg
          className={emptyStateStyles.icon}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )}
      <h3 className={emptyStateStyles.title}>{title}</h3>
      <p className={emptyStateStyles.description}>{description}</p>
      {action && action}
    </div>
  );
};
