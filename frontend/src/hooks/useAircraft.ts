import { useState, useEffect, useCallback } from 'react';

interface Aircraft {
  icao24: string;
  callsign: string | null;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  heading: number;
  vertical_rate: number | null;
  on_ground: boolean;
}

// Generate simulated aircraft data
const generateAircraft = (count: number): Aircraft[] => {
  const airlines = ['UAL', 'AAL', 'DAL', 'BAW', 'DLH', 'AFR', 'KLM', 'JAL', 'ANA', 'QFA', 'ACA', 'SWA'];
  const aircraft: Aircraft[] = [];

  for (let i = 0; i < count; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNum = Math.floor(Math.random() * 9000) + 100;
    
    aircraft.push({
      icao24: Array.from({ length: 6 }, () => 
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join(''),
      callsign: `${airline}${flightNum}`,
      latitude: (Math.random() - 0.5) * 160,
      longitude: (Math.random() - 0.5) * 340,
      altitude: Math.random() * 12000,
      velocity: 150 + Math.random() * 700,
      heading: Math.random() * 360,
      vertical_rate: (Math.random() - 0.5) * 20,
      on_ground: Math.random() < 0.1,
    });
  }

  return aircraft;
};

export function useAircraft() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const updateAircraftPositions = useCallback(() => {
    setAircraft((prev) =>
      prev.map((ac) => {
        // Convert velocity from m/s to degrees per second (approximate)
        const velocityKnots = ac.velocity * 1.94384;
        const degreesPerSecond = velocityKnots / 3600 / 60; // Very simplified
        
        const headingRad = (ac.heading * Math.PI) / 180;
        
        let newLat = ac.latitude + Math.cos(headingRad) * degreesPerSecond * 10;
        let newLon = ac.longitude + Math.sin(headingRad) * degreesPerSecond * 10;
        
        // Bounce back at poles
        if (newLat > 85) {
          newLat = 85 - (newLat - 85);
        } else if (newLat < -85) {
          newLat = -85 + (-85 - newLat);
        }
        
        // Wrap around longitude
        if (newLon > 180) newLon -= 360;
        if (newLon < -180) newLon += 360;
        
        return {
          ...ac,
          latitude: newLat,
          longitude: newLon,
        };
      })
    );
  }, []);

  useEffect(() => {
    try {
      const initialAircraft = generateAircraft(80);
      setAircraft(initialAircraft);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize aircraft'));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (aircraft.length === 0) return;

    const interval = setInterval(updateAircraftPositions, 1000);
    return () => clearInterval(interval);
  }, [aircraft.length, updateAircraftPositions]);

  return { aircraft, isLoading, error };
}
