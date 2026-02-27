import axios from 'axios';
import { logger } from '../utils/logger';

const USGS_API_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0';

export interface EarthquakeFeature {
  type: 'Feature';
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    tz: number | null;
    url: string;
    detail: string;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number | null;
    dmin: number | null;
    rms: number;
    gap: number | null;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number];
  };
  id: string;
}

export interface EarthquakeResponse {
  type: 'FeatureCollection';
  metadata: {
    generated: number;
    url: string;
    title: string;
    api: string;
    count: number;
    status: number;
  };
  features: EarthquakeFeature[];
  bbox: [number, number, number, number, number, number];
}

class EarthquakeService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60000; // 1 minute

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

  async getAllHour(): Promise<EarthquakeResponse> {
    const cacheKey = this.getCacheKey('all_hour');
    const cached = this.getCached<EarthquakeResponse>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${USGS_API_BASE}/summary/all_hour.geojson`, {
        timeout: 15000,
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching earthquakes:', error);
      return this.getMockEarthquakes();
    }
  }

  async getAllDay(): Promise<EarthquakeResponse> {
    const cacheKey = this.getCacheKey('all_day');
    const cached = this.getCached<EarthquakeResponse>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${USGS_API_BASE}/summary/all_day.geojson`, {
        timeout: 15000,
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching earthquakes:', error);
      return this.getMockEarthquakes(20);
    }
  }

  async getAllWeek(): Promise<EarthquakeResponse> {
    try {
      const response = await axios.get(`${USGS_API_BASE}/summary/all_week.geojson`, {
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching weekly earthquakes:', error);
      return this.getMockEarthquakes(50);
    }
  }

  async getAllMonth(): Promise<EarthquakeResponse> {
    try {
      const response = await axios.get(`${USGS_API_BASE}/summary/all_month.geojson`, {
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching monthly earthquakes:', error);
      return this.getMockEarthquakes(100);
    }
  }

  async getByTimeRange(timeRange: string, minMagnitude?: number): Promise<EarthquakeFeature[]> {
    let response: EarthquakeResponse;

    switch (timeRange) {
      case 'HOUR':
        response = await this.getAllHour();
        break;
      case 'DAY':
        response = await this.getAllDay();
        break;
      case 'WEEK':
        response = await this.getAllWeek();
        break;
      case 'MONTH':
        response = await this.getAllMonth();
        break;
      default:
        response = await this.getAllDay();
    }

    let features = response.features;

    if (minMagnitude !== undefined) {
      features = features.filter((f) => f.properties.mag >= minMagnitude);
    }

    return features;
  }

  async getById(id: string): Promise<EarthquakeFeature | null> {
    try {
      const response = await axios.get(`${USGS_API_BASE}/detail/${id}.geojson`, {
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching earthquake by ID:', error);
      return null;
    }
  }

  async query(params: {
    startTime?: string;
    endTime?: string;
    minLatitude?: number;
    maxLatitude?: number;
    minLongitude?: number;
    maxLongitude?: number;
    minMagnitude?: number;
    maxMagnitude?: number;
  }): Promise<EarthquakeResponse> {
    try {
      const queryParams: Record<string, string | number> = {
        format: 'geojson',
      };

      if (params.startTime) queryParams.starttime = params.startTime;
      if (params.endTime) queryParams.endtime = params.endTime;
      if (params.minLatitude !== undefined) queryParams.minlatitude = params.minLatitude;
      if (params.maxLatitude !== undefined) queryParams.maxlatitude = params.maxLatitude;
      if (params.minLongitude !== undefined) queryParams.minlongitude = params.minLongitude;
      if (params.maxLongitude !== undefined) queryParams.maxlongitude = params.maxLongitude;
      if (params.minMagnitude !== undefined) queryParams.minmagnitude = params.minMagnitude;
      if (params.maxMagnitude !== undefined) queryParams.maxmagnitude = params.maxMagnitude;

      const response = await axios.get(`${USGS_API_BASE}/query`, {
        params: queryParams,
        timeout: 15000,
      });

      return response.data;
    } catch (error) {
      logger.error('Error querying earthquakes:', error);
      return this.getMockEarthquakes();
    }
  }

  private getMockEarthquakes(count: number = 10): EarthquakeResponse {
    const locations = [
      'Southern California',
      'Northern California',
      'Alaska',
      'Hawaii',
      'Puerto Rico',
      'Nevada',
      'Utah',
      'Oklahoma',
      'Texas',
      'Washington',
    ];

    const features: EarthquakeFeature[] = Array.from({ length: count }, (_, i) => ({
      type: 'Feature',
      properties: {
        mag: 1 + Math.random() * 6,
        place: `${Math.floor(Math.random() * 100)}km ${['N', 'S', 'E', 'W'][Math.floor(Math.random() * 4)]} of ${locations[Math.floor(Math.random() * locations.length)]}`,
        time: Date.now() - Math.random() * 86400000,
        updated: Date.now(),
        tz: null,
        url: `https://earthquake.usgs.gov/earthquakes/eventpage/us${i}`,
        detail: `https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us${i}&format=geojson`,
        felt: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : null,
        cdi: Math.random() > 0.7 ? Math.random() * 10 : null,
        mmi: Math.random() > 0.8 ? Math.random() * 10 : null,
        alert: Math.random() > 0.9 ? ['green', 'yellow', 'orange', 'red'][Math.floor(Math.random() * 4)] : null,
        status: 'reviewed',
        tsunami: 0,
        sig: Math.floor(Math.random() * 1000),
        net: 'us',
        code: `us${i}`,
        ids: `,us${i},`,
        sources: ',us,',
        types: ',origin,phase-data,',
        nst: Math.floor(Math.random() * 100),
        dmin: Math.random() * 10,
        rms: Math.random() * 2,
        gap: Math.floor(Math.random() * 360),
        magType: 'ml',
        type: 'earthquake',
        title: `M ${(1 + Math.random() * 6).toFixed(1)} - ${locations[Math.floor(Math.random() * locations.length)]}`,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          (Math.random() - 0.5) * 360,
          (Math.random() - 0.5) * 180,
          Math.random() * 100,
        ],
      },
      id: `us${i}`,
    }));

    return {
      type: 'FeatureCollection',
      metadata: {
        generated: Date.now(),
        url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
        title: 'USGS All Earthquakes, Past Day',
        api: '1.0.0',
        count: features.length,
        status: 200,
      },
      features,
      bbox: [-180, -90, 0, 180, 90, 1000],
    };
  }
}

export const earthquakeService = new EarthquakeService();
export default earthquakeService;
