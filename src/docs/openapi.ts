import { fromHono } from "chanfana";
import { Hono } from "hono";
import { WeatherLocationOpenAPI } from "./endpoints/weather/getWeatherByLocation";
import { WeatherLondonOpenAPI } from "./endpoints/weather/getWeatherLondon";
import { SignupOpenAPI } from "./endpoints/auth/signup";
import { LoginOpenAPI } from "./endpoints/auth/login";

// Create a separate app for OpenAPI documentation
const docsApp = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
export const openapi = fromHono(docsApp, {
  docs_url: "/",
  schema: {
    info: {
      title: "Weather API",
      version: "1.0.0",
      description:
        "Weather API built with Cloudflare Workers. Provides weather information for any location and a protected endpoint for London weather.",
    },
  },
});

// Register OpenAPI endpoints for documentation
openapi.get("/weather/:location", WeatherLocationOpenAPI);
openapi.get("/weather/london", WeatherLondonOpenAPI);
openapi.post("/auth/signup", SignupOpenAPI);
openapi.post("/auth/login", LoginOpenAPI);

export default docsApp;
