
import React from 'react';

// Using SVG directly to avoid adding a new dependency
const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-yellow-500 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);


interface StorytellingCardProps {
  story: string;
}

const StorytellingCard: React.FC<StorytellingCardProps> = ({ story }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-full">
      <div className="flex items-center mb-3">
        <SparklesIcon />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">A Word from the Sky</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 italic">"{story}"</p>
    </div>
  );
};

export default StorytellingCard;
