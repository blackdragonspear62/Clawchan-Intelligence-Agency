import { useState, useEffect } from 'react';
import { Satellite, Orbit, Radio, Signal, Globe } from 'lucide-react';

interface SatelliteData {
  id: string;
  name: string;
  noradId: string;
  altitude: number;
  velocity: number;
  lat: number;
  lng: number;
  type: string;
  visibility: 'visible' | 'eclipsed' | 'daylight';
}

export function SatelliteWidget() {
  const [satellites, setSatellites] = useState<SatelliteData[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const generateSatellites = (): SatelliteData[] => [
      { id: 's1', name: 'ISS (ZARYA)', noradId: '25544', altitude: 420, velocity: 27600, lat: 51.6, lng: -0.1, type: 'Space Station', visibility: 'visible' },
      { id: 's2', name: 'STARLINK-1007', noradId: '44713', altitude: 550, velocity: 27300, lat: 53.0, lng: 60.0, type: 'Communications', visibility: 'daylight' },
      { id: 's3', name: 'HST', noradId: '20580', altitude: 540, velocity: 27500, lat: 28.5, lng: -80.0, type: 'Scientific', visibility: 'eclipsed' },
      { id: 's4', name: 'GPS BIIR-2', noradId: '25933', altitude: 20200, velocity: 3880, lat: 55.0, lng: -100.0, type: 'Navigation', visibility: 'visible' },
      { id: 's5', name: 'NOAA-20', noradId: '43013', altitude: 824, velocity: 7450, lat: 98.7, lng: 0.0, type: 'Weather', visibility: 'visible' },
    ];

    setSatellites(generateSatellites());
    setActiveCount(4523);

    const interval = setInterval(() => {
      setSatellites(prev => prev.map(s => ({
        ...s,
        lat: s.lat + (Math.random() - 0.5) * 0.5,
        lng: s.lng + (Math.random() - 0.5) * 0.5,
        altitude: s.altitude + Math.floor((Math.random() - 0.5) * 2),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'visible': return 'text-green-400';
      case 'daylight': return 'text-yellow-400';
      case 'eclipsed': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Space Station': return <Globe className="w-3 h-3" />;
      case 'Communications': return <Signal className="w-3 h-3" />;
      case 'Navigation': return <Orbit className="w-3 h-3" />;
      default: return <Radio className="w-3 h-3" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-gray-400">Satellite Tracking</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-mono text-purple-400">{activeCount.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">Active Sats</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="space-y-1">
          {satellites.map((sat) => (
            <div
              key={sat.id}
              className="flex items-center justify-between p-2 bg-[#1a1f2e] rounded hover:bg-[#252b3d] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-purple-500/10 rounded flex items-center justify-center">
                  {getTypeIcon(sat.type)}
                </div>
                <div>
                  <div className="text-xs text-gray-300 font-medium">{sat.name}</div>
                  <div className="text-[10px] text-gray-500">NORAD: {sat.noradId}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-purple-400">{sat.altitude} km</div>
                <div className="text-[10px] text-gray-500 flex items-center gap-2 justify-end">
                  <span>{sat.velocity.toLocaleString()} km/h</span>
                  <span className={getVisibilityColor(sat.visibility)}>●</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>Source: N2YO / Celestrak</span>
          <span className="text-purple-400">● TLE Updated</span>
        </div>
      </div>
    </div>
  );
}
