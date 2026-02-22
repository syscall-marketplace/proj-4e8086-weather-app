import type {
  CurrentWeather,
  DailyForecast,
  ForecastEntry,
  WeatherData,
  OWMCurrentResponse,
  OWMForecastResponse,
  OWMForecastItem,
} from '../types.js';

const API_KEY = import.meta.env.VITE_OWM_API_KEY as string;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function request<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new Error('Network error');
  }

  if (res.status === 404) {
    throw new Error('City not found');
  }

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  const data = await request<OWMCurrentResponse>(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
  );

  const w = data.weather[0];

  return {
    city: data.name,
    country: data.sys.country,
    coordinates: { lat: data.coord.lat, lon: data.coord.lon },
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    visibility: data.visibility,
    condition: {
      id: w.id,
      main: w.main,
      description: w.description,
      icon: w.icon,
    },
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
    fetchedAt: Date.now(),
  };
}

function mapForecastEntry(item: OWMForecastItem): ForecastEntry {
  const w = item.weather[0];
  return {
    dt: item.dt,
    temperature: item.main.temp,
    feelsLike: item.main.feels_like,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    condition: {
      id: w.id,
      main: w.main,
      description: w.description,
      icon: w.icon,
    },
    pop: item.pop,
  };
}

export async function fetchForecast(city: string): Promise<DailyForecast[]> {
  const data = await request<OWMForecastResponse>(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=40`,
  );

  const dayMap = new Map<string, ForecastEntry[]>();

  for (const item of data.list) {
    const dateStr = new Date(item.dt * 1000).toISOString().slice(0, 10);
    let entries = dayMap.get(dateStr);
    if (!entries) {
      entries = [];
      dayMap.set(dateStr, entries);
    }
    entries.push(mapForecastEntry(item));
  }

  const days: DailyForecast[] = [];
  for (const [date, entries] of dayMap) {
    const temps = entries.map((e) => e.temperature);
    days.push({
      date,
      entries,
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
    });
  }

  return days;
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  const [current, forecast] = await Promise.all([
    fetchCurrentWeather(city),
    fetchForecast(city),
  ]);

  return { current, forecast };
}
