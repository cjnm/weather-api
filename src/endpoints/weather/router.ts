import { fromHono } from "chanfana";
import { Hono } from "hono";
import { getWeatherByLocation } from "./getWeatherByLocation";
import { getWeatherLondon } from "./getWeatherLondon";
import { jwtAuth } from "../../middleware/jwtAuth";

// Create a router for weather endpoints
const app = new Hono<{ Bindings: Env }>();

// Apply JWT middleware to the London endpoint
app.use("/london", jwtAuth());

export const weatherRouter = fromHono(app, {
  schema: {
    info: {
      title: "Weather Endpoints",
      version: "1.0.0",
    },
  },
});

// Register endpoints
weatherRouter.get("/:location", getWeatherByLocation);
weatherRouter.get("/london", getWeatherLondon);
