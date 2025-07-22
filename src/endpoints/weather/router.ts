import { Hono } from "hono";
import { getWeatherByLocation } from "./getWeatherByLocation";
import { getWeatherLondon } from "./getWeatherLondon";
import { jwtAuth } from "../../middleware/jwtAuth";

// Create a router for weather endpoints
export const weatherRouter = new Hono<{ Bindings: Env }>();

// IMPORTANT: Protected endpoint must come BEFORE the dynamic route
// Protected endpoint - Get weather in London (requires JWT)
weatherRouter.get("/london", jwtAuth(), getWeatherLondon);

// Public endpoint - Get weather by location (this catches all other locations)
weatherRouter.get("/:location", getWeatherByLocation);
