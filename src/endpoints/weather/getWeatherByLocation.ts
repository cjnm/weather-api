import { Handler } from "hono";
import { fetchWeatherData, formatWeatherData } from "../../helpers/weather";
import { generateLocationFact } from "../../helpers/ai";

/**
 * Get weather information for a specific location
 * Uses OpenWeatherMap API to fetch weather data
 * Also uses Cloudflare AI to generate a fact about the location
 */
export const getWeatherByLocation: Handler<{ Bindings: Env }> = async (c) => {
  try {
    // Get location from URL params
    const location = c.req.param("location");

    if (!location) {
      return c.json({ success: false, error: "Location is required" }, 400);
    }

    // Fetch weather data using helper
    const apiKey = c.env.OPENWEATHER_API_KEY || "demo";
    let weatherData;

    try {
      weatherData = await fetchWeatherData(location, apiKey);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch weather data";
      const statusCode = errorMessage.includes("not found") ? 404 : 500;
      return c.json({ success: false, error: errorMessage }, statusCode);
    }

    // Generate location fact using AI helper
    const locationFact = await generateLocationFact(location, c.env.AI);

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
    console.error("Error in getWeatherByLocation:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
};
