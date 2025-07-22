import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

const WeatherResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    location: z.string(),
    country: z.string(),
    weather: z.object({
      description: z.string(),
      temperature: z.number(),
      feels_like: z.number(),
      humidity: z.number(),
      wind_speed: z.number(),
    }),
    fact: z.string().nullable(),
  }),
});

export class WeatherLocationOpenAPI extends OpenAPIRoute {
  schema: any = {
    tags: ["Weather"],
    summary: "Get weather information for a specific location",
    parameters: [
      {
        name: "location",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
        description: "The location to get weather for",
      },
    ],
    responses: {
      "200": {
        description: "Weather information retrieved successfully",
        content: {
          "application/json": {
            schema: WeatherResponseSchema,
          },
        },
      },
      "404": {
        description: "Weather data not found for location",
      },
      "500": {
        description: "Internal server error",
      },
    },
  };
}
