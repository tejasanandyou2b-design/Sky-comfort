import React from 'react';
import { ComfortReport, FullWeatherData } from '../types';
import ComfortIndexCard from './ComfortIndexCard';
import StorytellingCard from './StorytellingCard';
import SuggestionsCard from './SuggestionsCard';
import BreakdownChart from './BreakdownChart';
import AtmosphericConditions from './AtmosphericConditions';
import ForecastTrends from './ForecastTrends';
import ActivityPanel from './ActivityPanel';
import SettingsModal from './SettingsModal';


interface DashboardProps {
  report: ComfortReport;
  fullWeatherData: FullWeatherData;
  locationInfo: { location: string; date: string; time: string; };
}

const Dashboard: React.FC<DashboardProps> = ({ report, fullWeatherData, locationInfo }) => {
    const reportTimestamp = new Date(`${locationInfo.date}T${locationInfo.time}`).getTime();
    // Check if the report time is more than 10 minutes in the future to account for small delays
    const isFutureForecast = reportTimestamp > Date.now() + 10 * 60 * 1000;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
            <h2 className="text-2xl font-bold">
                {isFutureForecast ? 'Forecast for' : 'Current Report for'} {locationInfo.location}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
                {isFutureForecast ? 'Prediction for' : 'Generated for'} {new Date(reportTimestamp).toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
            </p>
        </div>
        <SettingsModal />
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ComfortIndexCard comfortIndex={report.comfortIndex} />
          <StorytellingCard story={report.story} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <AtmosphericConditions weatherData={fullWeatherData.current} />
          <SuggestionsCard suggestions={report.suggestions} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
         <div className="lg:col-span-3">
            <BreakdownChart breakdown={report.breakdown} />
         </div>
         <div className="lg:col-span-2">
            <ActivityPanel suggestions={report.suggestions} />
         </div>
      </div>
      
      <ForecastTrends fullWeatherData={fullWeatherData} />
    </div>
  );
};

export default Dashboard;