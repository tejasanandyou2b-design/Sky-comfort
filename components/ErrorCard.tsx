
import React from 'react';

interface ErrorCardProps {
  message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  return (
    <div className="p-6 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 rounded-lg shadow-md">
      <div className="flex">
        <div className="py-1">
          <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold text-red-800 dark:text-red-200">Something went wrong</p>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;
