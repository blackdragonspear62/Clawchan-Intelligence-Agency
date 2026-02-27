import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface SatelliteData {
  satid: number;
  satname: string;
  intDesignator: string;
  launchDate: string;
  satlat: number;
  satlng: number;
  satalt: number;
}

export interface SatellitePosition {
  satlatitude: number;
  satlongitude: number;
  sataltitude: number;
  azimuth: number;
  elevation: number;
  ra: number;
  dec: number;
  timestamp: number;
  eclipsed: boolean;
}

export interface SatellitePositionsResponse {
  info: {
    satname: string;
    satid: number;
    transactionscount: number;
  };
  positions: SatellitePosition[];
}

export interface TleData {
  satid: number;
  satname: string;
  transactionscount: number;
  tle: string;
}

const satelliteApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/satellites`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
satelliteApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const satelliteService = {
  async getSatellitesAbove(
    lat: number,
    lng: number,
    alt: number = 0,
    searchRadius: number = 90,
    categoryId: number = 0
  ): Promise<{ above: SatelliteData[] }> {
    const response = await satelliteApi.get('/above', {
      params: { lat, lng, alt, searchRadius, categoryId },
    });
    return response.data;
  },

  async getSatellitePositions(
    satid: number,
    lat: number,
    lng: number,
    alt: number = 0,
    seconds: number = 1
  ): Promise<SatellitePositionsResponse> {
    const response = await satelliteApi.get(`/positions/${satid}/${lat}/${lng}/${alt}/${seconds}`);
    return response.data;
  },

  async getTle(satid: number): Promise<TleData> {
    const response = await satelliteApi.get(`/tle/${satid}`);
    return response.data;
  },

  async getSatellitesByCategory(categoryId: number): Promise<{ satcount: number; satids: number[] }> {
    const response = await satelliteApi.get(`/category/${categoryId}`);
    return response.data;
  },
};

export default satelliteService;
