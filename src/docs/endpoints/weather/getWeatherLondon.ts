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
    message: z.string(),
  }),
});

const ErrorResponseSchema = z.object({
  success: z.boolean(),
  error: z.string(),
});

export class WeatherLondonOpenAPI extends OpenAPIRoute {
  schema: any = {
    tags: ["Weather"],
    summary: "Get weather information for London (Protected)",
    description:
      "Get current weather information for London, UK. This endpoint requires JWT authentication obtained from the login endpoint.",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "Authorization",
        in: "header",
        required: true,
        schema: {
          type: "string",
          example: "Bearer YOUR_JWT_TOKEN",
        },
      },
    ],
    responses: {
      "200": {
        description: "London weather information retrieved successfully",
        content: {
          "application/json": {
            schema: WeatherResponseSchema,
          },
        },
      },
      "401": {
        description: "Unauthorized - Invalid or missing JWT token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      "500": {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  };
}
