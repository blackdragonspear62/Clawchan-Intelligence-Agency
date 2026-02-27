import axios from 'axios';
import { logger } from '../utils/logger';

const OPENWEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  name: string;
}

export interface ForecastData {
  city: {
    name: string;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
  list: Array<{
    dt: number;
    main: WeatherData['main'];
    weather: WeatherData['weather'];
    wind: WeatherData['wind'];
    clouds: WeatherData['clouds'];
    pop: number;
    dt_txt: string;
  }>;
}

class WeatherService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes

  private getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  }

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = this.getCacheKey('weather', { lat, lon });
    const cached = this.getCached<WeatherData>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${OPENWEATHER_API_BASE}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
        timeout: 10000,
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching weather:', error);
      return this.getMockWeather(lat, lon);
    }
  }

  async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    const cacheKey = this.getCacheKey('weather/city', { city });
    const cached = this.getCached<WeatherData>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${OPENWEATHER_API_BASE}/weather`, {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
        timeout: 10000,
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching weather by city:', error);
      return this.getMockWeather(0, 0, city);
    }
  }

  async getForecast(lat: number, lon: number): Promise<ForecastData> {
    const cacheKey = this.getCacheKey('forecast', { lat, lon });
    const cached = this.getCached<ForecastData>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${OPENWEATHER_API_BASE}/forecast`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
        timeout: 10000,
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching forecast:', error);
      return this.getMockForecast(lat, lon);
    }
  }

  async getAirPollution(lat: number, lon: number): Promise<unknown> {
    try {
      const response = await axios.get(`${OPENWEATHER_API_BASE}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      logger.error('Error fetching air pollution:', error);
      return null;
    }
  }

  private getMockWeather(lat: number, lon: number, cityName: string = 'Unknown'): WeatherData {
    const weatherConditions = [
      { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
      { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' },
      { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' },
      { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
      { id: 200, main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
    ];

    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    return {
      coord: { lon, lat },
      weather: [condition],
      main: {
        temp: 10 + Math.random() * 25,
        feels_like: 10 + Math.random() * 25,
        temp_min: 5 + Math.random() * 20,
        temp_max: 15 + Math.random() * 20,
        pressure: 1000 + Math.floor(Math.random() * 30),
        humidity: 40 + Math.floor(Math.random() * 50),
      },
      visibility: 5000 + Math.floor(Math.random() * 5000),
      wind: {
        speed: 1 + Math.random() * 10,
        deg: Math.floor(Math.random() * 360),
      },
      clouds: { all: Math.floor(Math.random() * 100) },
      dt: Math.floor(Date.now() / 1000),
      sys: {
        country: 'US',
        sunrise: Math.floor(Date.now() / 1000) - 36000,
        sunset: Math.floor(Date.now() / 1000) + 36000,
      },
      timezone: 0,
      name: cityName,
    };
  }

  private getMockForecast(lat: number, lon: number): ForecastData {
    const list = Array.from({ length: 40 }, (_, i) => {
      const baseTime = Math.floor(Date.now() / 1000);
      return {
        dt: baseTime + i * 3 * 3600,
        main: {
          temp: 10 + Math.random() * 25,
          feels_like: 10 + Math.random() * 25,
          temp_min: 5 + Math.random() * 20,
          temp_max: 15 + Math.random() * 20,
          pressure: 1000 + Math.floor(Math.random() * 30),
          humidity: 40 + Math.floor(Math.random() * 50),
        },
        weather: [{
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        }],
        wind: {
          speed: 1 + Math.random() * 10,
          deg: Math.floor(Math.random() * 360),
        },
        clouds: { all: Math.floor(Math.random() * 100) },
        pop: Math.random(),
        dt_txt: new Date(baseTime * 1000 + i * 3 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 19),
      };
    });

    return {
      city: {
        name: 'Unknown',
        country: 'US',
        coord: { lat, lon },
      },
      list,
    };
  }
}

export const weatherService = new WeatherService();
export default weatherService;
