// Shared types for the weather app

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;          // e.g. "Rain", "Clear"
  description: string;   // e.g. "light rain"
  icon: string;          // e.g. "10d"
}

export interface CurrentWeather {
  city: string;
  country: string;
  coordinates: Coordinates;
  temperature: number;       // Celsius
  feelsLike: number;         // Celsius
  humidity: number;          // percent
  pressure: number;          // hPa
  windSpeed: number;         // m/s
  windDeg: number;           // degrees
  visibility: number;        // metres
  condition: WeatherCondition;
  sunrise: number;           // Unix timestamp
  sunset: number;            // Unix timestamp
  timezone: number;          // offset in seconds from UTC
  fetchedAt: number;         // Date.now()
}

export interface ForecastEntry {
  dt: number;                // Unix timestamp
  temperature: number;       // Celsius
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  pop: number;               // probability of precipitation 0–1
}

// 5-day / 3-hour forecast grouped by day
export interface DailyForecast {
  date: string;              // ISO date string "YYYY-MM-DD"
  entries: ForecastEntry[];
  minTemp: number;
  maxTemp: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface AppState {
  query: string;
  unit: TemperatureUnit;
  loading: boolean;
  error: string | null;
  data: WeatherData | null;
}

// OpenWeatherMap raw API shapes (subset used)
export interface OWMCurrentResponse {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  coord: { lat: number; lon: number };
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  wind: { speed: number; deg: number };
  visibility: number;
  weather: { id: number; main: string; description: string; icon: string }[];
  timezone: number;
}

export interface OWMForecastItem {
  dt: number;
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  pop: number;
}

export interface OWMForecastResponse {
  list: OWMForecastItem[];
  city: { name: string; country: string; coord: { lat: number; lon: number }; timezone: number; sunrise: number; sunset: number };
}
