import { Hono } from "hono";
import { weatherRouter } from "./endpoints/weather/router";
import { authRouter } from "./endpoints/auth/router";
import docsApp from "./docs/openapi";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
  console.error("Global error handler caught:", err);
  return c.json(
    {
      success: false,
      error: "Internal Server Error",
    },
    500
  );
});

// Register main API routes
app.route("/weather", weatherRouter);
app.route("/auth", authRouter);

// Register documentation routes
app.route("/", docsApp);

// Add a simple root endpoint
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Weather API is running",
    endpoints: {
      weather: "/weather/:location",
      weatherLondon: "/weather/london (requires JWT)",
      signup: "/auth/signup",
      login: "/auth/login",
      documentation: "/docs",
    },
  });
});

export default app;
