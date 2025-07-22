import { Hono } from "hono";
import { getWeatherByLocation } from "./getWeatherByLocation";
import { getWeatherLondon } from "./getWeatherLondon";
import { jwtAuth } from "../../middleware/jwtAuth";

// Create a router for weather endpoints
export const weatherRouter = new Hono<{ Bindings: Env }>();
const app = new Hono<{ Bindings: Env }>();

// Apply JWT middleware to the London endpoint
app.use("/london", jwtAuth());

// Public endpoint - Get weather by location
weatherRouter.get("/:location", getWeatherByLocation);

// Protected endpoint - Get weather in London (requires JWT)
weatherRouter.get("/london", getWeatherLondon);
