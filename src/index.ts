import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { weatherRouter } from "./endpoints/weather/router";
import { authRouter } from "./endpoints/auth/router";
import { ContentfulStatusCode } from "hono/utils/http-status";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
  if (err instanceof ApiException) {
    // If it's a Chanfana ApiException, let Chanfana handle the response
    return c.json(
      { success: false, errors: err.buildResponse() },
      err.status as ContentfulStatusCode
    );
  }

  console.error("Global error handler caught:", err); // Log the error if it's not known

  // For other errors, return a generic 500 response
  return c.json(
    {
      success: false,
      errors: [{ message: "Internal Server Error" }],
    },
    500
  );
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/api-docs",
  schema: {
    info: {
      title: "Weather API",
      version: "1.0.0",
      description:
        "Weather API built with Cloudflare Workers. Provides weather information for any location and a protected endpoint for London weather.",
    },
  },
});

// Register Weather Sub router
openapi.route("/weather", weatherRouter);

// Register Auth Sub router
openapi.route("/auth", authRouter);

// Export the Hono app
export default app;
