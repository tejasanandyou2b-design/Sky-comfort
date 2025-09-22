
import React from 'react';
import { ComfortIndex } from '../types';

interface ComfortIndexCardProps {
  comfortIndex: ComfortIndex;
}

const ComfortIndexCard: React.FC<ComfortIndexCardProps> = ({ comfortIndex }) => {
    const getRingColor = (score: number) => {
        if (score >= 8) return 'text-green-500';
        if (score >= 5) return 'text-yellow-500';
        return 'text-red-500';
    };

    const ringColor = getRingColor(comfortIndex.score);
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (comfortIndex.score / 10) * circumference;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Comfort Index</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">How it feels outside</p>
      </div>
      <div className="relative flex items-center justify-center my-6">
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="15" className="text-gray-200 dark:text-gray-700" fill="transparent"/>
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="15"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`${ringColor} transition-all duration-1000 ease-in-out`}
            />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${ringColor}`}>{comfortIndex.score}</span>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">/ 10</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{comfortIndex.rating}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{comfortIndex.summary}</p>
      </div>
    </div>
  );
};

export default ComfortIndexCard;
