import { WeatherApiResponse } from "../types";

/**
 * Fetch weather data from OpenWeatherMap API
 * @param location - The location to get weather for
 * @param apiKey - OpenWeatherMap API key
 * @returns Weather data or throws error
 */
export async function fetchWeatherData(
  location: string,
  apiKey: string
): Promise<WeatherApiResponse> {
  const weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&units=metric&appid=${apiKey}`
  );

  if (!weatherResponse.ok) {
    if (weatherResponse.status === 404) {
      throw new Error(`Weather data not found for location: ${location}`);
    }
    throw new Error("Failed to fetch weather data");
  }

  return (await weatherResponse.json()) as WeatherApiResponse;
}

/**
 * Format weather data into a consistent response format
 * @param weatherData - Raw weather data from OpenWeatherMap API
 * @returns Formatted weather object
 */
export function formatWeatherData(weatherData: WeatherApiResponse) {
  return {
    location: weatherData.name,
    country: weatherData.sys.country,
    weather: {
      description: weatherData.weather[0].description,
      temperature: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      wind_speed: weatherData.wind.speed,
    },
  };
}
