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

export class WeatherLondonOpenAPI extends OpenAPIRoute {
  schema = {
    tags: ["Weather"],
    summary: "Get weather information for London (Protected)",
    security: [{ bearerAuth: [] }],
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
      },
      "500": {
        description: "Internal server error",
      },
    },
  };

  async handle(request: Request, env: Env, context: any, data: any) {
    // This is just for documentation - actual implementation is in the main app
    return new Response("This endpoint is for documentation only", {
      status: 501,
    });
  }
}
