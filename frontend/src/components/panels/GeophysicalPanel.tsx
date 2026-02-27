import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, MapPin, Clock } from 'lucide-react';

interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  coordinates: [number, number, number];
  url: string;
}

export function GeophysicalPanel() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const response = await fetch(
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
        );
        const data = await response.json();
        setEarthquakes(data.features.map((f: any) => ({
          id: f.id,
          magnitude: f.properties.mag,
          place: f.properties.place,
          time: f.properties.time,
          coordinates: f.geometry.coordinates,
          url: f.properties.url,
        })));
      } catch (error) {
        console.error('Failed to fetch earthquakes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarthquakes();
    const interval = setInterval(fetchEarthquakes, 60000);
    return () => clearInterval(interval);
  }, []);

  const getMagnitudeColor = (mag: number) => {
    if (mag >= 6) return 'text-red-500';
    if (mag >= 5) return 'text-orange-500';
    if (mag >= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getMagnitudeBg = (mag: number) => {
    if (mag >= 6) return 'bg-red-500/20 border-red-500/50';
    if (mag >= 5) return 'bg-orange-500/20 border-orange-500/50';
    if (mag >= 4) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-green-500/20 border-green-500/50';
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Monitoring seismic activity...</p>
      </div>
    );
  }

  const significant = earthquakes.filter(e => e.magnitude >= 4.5);

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">24h Events</div>
          <div className="text-2xl font-mono text-red-400">{earthquakes.length}</div>
        </div>
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Significant (4.5+)</div>
          <div className="text-2xl font-mono text-orange-400">{significant.length}</div>
        </div>
      </div>

      {significant.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-xs text-red-400">Significant seismic activity detected</span>
        </div>
      )}

      <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-auto">
        {earthquakes.slice(0, 30).map((eq) => (
          <div 
            key={eq.id}
            className={`rounded p-3 border transition-colors ${getMagnitudeBg(eq.magnitude)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${getMagnitudeColor(eq.magnitude)}`} />
                <span className={`font-mono text-lg font-bold ${getMagnitudeColor(eq.magnitude)}`}>
                  M{eq.magnitude.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(eq.time).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="text-sm text-gray-300 mb-1">{eq.place}</div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="font-mono">
                  {eq.coordinates[1].toFixed(2)}°, {eq.coordinates[0].toFixed(2)}°
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{eq.coordinates[2].toFixed(1)} km depth</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
