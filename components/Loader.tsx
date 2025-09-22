
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Forecasting your comfort...</p>
    </div>
  );
};

export default Loader;
