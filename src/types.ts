import type { Context } from "hono";

// Extend the Env interface to include our API keys and AI binding
declare global {
  interface Env {
    DB: D1Database;
    OPENWEATHER_API_KEY?: string;
    AI?: any; // Cloudflare AI binding
    JWT_SECRET?: string;
  }
}

export type WeatherApiResponse = {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust: number };
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type AppContext = Context<{ Bindings: Env }>;
export type HandleArgs = [AppContext];
