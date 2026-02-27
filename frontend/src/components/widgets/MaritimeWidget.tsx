import { useState, useEffect } from 'react';
import { Ship, Anchor, Navigation, MapPin, Radio, TrendingUp, TrendingDown } from 'lucide-react';

interface Vessel {
  id: string;
  name: string;
  type: string;
  callsign: string;
  speed: number;
  heading: number;
  lat: number;
  lng: number;
  destination: string;
  status: 'underway' | 'anchored' | 'moored' | 'unknown';
}

export function MaritimeWidget() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [stats, setStats] = useState({ total: 0, cargo: 0, tanker: 0, passenger: 0 });

  useEffect(() => {
    const generateVessels = (): Vessel[] => [
      {
        id: 'v1',
        name: 'EVER GIVEN',
        type: 'Container Ship',
        callsign: 'H3RC',
        speed: 12.5,
        heading: 89,
        lat: 31.25,
        lng: 32.35,
        destination: 'Singapore',
        status: 'underway',
      },
      {
        id: 'v2',
        name: 'MAERSK HORSBURGH',
        type: 'Container Ship',
        callsign: 'OWYH2',
        speed: 18.2,
        heading: 245,
        lat: 35.67,
        lng: 139.85,
        destination: 'Los Angeles',
        status: 'underway',
      },
      {
        id: 'v3',
        name: 'STENA IMPERO',
        type: 'Tanker',
        callsign: 'V7DV',
        speed: 8.5,
        heading: 156,
        lat: 25.28,
        lng: 51.53,
        destination: 'Port Rashid',
        status: 'anchored',
      },
      {
        id: 'v4',
        name: 'QUEEN MARY 2',
        type: 'Passenger',
        callsign: 'ZCEF6',
        speed: 22.0,
        heading: 67,
        lat: 40.71,
        lng: -74.00,
        destination: 'Southampton',
        status: 'underway',
      },
      {
        id: 'v5',
        name: 'COSCO SHIPPING',
        type: 'Container Ship',
        callsign: 'VRIC',
        speed: 15.8,
        heading: 180,
        lat: -33.86,
        lng: 151.20,
        destination: 'Shanghai',
        status: 'underway',
      },
    ];

    setVessels(generateVessels());
    setStats({ total: 87432, cargo: 45231, tanker: 28456, passenger: 13745 });

    const interval = setInterval(() => {
      setVessels(prev => prev.map(v => ({
        ...v,
        speed: Math.max(0, v.speed + (Math.random() - 0.5) * 2),
        heading: (v.heading + Math.floor((Math.random() - 0.5) * 5)) % 360,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'underway': return 'text-green-400';
      case 'anchored': return 'text-yellow-400';
      case 'moored': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'underway': return <Navigation className="w-3 h-3" />;
      case 'anchored': return <Anchor className="w-3 h-3" />;
      case 'moored': return <MapPin className="w-3 h-3" />;
      default: return <Ship className="w-3 h-3" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1 mb-3">
        <div className="bg-[#1a1f2e] rounded p-1.5 text-center">
          <div className="text-[9px] text-gray-500 uppercase">Total</div>
          <div className="text-sm font-mono text-cyan-400">{(stats.total / 1000).toFixed(1)}K</div>
        </div>
        <div className="bg-[#1a1f2e] rounded p-1.5 text-center">
          <div className="text-[9px] text-gray-500 uppercase">Cargo</div>
          <div className="text-sm font-mono text-green-400">{(stats.cargo / 1000).toFixed(1)}K</div>
        </div>
        <div className="bg-[#1a1f2e] rounded p-1.5 text-center">
          <div className="text-[9px] text-gray-500 uppercase">Tanker</div>
          <div className="text-sm font-mono text-orange-400">{(stats.tanker / 1000).toFixed(1)}K</div>
        </div>
        <div className="bg-[#1a1f2e] rounded p-1.5 text-center">
          <div className="text-[9px] text-gray-500 uppercase">Passenger</div>
          <div className="text-sm font-mono text-purple-400">{(stats.passenger / 1000).toFixed(1)}K</div>
        </div>
      </div>

      {/* Vessels List */}
      <div className="flex-1 overflow-hidden">
        <div className="space-y-1">
          {vessels.map((vessel) => (
            <div
              key={vessel.id}
              className="flex items-center justify-between p-2 bg-[#1a1f2e] rounded hover:bg-[#252b3d] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={`${getStatusColor(vessel.status)}`}>
                  {getStatusIcon(vessel.status)}
                </div>
                <div>
                  <div className="text-xs text-gray-300 font-medium">{vessel.name}</div>
                  <div className="text-[10px] text-gray-500">{vessel.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Radio className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400">{vessel.callsign}</span>
                </div>
                <div className="text-[10px] text-gray-500 flex items-center gap-2 justify-end">
                  <span className="flex items-center gap-0.5">
                    {vessel.speed > 15 ? <TrendingUp className="w-3 h-3 text-green-400" /> : <TrendingDown className="w-3 h-3 text-yellow-400" />}
                    {vessel.speed.toFixed(1)} kn
                  </span>
                  <span>HDG {vessel.heading}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>AIS Maritime Tracking</span>
          <span className="text-cyan-400">● Live Vessel Data</span>
        </div>
      </div>
    </div>
  );
}
