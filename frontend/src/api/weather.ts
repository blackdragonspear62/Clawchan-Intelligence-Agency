import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

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

const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
});

export const weatherService = {
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const response = await weatherApi.get('/weather', {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  },

  async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    const response = await weatherApi.get('/weather', {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  },

  async getForecast(lat: number, lon: number): Promise<ForecastData> {
    const response = await weatherApi.get('/forecast', {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  },

  async getForecastByCity(city: string): Promise<ForecastData> {
    const response = await weatherApi.get('/forecast', {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  },

  async getAirPollution(lat: number, lon: number): Promise<unknown> {
    const response = await weatherApi.get('/air_pollution', {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
      },
    });
    return response.data;
  },

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },
};

export default weatherService;
