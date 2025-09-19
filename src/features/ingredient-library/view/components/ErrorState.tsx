import React from "react";
import { errorStyles } from "../../styles";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "There was an error loading the data. Please try again.",
  onRetry,
}) => {
  return (
    <div className={errorStyles.container}>
      <svg
        className={errorStyles.icon}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <h3 className={errorStyles.title}>{title}</h3>
      <p className={errorStyles.description}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={errorStyles.button}>
          Try again
        </button>
      )}
    </div>
  );
};
