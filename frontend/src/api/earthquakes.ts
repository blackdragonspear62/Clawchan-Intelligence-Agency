import axios from 'axios';

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

const earthquakeApi = axios.create({
  baseURL: USGS_API_BASE,
  timeout: 15000,
});

export const earthquakeService = {
  async getAllHour(): Promise<EarthquakeResponse> {
    const response = await earthquakeApi.get('/summary/all_hour.geojson');
    return response.data;
  },

  async getAllDay(): Promise<EarthquakeResponse> {
    const response = await earthquakeApi.get('/summary/all_day.geojson');
    return response.data;
  },

  async getAllWeek(): Promise<EarthquakeResponse> {
    const response = await earthquakeApi.get('/summary/all_week.geojson');
    return response.data;
  },

  async getAllMonth(): Promise<EarthquakeResponse> {
    const response = await earthquakeApi.get('/summary/all_month.geojson');
    return response.data;
  },

  async getSignificantHour(): Promise<EarthquakeResponse> {
    const response = await earthquakeApi.get('/summary/significant_hour.geojson');
    return response.data;
  },

  async getSignificantDay(): Promise<EarthquakeResponse> {
    const response = await earthquakeApi.get('/summary/significant_day.geojson');
    return response.data;
  },

  async getByMagnitude(minMagnitude: number, period: 'hour' | 'day' | 'week' | 'month'): Promise<EarthquakeResponse> {
    let endpoint: string;
    
    if (minMagnitude >= 4.5) {
      endpoint = `/summary/4.5_${period}.geojson`;
    } else if (minMagnitude >= 2.5) {
      endpoint = `/summary/2.5_${period}.geojson`;
    } else if (minMagnitude >= 1.0) {
      endpoint = `/summary/1.0_${period}.geojson`;
    } else {
      endpoint = `/summary/all_${period}.geojson`;
    }
    
    const response = await earthquakeApi.get(endpoint);
    return response.data;
  },

  async query(
    startTime?: string,
    endTime?: string,
    minLatitude?: number,
    maxLatitude?: number,
    minLongitude?: number,
    maxLongitude?: number,
    minMagnitude?: number,
    maxMagnitude?: number
  ): Promise<EarthquakeResponse> {
    const params: Record<string, string | number> = {
      format: 'geojson',
    };

    if (startTime) params.starttime = startTime;
    if (endTime) params.endtime = endTime;
    if (minLatitude !== undefined) params.minlatitude = minLatitude;
    if (maxLatitude !== undefined) params.maxlatitude = maxLatitude;
    if (minLongitude !== undefined) params.minlongitude = minLongitude;
    if (maxLongitude !== undefined) params.maxlongitude = maxLongitude;
    if (minMagnitude !== undefined) params.minmagnitude = minMagnitude;
    if (maxMagnitude !== undefined) params.maxmagnitude = maxMagnitude;

    const response = await earthquakeApi.get('/query', { params });
    return response.data;
  },

  getMagnitudeColor(magnitude: number): string {
    if (magnitude >= 7) return '#ff0000';
    if (magnitude >= 6) return '#ff4500';
    if (magnitude >= 5) return '#ff8c00';
    if (magnitude >= 4) return '#ffd700';
    if (magnitude >= 3) return '#ffff00';
    return '#00ff00';
  },

  getMagnitudeLabel(magnitude: number): string {
    if (magnitude >= 7) return 'Major';
    if (magnitude >= 6) return 'Strong';
    if (magnitude >= 5) return 'Moderate';
    if (magnitude >= 4) return 'Light';
    if (magnitude >= 3) return 'Minor';
    return 'Micro';
  },
};

export default earthquakeService;
