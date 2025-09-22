
import React, { useState } from 'react';

interface LocationFormProps {
  onSubmit: (location: string, datetime: string) => void;
  isLoading: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({ onSubmit, isLoading }) => {
  const [location, setLocation] = useState<string>('San Francisco');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim() && !isLoading) {
      // Logic for disabled button ensures date and time are either both present or both absent
      const datetime = date && time ? `${date}T${time}` : '';
      onSubmit(location.trim(), datetime);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    // If the date is cleared, the time should also be cleared.
    if (!newDate) {
      setTime('');
    }
  };

  // Set min/max for date input to prevent selecting past dates or dates too far in the future
  const getDateConstraints = () => {
    const now = new Date();
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(now.getDate() + 5);

    // Format for date input (YYYY-MM-DD) using local date parts to avoid timezone issues.
    const toLocalDateString = (date: Date) => {
      const year = date.getFullYear();
      // getMonth() is 0-indexed, so add 1
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
        min: toLocalDateString(now),
        max: toLocalDateString(fiveDaysFromNow)
    };
  }

  const { min, max } = getDateConstraints();
  const isForecastSelectionIncomplete = date && !time;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter a city name..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              disabled={isLoading}
            />
        </div>
        <div className="md:col-span-1">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date (Optional)</label>
            <input
              id="date"
              type="date"
              value={date}
              min={min}
              max={max}
              onChange={handleDateChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              disabled={isLoading}
            />
        </div>
        <div className="md:col-span-1">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition disabled:opacity-50"
              disabled={isLoading || !date}
            />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !location.trim() || isForecastSelectionIncomplete}
          className="md:col-span-1 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 ease-in-out"
          title={isForecastSelectionIncomplete ? "Please select a time to get a forecast" : ""}
        >
          {isLoading ? 'Checking...' : 'Get Report'}
        </button>
      </form>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
        Select a date and time for a future forecast (up to 5 days). Leave blank for current weather. 
        <br/>
        Forecasts are based on the nearest 3-hour data interval.
      </p>
    </div>
  );
};

export default LocationForm;