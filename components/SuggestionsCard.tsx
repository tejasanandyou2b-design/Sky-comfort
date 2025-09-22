
import React from 'react';
import { ActivitySuggestion } from '../types';

// SVG for LightBulbIcon
const LightBulbIconComponent = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-blue-500 mt-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.451 0-2.846.311-4.144.868m15.788 0c-1.298-.557-2.693-.868-4.144-.868a7.5 7.5 0 0 0-7.5 0" />
    </svg>
);


interface SuggestionsCardProps {
  suggestions: ActivitySuggestion[];
}

const SuggestionsCard: React.FC<SuggestionsCardProps> = ({ suggestions }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Activity Suggestions</h3>
      <ul className="space-y-4">
        {suggestions.map((item, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0 mr-3">
                <LightBulbIconComponent />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
              <p className="text-gray-600 dark:text-gray-400">{item.suggestion}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionsCard;
