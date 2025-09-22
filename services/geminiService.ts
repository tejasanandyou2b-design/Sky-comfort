import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, ComfortReport } from '../types';

// The API key is sourced from the environment variable `process.env.API_KEY`.
// It is assumed to be pre-configured and available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    comfortIndex: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "A comfort score from 1 (very uncomfortable) to 10 (perfectly comfortable)." },
        rating: { type: Type.STRING, description: "A short descriptive rating, e.g., 'Very Comfortable', 'Slightly Humid'." },
        summary: { type: Type.STRING, description: "A one-sentence summary of the overall feeling." }
      },
      required: ["score", "rating", "summary"]
    },
    story: {
      type: Type.STRING,
      description: "A short, imaginative, and friendly story (2-3 sentences) that personifies the weather, as if the sky is telling a story to the user. E.g., 'The sun is playing hide and seek with the clouds today, peeking out to warm your face before ducking back behind a fluffy white curtain.'"
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the suggested activity, e.g., 'Evening Stroll', 'Indoor Reading'." },
          suggestion: { type: Type.STRING, description: "A brief explanation of why this activity is suitable for the current weather." },
        },
        required: ["name", "suggestion"]
      },
      description: "An array of 2-3 activity suggestions tailored to the weather."
    },
    breakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          factor: { type: Type.STRING, description: "The weather factor, e.g., 'Temperature', 'Humidity', 'Wind'." },
          impact: { type: Type.STRING, enum: ["positive", "negative", "neutral"], description: "The impact on comfort: 'positive', 'negative', or 'neutral'." },
          comment: { type: Type.STRING, description: "A brief comment on why this factor has that impact." },
        },
        required: ["factor", "impact", "comment"]
      },
      description: "A breakdown of how different weather factors contribute to the comfort index."
    }
  },
  required: ["comfortIndex", "story", "suggestions", "breakdown"]
};


export const generateComfortReport = async (weatherData: WeatherData): Promise<ComfortReport> => {
  // Check if the weather data is for a future time to adjust the prompt
  const reportTimestamp = new Date(`${weatherData.date}T${weatherData.time}`).getTime();
  const isFuture = reportTimestamp > Date.now();
  
  const promptPreamble = isFuture 
    ? `Analyze the following predicted weather data` 
    : `Analyze the following weather data`;

  const prompt = `
    ${promptPreamble} for ${weatherData.location} on ${weatherData.date} at ${weatherData.time}
    and generate a "Sky Comfort Report". The user wants to know how comfortable it will feel outside.
    
    Weather Data:
    - Temperature: ${weatherData.temperature}°C
    - Apparent Temperature: ${weatherData.apparentTemperature}°C
    - Humidity: ${weatherData.humidity}%
    - Wind Speed: ${weatherData.windSpeed} km/h
    - Condition: ${weatherData.condition}
    - Air Quality Index: ${weatherData.airQualityIndex}
    - Chance of Precipitation: ${weatherData.precipitationChance}%

    Based on this data, generate a JSON response that adheres to the provided schema.
    The tone should be friendly, reassuring, and slightly whimsical.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonString = result.text;
    const report: ComfortReport = JSON.parse(jsonString);
    return report;
  } catch (error) {
    console.error("Error generating comfort report from Gemini:", error);
    throw new Error("Failed to get insights from AI. The model may be busy or the API key may be invalid. Please try again later.");
  }
};