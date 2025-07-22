import { Handler } from "hono";
import { WeatherApiResponse } from "../../types";

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

    // Fetch weather data from OpenWeatherMap API
    const apiKey = c.env.OPENWEATHER_API_KEY || "demo";
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&units=metric&appid=${apiKey}`
    );

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404) {
        return c.json(
          {
            success: false,
            error: `Weather data not found for location: ${location}`,
          },
          404
        );
      }
      return c.json(
        { success: false, error: "Failed to fetch weather data" },
        500
      );
    }

    const weatherData = (await weatherResponse.json()) as WeatherApiResponse;

    // Generate a fact about the location using Cloudflare AI
    let locationFact = null;
    try {
      const ai = c.env.AI;

      if (ai) {
        const { response: fact } = await ai.run("llama-3-8b-instruct-awq", {
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that provides brief, interesting facts about locations.",
            },
            {
              role: "user",
              content: `Share one interesting fact about ${location} in 1-2 sentences.`,
            },
          ],
          max_tokens: 100,
        });

        locationFact = fact.trim();
      }
    } catch (error) {
      console.error("AI fact generation failed:", error);
      // Don't fail the request if AI fact generation fails
    }

    // Return the weather data and location fact
    return c.json({
      success: true,
      data: {
        location: weatherData.name,
        country: weatherData.sys.country,
        weather: {
          description: weatherData.weather[0].description,
          temperature: weatherData.main.temp,
          feels_like: weatherData.main.feels_like,
          humidity: weatherData.main.humidity,
          wind_speed: weatherData.wind.speed,
        },
        fact: locationFact,
      },
    });
  } catch (error) {
    console.error("Error in getWeatherByLocation:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
};
