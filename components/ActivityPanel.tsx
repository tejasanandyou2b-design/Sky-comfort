
import React from 'react';
import { ActivitySuggestion } from '../types';

interface ActivityPanelProps {
  suggestions: ActivitySuggestion[];
}

const iconMap: { [key: string]: string } = {
    'stroll': '🚶',
    'walk': '🚶',
    'reading': '📚',
    'indoor': '🏠',
    'picnic': '🧺',
    'coffee': '☕',
    'museum': '🏛️',
    'movie': '🎬',
    'hiking': '🥾',
    'running': '🏃',
    'gardening': '🌱',
    'default': '💡',
}

const getActivityIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    for (const key in iconMap) {
        if (lowerName.includes(key)) {
            return iconMap[key];
        }
    }
    return iconMap['default'];
};

const ActivityPanel: React.FC<ActivityPanelProps> = ({ suggestions }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-full">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Things to Do</h3>
      <div className="space-y-4">
        {suggestions.map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center">
            <span className="text-3xl mr-4">{getActivityIcon(item.name)}</span>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPanel;
