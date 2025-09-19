import React from "react";
import { loadingStyles } from "../../styles";

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className={loadingStyles.container}>
      <div className={loadingStyles.spinner}></div>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
};
