export interface WeatherData {
  location: string;
  date: string; // This will represent the current date of the fetch
  time: string; // This will represent the current time of the fetch
  temperature: number; // in Celsius
  apparentTemperature: number; // in Celsius
  humidity: number; // in percent
  windSpeed: number; // in km/h
  windDirection: string;
  precipitationChance: number; // Sourced from hourly pop for the current hour
  cloudCover: number; // in percent
  uvIndex: number;
  airQualityIndex: number; // This will be a placeholder as OneCall API v3 doesn't provide it directly
  condition: string; // e.g., 'Sunny', 'Cloudy'
  conditionIcon: string; // e.g., '01d'
}

export interface DailyForecast {
    date: number; // timestamp
    temp: {
        min: number; // in Celsius
        max: number; // in Celsius
    };
    uvi: number;
    pop: number; // probability of precipitation (0-1)
    condition: string;
    conditionIcon: string;
}

export interface HourlyForecast {
  timestamp: number;
  temp: number;
  pop: number;
  conditionIcon: string;
}

export interface FullWeatherData {
    current: WeatherData;
    daily: DailyForecast[];
    hourly: HourlyForecast[];
}


export interface ComfortIndex {
  score: number; // 1-10
  rating: string; // e.g., 'Very Comfortable', 'Slightly Uncomfortable'
  summary: string;
}

export interface ActivitySuggestion {
  name: string;
  suggestion: string;
  icon?: string; // e.g., 'hiking', 'reading'
}

export interface ComfortBreakdown {
  factor: string; // e.g., 'Temperature', 'Humidity'
  impact: 'positive' | 'negative' | 'neutral';
  comment: string;
}

export interface ComfortReport {
  comfortIndex: ComfortIndex;
  story: string;
  suggestions: ActivitySuggestion[];
  breakdown: ComfortBreakdown[];
}

export interface Settings {
    theme: 'light' | 'dark';
    tempUnit: 'C' | 'F';
}

export interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
}