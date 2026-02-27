import { useState, useEffect, useCallback } from 'react';

interface Satellite {
  noradId: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

// Simulated satellite data
const SATELLITE_DATABASE = [
  { noradId: '25544', name: 'ISS (ZARYA)', altitude: 408 },
  { noradId: '20580', name: 'HST', altitude: 540 },
  { noradId: '36516', name: 'SES-7', altitude: 35786 },
  { noradId: '41866', name: 'STARLINK-1007', altitude: 550 },
  { noradId: '41867', name: 'STARLINK-1008', altitude: 550 },
  { noradId: '41868', name: 'STARLINK-1009', altitude: 550 },
  { noradId: '41869', name: 'STARLINK-1010', altitude: 550 },
  { noradId: '41870', name: 'STARLINK-1011', altitude: 550 },
  { noradId: '41871', name: 'STARLINK-1012', altitude: 550 },
  { noradId: '41872', name: 'STARLINK-1013', altitude: 550 },
  { noradId: '41873', name: 'STARLINK-1014', altitude: 550 },
  { noradId: '41874', name: 'STARLINK-1015', altitude: 550 },
  { noradId: '41875', name: 'STARLINK-1016', altitude: 550 },
  { noradId: '41876', name: 'STARLINK-1017', altitude: 550 },
  { noradId: '41877', name: 'STARLINK-1018', altitude: 550 },
  { noradId: '41878', name: 'STARLINK-1019', altitude: 550 },
  { noradId: '41879', name: 'STARLINK-1020', altitude: 550 },
  { noradId: '41880', name: 'STARLINK-1021', altitude: 550 },
  { noradId: '41881', name: 'STARLINK-1022', altitude: 550 },
  { noradId: '41882', name: 'STARLINK-1023', altitude: 550 },
  { noradId: '41883', name: 'STARLINK-1024', altitude: 550 },
  { noradId: '41884', name: 'STARLINK-1025', altitude: 550 },
  { noradId: '41885', name: 'STARLINK-1026', altitude: 550 },
  { noradId: '41886', name: 'STARLINK-1027', altitude: 550 },
  { noradId: '41887', name: 'STARLINK-1028', altitude: 550 },
  { noradId: '41888', name: 'STARLINK-1029', altitude: 550 },
  { noradId: '41889', name: 'STARLINK-1030', altitude: 550 },
  { noradId: '41890', name: 'STARLINK-1031', altitude: 550 },
  { noradId: '41891', name: 'STARLINK-1032', altitude: 550 },
  { noradId: '41892', name: 'STARLINK-1033', altitude: 550 },
];

// Generate initial positions
const generateSatellites = (): Satellite[] => {
  return SATELLITE_DATABASE.map((sat) => ({
    ...sat,
    latitude: (Math.random() - 0.5) * 180,
    longitude: (Math.random() - 0.5) * 360,
    velocity: 7.66, // km/s for LEO satellites
  }));
};

export function useSatellites() {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const updateSatellitePositions = useCallback(() => {
    setSatellites((prev) =>
      prev.map((sat) => {
        // Simplified orbital mechanics
        const orbitalPeriod = 2 * Math.PI * Math.sqrt(
          Math.pow((6371 + sat.altitude) * 1000, 3) / (6.674e-11 * 5.972e24)
        );
        const angularVelocity = 360 / (orbitalPeriod / 60); // degrees per minute
        
        return {
          ...sat,
          longitude: (sat.longitude + angularVelocity * 0.1) % 360,
        };
      })
    );
  }, []);

  useEffect(() => {
    try {
      const initialSatellites = generateSatellites();
      setSatellites(initialSatellites);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize satellites'));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (satellites.length === 0) return;

    const interval = setInterval(updateSatellitePositions, 5000);
    return () => clearInterval(interval);
  }, [satellites.length, updateSatellitePositions]);

  return { satellites, isLoading, error };
}
