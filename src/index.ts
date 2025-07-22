import { Hono } from "hono";
import { weatherRouter } from "./endpoints/weather/router";
import { authRouter } from "./endpoints/auth/router";
import { docsRouter } from "./docs/openapi";

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

// openapi docs
app.route("/", docsRouter);

export default app;
