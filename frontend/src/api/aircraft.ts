import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface AircraftData {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
}

export interface AircraftStateResponse {
  time: number;
  states: AircraftData[] | null;
}

const aircraftApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/aircraft`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
aircraftApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
aircraftApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const aircraftService = {
  async getAllStates(): Promise<AircraftStateResponse> {
    const response = await aircraftApi.get('/states/all');
    return response.data;
  },

  async getStatesByBounds(
    lamin: number,
    lomin: number,
    lamax: number,
    lomax: number
  ): Promise<AircraftStateResponse> {
    const response = await aircraftApi.get('/states/all', {
      params: { lamin, lomin, lamax, lomax },
    });
    return response.data;
  },

  async getAircraftByIcao(icao24: string): Promise<AircraftData | null> {
    const response = await aircraftApi.get(`/states/all?icao24=${icao24}`);
    return response.data.states?.[0] || null;
  },

  async getAircraftTrack(icao24: string, time?: number): Promise<unknown> {
    const response = await aircraftApi.get(`/track/all`, {
      params: { icao24, time },
    });
    return response.data;
  },

  async getFlightsByAircraft(
    icao24: string,
    begin: number,
    end: number
  ): Promise<unknown[]> {
    const response = await aircraftApi.get('/flights/aircraft', {
      params: { icao24, begin, end },
    });
    return response.data;
  },
};

export default aircraftService;
