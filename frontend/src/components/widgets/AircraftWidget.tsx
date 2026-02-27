import { useState, useEffect } from 'react';
import { Plane, Navigation, TrendingUp, TrendingDown, Radio } from 'lucide-react';

interface Aircraft {
  id: string;
  callsign: string;
  icao24: string;
  altitude: number;
  speed: number;
  heading: number;
  lat: number;
  lng: number;
  origin: string;
  destination: string;
}

export function AircraftWidget() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const generateAircraft = (): Aircraft[] => [
      { id: 'a1', callsign: 'UAL842', icao24: 'A1B2C3', altitude: 35000, speed: 485, heading: 85, lat: 40.71, lng: -74.00, origin: 'JFK', destination: 'LHR' },
      { id: 'a2', callsign: 'BAW117', icao24: 'D4E5F6', altitude: 38000, speed: 512, heading: 270, lat: 51.47, lng: -0.45, origin: 'LHR', destination: 'JFK' },
      { id: 'a3', callsign: 'AFR023', icao24: 'G7H8I9', altitude: 32000, speed: 460, heading: 45, lat: 49.01, lng: 2.55, origin: 'CDG', destination: 'NRT' },
      { id: 'a4', callsign: 'DLH456', icao24: 'J0K1L2', altitude: 36000, speed: 495, heading: 120, lat: 50.04, lng: 8.57, origin: 'FRA', destination: 'SIN' },
      { id: 'a5', callsign: 'QFA1', icao24: 'M3N4O5', altitude: 40000, speed: 530, heading: 180, lat: -33.94, lng: 151.18, origin: 'SYD', destination: 'LHR' },
    ];

    setAircraft(generateAircraft());
    setTotalCount(8742);

    const interval = setInterval(() => {
      setAircraft(prev => prev.map(a => ({
        ...a,
        altitude: a.altitude + Math.floor((Math.random() - 0.5) * 100),
        speed: Math.max(200, a.speed + Math.floor((Math.random() - 0.5) * 20)),
        heading: (a.heading + Math.floor((Math.random() - 0.5) * 5)) % 360,
      })));
      setTotalCount(prev => prev + Math.floor(Math.random() * 10) - 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-gray-400">ADS-B Tracking</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-mono text-cyan-400">{totalCount.toLocaleString()}</div>
          <div className="text-[10px] text-gray-500">Active Aircraft</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="space-y-1">
          {aircraft.map((ac) => (
            <div
              key={ac.id}
              className="flex items-center justify-between p-2 bg-[#1a1f2e] rounded hover:bg-[#252b3d] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-500/10 rounded flex items-center justify-center">
                  <Plane className="w-4 h-4 text-cyan-400" style={{ transform: `rotate(${ac.heading}deg)` }} />
                </div>
                <div>
                  <div className="text-xs text-gray-300 font-medium">{ac.callsign}</div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Radio className="w-3 h-3" />
                    {ac.icao24}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-cyan-400">{ac.altitude.toLocaleString()} ft</div>
                <div className="text-[10px] text-gray-500 flex items-center gap-2 justify-end">
                  <span className="flex items-center gap-0.5">
                    {ac.speed > 500 ? <TrendingUp className="w-3 h-3 text-green-400" /> : <TrendingDown className="w-3 h-3 text-yellow-400" />}
                    {ac.speed} kts
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Navigation className="w-3 h-3" />
                    {ac.heading}°
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>Source: ADS-B Exchange</span>
          <span className="text-cyan-400">● Real-time</span>
        </div>
      </div>
    </div>
  );
}
