import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import LocationForm from './components/LocationForm';
import Loader from './components/Loader';
import ErrorCard from './components/ErrorCard';
import ThemeToggle from './components/ThemeToggle';
import { ComfortReport, FullWeatherData } from './types';
import { fetchWeatherData } from './services/weatherService';
import { generateComfortReport } from './services/geminiService';
import { SettingsProvider } from './contexts/SettingsContext';

const App: React.FC = () => {
  const [fullWeatherData, setFullWeatherData] = useState<FullWeatherData | null>(null);
  const [comfortReport, setComfortReport] = useState<ComfortReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<{ location: string; date: string; time: string } | null>(null);

  const handleLocationSubmit = useCallback(async (location: string, datetime: string) => {
    setIsLoading(true);
    setError(null);
    setFullWeatherData(null);
    setComfortReport(null);
    setLocationInfo(null);

    try {
      // Step 1: Fetch weather data (current or for a specific future time)
      const weather = await fetchWeatherData(location, datetime);
      setFullWeatherData(weather);

      if (datetime) {
        const [date, time] = datetime.split('T');
        setLocationInfo({ location, date, time });
      } else {
        setLocationInfo({ location, date: weather.current.date, time: weather.current.time });
      }
      
      // Step 2: Generate AI comfort report based on the fetched conditions
      const report = await generateComfortReport(weather.current);
      setComfortReport(report);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SettingsProvider>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-md border-b border-gray-200 dark:border-gray-700/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-center items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.5 4.5 0 0 0 2.25 15Z" />
             </svg>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Sky Comfort AI</h1>
              <p className="text-center text-gray-600 dark:text-gray-400 mt-1">Your personal AI-powered weather comfort analyst</p>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <LocationForm onSubmit={handleLocationSubmit} isLoading={isLoading} />

          <div className="mt-8">
            {isLoading && <Loader />}
            {error && <ErrorCard message={error} />}
            {comfortReport && fullWeatherData && locationInfo && !isLoading && !error && (
              <Dashboard 
                report={comfortReport} 
                fullWeatherData={fullWeatherData}
                locationInfo={locationInfo}
              />
            )}
            {!isLoading && !error && !comfortReport && (
                 <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <p className="text-xl text-gray-600 dark:text-gray-300">Enter a location to get started!</p>
                 </div>
            )}
          </div>
        </main>
        <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by Google Gemini & OpenWeatherMap</p>
        </footer>
        <ThemeToggle />
      </div>
    </SettingsProvider>
  );
};

export default App;