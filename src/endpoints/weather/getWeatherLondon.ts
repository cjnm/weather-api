import { Handler } from "hono";
import { fetchWeatherData, formatWeatherData } from "../../helpers/weather";
import { generateLocationFact } from "../../helpers/ai";

/**
 * Get weather information for London
 * This endpoint is protected by JWT authentication
 */
export const getWeatherLondon: Handler<{ Bindings: Env }> = async (c) => {
  try {
    // JWT authentication is handled by middleware

    // Fetch weather data using helper
    const apiKey = c.env.OPENWEATHER_API_KEY || "demo";
    let weatherData;

    try {
      weatherData = await fetchWeatherData("London,uk", apiKey);
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to fetch weather data for London" },
        500
      );
    }

    // Generate location fact using AI helper
    const locationFact = await generateLocationFact("London,uk", c.env.AI);

    // Format and return the response
    const formattedWeather = formatWeatherData(weatherData);

    return c.json({
      success: true,
      data: {
        ...formattedWeather,
        fact: locationFact,
      },
    });
  } catch (error) {
    console.error("Error in getWeatherLondon:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
};
