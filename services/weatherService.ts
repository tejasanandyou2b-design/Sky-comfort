import { FullWeatherData, WeatherData, DailyForecast, HourlyForecast } from '../types';

// WARNING: Storing API keys directly in the code is not recommended for production.
// It's better to use environment variables to keep them secure.
// To use this application, you need to get your own free API key from OpenWeatherMap.
// 1. Go to https://openweathermap.org/ and create an account.
// 2. Find your API key in your account settings.
// 3. Replace 'YOUR_API_KEY_HERE' with your actual key.
const OPENWEATHER_API_KEY: string = 'ca77c5751b8982dba2d2f1c68a5049ca';

const getCoordinates = async (location: string): Promise<{ lat: number; lon: number }> => {
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    
    const response = await fetch(geocodingUrl);
    
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Failed to fetch coordinates. The OpenWeatherMap API key is invalid or disabled. Please check the key in `services/weatherService.ts`.');
        }
        throw new Error(`Failed to fetch coordinates for the location. OpenWeatherMap returned status ${response.status}.`);
    }

    const data = await response.json();
    if (data.length === 0) {
        throw new Error(`Location "${location}" not found. Please check the spelling and try again.`);
    }
    return { lat: data[0].lat, lon: data[0].lon };
};

const mpsToKmh = (mps: number) => mps * 3.6;

const degreesToCardinal = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
};

const mapForecastToCurrent = (forecastItem: any, location: string, aqi: number): WeatherData => {
    const date = new Date(forecastItem.dt * 1000);
    return {
        location: location,
        date: date.toISOString().split('T')[0],
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        temperature: forecastItem.main.temp,
        apparentTemperature: forecastItem.main.feels_like,
        humidity: forecastItem.main.humidity,
        windSpeed: mpsToKmh(forecastItem.wind.speed),
        windDirection: degreesToCardinal(forecastItem.wind.deg),
        precipitationChance: forecastItem.pop ? forecastItem.pop * 100 : 0,
        cloudCover: forecastItem.clouds.all,
        uvIndex: 0,
        airQualityIndex: aqi,
        condition: forecastItem.weather[0]?.main || 'Unknown',
        conditionIcon: forecastItem.weather[0]?.icon || '01d',
    };
};

export const fetchWeatherData = async (location: string, datetime?: string): Promise<FullWeatherData> => {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error("The OpenWeatherMap API key is missing. Please get a free key from openweathermap.org and add it to `services/weatherService.ts`.");
    }

    const { lat, lon } = await getCoordinates(location);
    
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;

    const [forecastResponse, airPollutionResponse] = await Promise.all([
        fetch(forecastUrl),
        fetch(airPollutionUrl)
    ]);
    
    if (!forecastResponse.ok) {
        throw new Error(`Failed to fetch forecast data from OpenWeatherMap. Status: ${forecastResponse.status}.`);
    }

    if (!airPollutionResponse.ok) {
        console.warn(`Failed to fetch air quality data. Status: ${airPollutionResponse.status}`);
    }

    const forecastData = await forecastResponse.json();
    const airPollutionData = airPollutionResponse.ok ? await airPollutionResponse.json() : null;
    const airQualityIndex = airPollutionData?.list?.[0]?.main?.aqi || 0;

    let current: WeatherData;

    if (datetime) {
        // Find the forecast closest to the selected datetime
        const targetTime = new Date(datetime).getTime() / 1000;
        const closestForecast = forecastData.list.reduce((prev: any, curr: any) => 
            Math.abs(curr.dt - targetTime) < Math.abs(prev.dt - targetTime) ? curr : prev
        );
        current = mapForecastToCurrent(closestForecast, location, airQualityIndex);
    } else {
        // Fetch current weather for the default case
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        if (!currentWeatherResponse.ok) {
             if (currentWeatherResponse.status === 401) {
                throw new Error('Failed to fetch current weather. The OpenWeatherMap API key is invalid or disabled.');
            }
            throw new Error(`Failed to fetch current weather. Status: ${currentWeatherResponse.status}.`);
        }
        const currentWeatherData = await currentWeatherResponse.json();
        const now = new Date(currentWeatherData.dt * 1000);

        current = {
            location: location,
            date: now.toISOString().split('T')[0],
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            temperature: currentWeatherData.main.temp,
            apparentTemperature: currentWeatherData.main.feels_like,
            humidity: currentWeatherData.main.humidity,
            windSpeed: mpsToKmh(currentWeatherData.wind.speed),
            windDirection: degreesToCardinal(currentWeatherData.wind.deg),
            precipitationChance: forecastData.list[0]?.pop ? forecastData.list[0].pop * 100 : 0,
            cloudCover: currentWeatherData.clouds.all,
            uvIndex: 0,
            airQualityIndex: airQualityIndex,
            condition: currentWeatherData.weather[0]?.main || 'Unknown',
            conditionIcon: currentWeatherData.weather[0]?.icon || '01d',
        };
    }

    const hourly: HourlyForecast[] = forecastData.list.slice(0, 8).map((item: any) => ({
        timestamp: item.dt,
        temp: item.main.temp,
        pop: item.pop,
        conditionIcon: item.weather[0]?.icon || '01d',
    }));

    const dailyForecasts: { [key: string]: any[] } = {};
    forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
    });

    const daily: DailyForecast[] = Object.keys(dailyForecasts).slice(0, 5).map(dateStr => {
        const dayData = dailyForecasts[dateStr];
        const temps = dayData.map(d => d.main.temp);
        const pops = dayData.map(d => d.pop);
        const midday_data = dayData.find(d => new Date(d.dt * 1000).getUTCHours() >= 12 && new Date(d.dt * 1000).getUTCHours() < 15) || dayData[Math.floor(dayData.length / 2)];

        return {
            date: new Date(dateStr).getTime() / 1000,
            temp: {
                min: Math.min(...temps),
                max: Math.max(...temps),
            },
            uvi: 0,
            pop: Math.max(...pops),
            condition: midday_data.weather[0]?.main || 'Unknown',
            conditionIcon: midday_data.weather[0]?.icon || '01d',
        };
    });

    return { current, daily, hourly };
};