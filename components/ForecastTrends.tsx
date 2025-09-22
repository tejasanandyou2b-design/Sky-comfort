import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FullWeatherData } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface ForecastTrendsProps {
  fullWeatherData: FullWeatherData;
}

type Metric = 'temperature' | 'precipitation';

const ForecastTrends: React.FC<ForecastTrendsProps> = ({ fullWeatherData }) => {
  const { daily: forecast, hourly } = fullWeatherData;
  const [activeMetric, setActiveMetric] = useState<Metric>('temperature');
  const [view, setView] = useState<'daily' | 'hourly'>('daily');
  const { settings } = useSettings();

  const convertTemp = (celsius: number) => {
    if (settings.tempUnit === 'F') {
        return Math.round(celsius * 9/5 + 32);
    }
    return Math.round(celsius);
  };

  const dailyChartData = forecast.map(day => ({
    name: new Date(day.date * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' }),
    temperature: convertTemp(day.temp.max),
    precipitation: Math.round(day.pop * 100), // convert to percentage
  }));
  
  const metricsConfig = {
    temperature: { name: 'Temperature', color: '#ef4444', unit: `°${settings.tempUnit}` },
    precipitation: { name: 'Precipitation', color: '#3b82f6', unit: '%' },
  };

  const selectedMetric = metricsConfig[activeMetric];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg text-gray-800 dark:text-gray-200">
          <p className="font-bold">{label}</p>
          <p style={{ color: selectedMetric.color }}>
            {`${selectedMetric.name}: ${payload[0].value}${selectedMetric.unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {view === 'daily' ? '5-Day Forecast' : 'Next 24 Hours'}
        </h3>
        <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <button 
                    onClick={() => setView('daily')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'daily' ? 'bg-white dark:bg-gray-900 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                    Daily
                </button>
                <button 
                    onClick={() => setView('hourly')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === 'hourly' ? 'bg-white dark:bg-gray-900 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                    Hourly
                </button>
            </div>
             {/* Metric Toggle (only for daily view) */}
            {view === 'daily' && (
                <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {(Object.keys(metricsConfig) as Metric[]).map(metric => (
                        <button 
                            key={metric}
                            onClick={() => setActiveMetric(metric)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeMetric === metric ? 'bg-white dark:bg-gray-900 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                        >
                            {metricsConfig[metric].name}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
      {view === 'daily' ? (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
            <LineChart
                data={dailyChartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.2} />
                <XAxis dataKey="name" stroke="currentColor" />
                <YAxis stroke="currentColor" unit={selectedMetric.unit} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                type="monotone"
                dataKey={activeMetric}
                name={selectedMetric.name}
                stroke={selectedMetric.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
            {hourly.map((hour, index) => {
                const date = new Date(hour.timestamp * 1000);
                const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

                return (
                    <div key={index} className="flex-shrink-0 w-24 text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex flex-col items-center justify-between min-h-[140px]">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{timeString}</p>
                        <img 
                            src={`https://openweathermap.org/img/wn/${hour.conditionIcon}@2x.png`} 
                            alt="weather icon" 
                            className="w-12 h-12 mx-auto"
                        />
                        <div className='mt-auto'>
                            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{convertTemp(hour.temp)}°</p>
                            {hour.pop > 0.1 && (
                                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                                    💧 {Math.round(hour.pop * 100)}%
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      )}
    </div>
  );
};

export default ForecastTrends;