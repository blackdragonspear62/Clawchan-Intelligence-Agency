import axios from 'axios';
import { logger } from '../utils/logger';

const N2YO_API_BASE = 'https://api.n2yo.com/rest/v1/satellite';
const N2YO_API_KEY = process.env.N2YO_API_KEY || 'demo-key';

export interface SatelliteAbove {
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

class SatelliteService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

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

  async getSatellitesAbove(
    lat: number,
    lng: number,
    alt: number = 0,
    searchRadius: number = 90,
    categoryId: number = 0
  ): Promise<SatelliteAbove[]> {
    const cacheKey = this.getCacheKey('above', { lat, lng, alt, searchRadius, categoryId });
    const cached = this.getCached<SatelliteAbove[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${N2YO_API_BASE}/above/${lat}/${lng}/${alt}/${searchRadius}/${categoryId}`,
        {
          params: { apiKey: N2YO_API_KEY },
          timeout: 15000,
        }
      );

      const satellites = response.data.above || [];
      this.setCache(cacheKey, satellites);
      return satellites;
    } catch (error) {
      logger.error('Error fetching satellites from N2YO:', error);
      return this.getMockSatellites();
    }
  }

  async getSatellitePositions(
    satid: number,
    lat: number,
    lng: number,
    alt: number = 0,
    seconds: number = 1
  ): Promise<SatellitePositionsResponse> {
    const cacheKey = this.getCacheKey('positions', { satid, lat, lng, alt, seconds });
    const cached = this.getCached<SatellitePositionsResponse>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(
        `${N2YO_API_BASE}/positions/${satid}/${lat}/${lng}/${alt}/${seconds}`,
        {
          params: { apiKey: N2YO_API_KEY },
          timeout: 15000,
        }
      );

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching satellite positions:', error);
      return this.getMockPositions(satid);
    }
  }

  async getTle(satid: number): Promise<TleData> {
    const cacheKey = this.getCacheKey('tle', { satid });
    const cached = this.getCached<TleData>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${N2YO_API_BASE}/tle/${satid}`, {
        params: { apiKey: N2YO_API_KEY },
        timeout: 10000,
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching TLE:', error);
      return {
        satid,
        satname: `SAT-${satid}`,
        transactionscount: 0,
        tle: 'NO TLE AVAILABLE',
      };
    }
  }

  async getSatellitesByCategory(categoryId: number): Promise<{ satcount: number; satids: number[] }> {
    try {
      const response = await axios.get(`${N2YO_API_BASE}/category/${categoryId}`, {
        params: { apiKey: N2YO_API_KEY },
        timeout: 10000,
      });

      return {
        satcount: response.data.data?.length || 0,
        satids: response.data.data?.map((s: { satid: number }) => s.satid) || [],
      };
    } catch (error) {
      logger.error('Error fetching satellites by category:', error);
      return { satcount: 0, satids: [] };
    }
  }

  private getMockSatellites(): SatelliteAbove[] {
    const satelliteNames = [
      'ISS (ZARYA)',
      'HST',
      'STARLINK-1007',
      'STARLINK-1008',
      'STARLINK-1009',
      'STARLINK-1010',
      'STARLINK-1011',
      'STARLINK-1012',
      'SES-7',
      'GPS-IIR-M',
    ];

    return satelliteNames.map((name, i) => ({
      satid: 25544 + i,
      satname: name,
      intDesignator: `1998-067${String.fromCharCode(65 + i)}`,
      launchDate: '1998-11-20',
      satlat: (Math.random() - 0.5) * 180,
      satlng: (Math.random() - 0.5) * 360,
      satalt: 400 + Math.random() * 36000,
    }));
  }

  private getMockPositions(satid: number): SatellitePositionsResponse {
    return {
      info: {
        satname: `SAT-${satid}`,
        satid,
        transactionscount: 1,
      },
      positions: [
        {
          satlatitude: (Math.random() - 0.5) * 180,
          satlongitude: (Math.random() - 0.5) * 360,
          sataltitude: 400 + Math.random() * 1000,
          azimuth: Math.random() * 360,
          elevation: Math.random() * 90,
          ra: Math.random() * 360,
          dec: (Math.random() - 0.5) * 180,
          timestamp: Math.floor(Date.now() / 1000),
          eclipsed: Math.random() < 0.3,
        },
      ],
    };
  }
}

export const satelliteService = new SatelliteService();
export default satelliteService;
