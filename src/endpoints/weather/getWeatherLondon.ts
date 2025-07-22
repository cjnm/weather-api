import { Handler } from "hono";
import { ApiException } from "chanfana";
import { WeatherApiResponse } from "../../types";

/**
 * Get weather information for London
 * This endpoint is protected by JWT authentication
 */
export const getWeatherLondon: Handler<{ Bindings: Env }> = async (c) => {
  try {
    // Fetch weather data from OpenWeatherMap API
    const apiKey = c.env.OPENWEATHER_API_KEY || "demo"; // Fallback to demo key
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London,uk&units=metric&appid=${apiKey}`
    );

    if (!weatherResponse.ok) {
      throw new ApiException("Failed to fetch weather data for London");
    }

    const weatherData = (await weatherResponse.json()) as WeatherApiResponse;

    // Return the weather data
    return c.json({
      success: true,
      data: {
        location: "London",
        country: "GB",
        weather: {
          description: weatherData.weather[0].description,
          temperature: weatherData.main.temp,
          feels_like: weatherData.main.feels_like,
          humidity: weatherData.main.humidity,
          wind_speed: weatherData.wind.speed,
        },
        message:
          "This is a protected endpoint that requires JWT authentication",
      },
    });
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    console.error("Error in getWeatherLondon:", error);
    throw new ApiException("Internal server error");
  }
};
