import axios from 'axios';
import { logger } from '../utils/logger';

const OPENSKY_API_BASE = 'https://opensky-network.org/api';

export interface AircraftState {
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
  states: AircraftState[] | null;
}

class AircraftService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5000; // 5 seconds

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

  async getAllStates(): Promise<AircraftState[]> {
    const cacheKey = this.getCacheKey('states/all');
    const cached = this.getCached<AircraftState[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get<AircraftStateResponse>(
        `${OPENSKY_API_BASE}/states/all`,
        {
          timeout: 10000,
          auth: process.env.OPENSKY_CREDENTIALS
            ? {
                username: process.env.OPENSKY_CREDENTIALS.split(':')[0],
                password: process.env.OPENSKY_CREDENTIALS.split(':')[1],
              }
            : undefined,
        }
      );

      const states = response.data.states || [];
      this.setCache(cacheKey, states);
      return states;
    } catch (error) {
      logger.error('Error fetching aircraft states from OpenSky:', error);
      // Return mock data if API fails
      return this.getMockAircraftStates();
    }
  }

  async getStatesByBounds(bounds: {
    lamin: number;
    lomin: number;
    lamax: number;
    lomax: number;
  }): Promise<AircraftState[]> {
    const cacheKey = this.getCacheKey('states/all', bounds);
    const cached = this.getCached<AircraftState[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get<AircraftStateResponse>(
        `${OPENSKY_API_BASE}/states/all`,
        {
          params: bounds,
          timeout: 10000,
        }
      );

      const states = response.data.states || [];
      this.setCache(cacheKey, states);
      return states;
    } catch (error) {
      logger.error('Error fetching aircraft states by bounds:', error);
      return this.getMockAircraftStates().filter(
        (ac) =>
          ac.latitude &&
          ac.longitude &&
          ac.latitude >= bounds.lamin &&
          ac.latitude <= bounds.lamax &&
          ac.longitude >= bounds.lomin &&
          ac.longitude <= bounds.lomax
      );
    }
  }

  async getAircraftByIcao(icao24: string): Promise<AircraftState | null> {
    const states = await this.getAllStates();
    return states.find((s) => s.icao24 === icao24.toLowerCase()) || null;
  }

  async getAircraftTrack(icao24: string, time?: number): Promise<unknown> {
    try {
      const response = await axios.get(
        `${OPENSKY_API_BASE}/tracks/all`,
        {
          params: { icao24: icao24.toLowerCase(), time },
          timeout: 10000,
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Error fetching aircraft track:', error);
      return null;
    }
  }

  private getMockAircraftStates(): AircraftState[] {
    const airlines = ['UAL', 'AAL', 'DAL', 'BAW', 'DLH', 'AFR', 'KLM', 'JAL', 'ANA'];
    
    return Array.from({ length: 100 }, (_, i) => {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const flightNum = Math.floor(Math.random() * 9000) + 100;
      
      return {
        icao24: Array.from({ length: 6 }, () => 
          '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join(''),
        callsign: `${airline}${flightNum}`,
        origin_country: 'United States',
        time_position: Math.floor(Date.now() / 1000),
        last_contact: Math.floor(Date.now() / 1000),
        longitude: (Math.random() - 0.5) * 360,
        latitude: (Math.random() - 0.5) * 180,
        baro_altitude: Math.random() * 12000,
        on_ground: Math.random() < 0.1,
        velocity: 100 + Math.random() * 800,
        true_track: Math.random() * 360,
        vertical_rate: (Math.random() - 0.5) * 20,
        sensors: null,
        geo_altitude: Math.random() * 12000,
        squawk: Math.floor(Math.random() * 7777).toString().padStart(4, '0'),
        spi: false,
        position_source: 0,
      };
    });
  }
}

export const aircraftService = new AircraftService();
export default aircraftService;
