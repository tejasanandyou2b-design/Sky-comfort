
import React from 'react';
import { ComfortBreakdown } from '../types';

interface BreakdownChartProps {
  breakdown: ComfortBreakdown[];
}

const BreakdownChart: React.FC<BreakdownChartProps> = ({ breakdown }) => {

    const getImpactColor = (impact: 'positive' | 'negative' | 'neutral') => {
        switch (impact) {
            case 'positive': return 'bg-green-500';
            case 'negative': return 'bg-red-500';
            case 'neutral': return 'bg-yellow-500';
        }
    };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-full">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Comfort Factors Breakdown</h3>
      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.factor}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${getImpactColor(item.impact)}`}>{item.impact}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreakdownChart;
