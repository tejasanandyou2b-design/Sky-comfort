import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import ToggleSwitch from './ui/ToggleSwitch';

// CogIcon SVG
const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.95.55.057 1.007.56 1.11.95L12 5.513V5.5a2.25 2.25 0 0 1 2.25 2.25c.305 0 .588.03.864.084a.75.75 0 0 1 .632.996l-.323 1.292a2.25 2.25 0 0 1-2.134 1.603V12a2.25 2.25 0 0 1-2.25-2.25c-.305 0-.588-.03-.864-.084a.75.75 0 0 1-.632-.996l.323-1.292A2.25 2.25 0 0 1 9.594 3.94ZM14.25 9.75a2.25 2.25 0 0 0-2.25-2.25c-.305 0-.588.03-.864.084a.75.75 0 0 0-.632.996l.323 1.292a2.25 2.25 0 0 0 2.134 1.603V12a2.25 2.25 0 0 0 2.25 2.25c.305 0 .588-.03.864-.084a.75.75 0 0 0 .632-.996l-.323-1.292a2.25 2.25 0 0 0-2.134-1.603Z" />
    </svg>
);


const SettingsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  const handleTempToggle = (isFahrenheit: boolean) => {
    updateSettings({ tempUnit: isFahrenheit ? 'F' : 'C' });
  };

  const handleThemeToggle = (isDark: boolean) => {
    updateSettings({ theme: isDark ? 'dark' : 'light' });
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
        <CogIcon />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
        </div>
        <div>
          <div className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-gray-700">
            <span className="font-medium">Temperature Unit</span>
            <div className="flex items-center space-x-2">
                <span className={`transition ${settings.tempUnit === 'C' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>°C</span>
                <ToggleSwitch isChecked={settings.tempUnit === 'F'} onChange={handleTempToggle} />
                <span className={`transition ${settings.tempUnit === 'F' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>°F</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-gray-700">
            <span className="font-medium">Theme</span>
            <div className="flex items-center space-x-2">
                <span className={`transition ${settings.theme === 'light' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>Light</span>
                <ToggleSwitch isChecked={settings.theme === 'dark'} onChange={handleThemeToggle} />
                <span className={`transition ${settings.theme === 'dark' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>Dark</span>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
            <button onClick={() => setIsOpen(false)} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">Done</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;