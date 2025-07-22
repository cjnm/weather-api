import { Hono } from "hono";

const docsRouter = new Hono();

const openapiYaml = `openapi: 3.1.0
info:
  title: Weather API
  version: 1.0.0
  description: |-
    Weather API built with Cloudflare Workers. Provides weather information for any location and a protected endpoint for London weather.

    **Authentication:**
    1. Create an account using the \`/auth/signup\` endpoint
    2. Login using the \`/auth/login\` endpoint to get a JWT token
    3. Use the JWT token in the Authorization header for protected endpoints

    **Protected Endpoints:** \`/weather/london\` requires JWT authentication

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Signup:
      type: object
      required:
        - username
        - email
        - password
      properties:
        username:
          type: string
          minLength: 3
          maxLength: 50
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 8
          maxLength: 100
    Login:
      type: object
      required:
        - username
        - password
      properties:
        username:
          type: string
        password:
          type: string
  parameters: {}

paths:
  /weather/{location}:
    get:
      tags:
        - Weather
      summary: Get weather information for a specific location
      parameters:
        - name: location
          in: path
          required: true
          schema:
            type: string
          description: The location to get weather for
      operationId: get_WeatherLocationOpenAPI
      responses:
        "200":
          description: Weather information retrieved successfully
        "404":
          description: Weather data not found for location
        "500":
          description: Internal server error

  /weather/london:
    get:
      tags:
        - Weather
      summary: Get weather information for London (Protected)
      description: Get current weather information for London, UK. This endpoint requires JWT authentication obtained from the login endpoint.
      security:
        - bearerAuth: []
      operationId: get_WeatherLondonOpenAPI
      responses:
        "200":
          description: London weather information retrieved successfully
        "401":
          description: Unauthorized - Invalid or missing JWT token
        "500":
          description: Internal server error

  /auth/signup:
    post:
      tags:
        - Authentication
      summary: Create a new user account
      description: Register a new user account with username, email, and password. The password will be securely hashed before storage.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Signup'
      operationId: post_SignupOpenAPI
      responses:
        "201":
          description: User created successfully - Account has been registered
        "400":
          description: Invalid request body
        "409":
          description: Username or email already exists
        "500":
          description: Internal server error

  /auth/login:
    post:
      tags:
        - Authentication
      summary: Login with username and password
      description: Authenticate a user and receive a JWT token for accessing protected endpoints
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Login'
      operationId: post_LoginOpenAPI
      responses:
        "200":
          description: Login successful
        "400":
          description: Invalid request body
        "401":
          description: Authentication failed - Invalid credentials
        "500":
          description: Internal server error

webhooks: {}
`;

const swaggerUiHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Swagger UI</title>
  <link href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" rel="stylesheet" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/openapi.yaml',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout',
        deepLinking: true
      });
    };
  </script>
</body>
</html>
`;

docsRouter.get("/", (c) => c.html(swaggerUiHtml));

docsRouter.get("/openapi.yaml", (c) =>
  c.text(openapiYaml, 200, { "Content-Type": "application/x-yaml" })
);

export { docsRouter };
