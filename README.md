# Weather API with Cloudflare Workers

A simple weather API built with Cloudflare Workers that provides weather information for any location and includes a protected endpoint for London weather.

## Features

- Public endpoint to get weather for any location
- Protected endpoint (JWT authentication) to get weather for London
- User authentication with signup and login endpoints
- JWT token generation for authenticated requests
- Integration with OpenWeatherMap API
- Cloudflare AI integration to provide interesting facts about locations
- OpenAPI/Swagger documentation

## API Endpoints

### Authentication Endpoints

- `POST /auth/signup` - Create a new user account

  - Request body: `{ "username": "user123", "email": "user@example.com", "password": "password123" }`
  - Returns: User information

- `POST /auth/login` - Login with username and password
  - Request body: `{ "username": "user123", "password": "password123" }`
  - Returns: JWT token for authentication

### Weather Endpoints

#### Public Endpoints

- `GET /weather/:location` - Get weather information for a specific location
  - Example: `GET /weather/new-york`
  - Returns weather data and an AI-generated fact about the location

#### Protected Endpoints

- `GET /weather/london` - Get weather information for London (requires JWT authentication)
  - Requires Authorization header with Bearer token
  - Example: `GET /weather/london` with header `Authorization: Bearer your_jwt_token`

## Deployment

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account (sign up at [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up))
- OpenWeatherMap API key (get one for free at [https://openweathermap.org/api](https://openweathermap.org/api))

### Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Login to Cloudflare (if you haven't already):
   ```bash
   wrangler login
   ```
4. Set up your environment variables:

   ```bash
   # Set your OpenWeatherMap API key
   wrangler secret put OPENWEATHER_API_KEY

   # Set your JWT secret (can be any secure random string)
   wrangler secret put JWT_SECRET
   ```

5. Update the `wrangler.jsonc` file with your project details:
   - Change the `name` field if you want a different subdomain
   - Update the `account_id` field with your Cloudflare account ID (found in the Cloudflare dashboard)

### Development

Run the development server locally:

```bash
npm run dev
```

This will start a local development server, typically at http://localhost:8787, where you can test your API.

### Deployment

1. Deploy to Cloudflare Workers:

```bash
npm run deploy
```

2. After successful deployment, you'll receive a URL where your API is hosted (typically `https://weather-api.your-account.workers.dev`).

3. Test your deployed API:

   ```bash
   # Create a new user
   curl -X POST https://weather-api.your-account.workers.dev/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

   # Login to get a JWT token
   curl -X POST https://weather-api.your-account.workers.dev/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'

   # Test public endpoint
   curl https://weather-api.your-account.workers.dev/weather/paris

   # Test protected endpoint (replace YOUR_JWT_TOKEN with the token from login response)
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" https://weather-api.your-account.workers.dev/weather/london
   ```

4. Access the Swagger documentation by visiting your API's root URL in a browser.

### Authentication Flow

1. **Sign Up**: Create a new user account using the `/auth/signup` endpoint
2. **Login**: Authenticate with username and password using the `/auth/login` endpoint to receive a JWT token
3. **Access Protected Resources**: Use the JWT token in the Authorization header to access protected endpoints

The JWT token is valid for 1 hour after login. After that, you'll need to login again to get a new token.

### Monitoring and Logs

You can monitor your Worker and view logs in the Cloudflare Dashboard:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Workers & Pages
3. Select your worker to view metrics, logs, and settings

## OpenAPI Documentation

The API includes OpenAPI/Swagger documentation available at the root URL of your deployed Worker.

## Technologies Used

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Hono](https://hono.dev/) - Lightweight web framework
- [Chanfana](https://chanfana.com/) - OpenAPI integration
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Cloudflare AI](https://developers.cloudflare.com/workers/ai/) - For generating location facts
