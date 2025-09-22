import React from 'react';
import { WeatherData } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface AtmosphericConditionsProps {
  weatherData: WeatherData;
}

const AtmosphericConditions: React.FC<AtmosphericConditionsProps> = ({ weatherData }) => {
    const { settings } = useSettings();

    const convertTemp = (celsius: number) => {
        if (settings.tempUnit === 'F') {
            return Math.round(celsius * 9/5 + 32);
        }
        return Math.round(celsius);
    };

    const getAqiInfo = (aqi: number) => {
        switch (aqi) {
            case 1: return { label: 'Good', icon: '😊', color: 'text-green-500' };
            case 2: return { label: 'Fair', icon: '🙂', color: 'text-yellow-500' };
            case 3: return { label: 'Moderate', icon: '😐', color: 'text-orange-500' };
            case 4: return { label: 'Poor', icon: '😟', color: 'text-red-500' };
            case 5: return { label: 'Very Poor', icon: '😷', color: 'text-purple-500' };
            default: return { label: 'N/A', icon: '🤷', color: 'text-gray-500' };
        }
    };

    const aqiInfo = getAqiInfo(weatherData.airQualityIndex);

    const conditionItems = [
        { label: 'Temperature', value: `${convertTemp(weatherData.temperature)}°${settings.tempUnit}`, icon: '🌡️' },
        { label: 'Feels Like', value: `${convertTemp(weatherData.apparentTemperature)}°${settings.tempUnit}`, icon: '🤔' },
        { label: 'Humidity', value: `${weatherData.humidity}%`, icon: '💧' },
        { label: 'Wind', value: `${Math.round(weatherData.windSpeed)} km/h ${weatherData.windDirection}`, icon: '💨' },
        { label: 'Cloud Cover', value: `${weatherData.cloudCover}%`, icon: '☁️' },
    ];
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Current Conditions</h3>
       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {conditionItems.map((item) => (
            <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center">
                <span className="text-2xl mr-3">{item.icon}</span>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-lg">{item.value}</p>
                </div>
            </div>
        ))}
        {weatherData.airQualityIndex > 0 && (
             <div key="Air Quality" className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center">
                <span className="text-2xl mr-3">{aqiInfo.icon}</span>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Air Quality</p>
                    <p className={`font-bold ${aqiInfo.color} text-lg`}>{aqiInfo.label}</p>
                </div>
            </div>
        )}
       </div>
    </div>
  );
};

export default AtmosphericConditions;