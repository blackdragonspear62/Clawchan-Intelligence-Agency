import { useEffect, useState } from 'react';
import { Ship, Anchor, Navigation, Radio } from 'lucide-react';

interface Vessel {
  mmsi: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  destination: string;
  flag: string;
}

// Simulated maritime data
const generateVessels = (): Vessel[] => {
  const vesselTypes = ['Cargo', 'Tanker', 'Passenger', 'Fishing', 'Military', 'Yacht'];
  const flags = ['🇺🇸 USA', '🇨🇳 China', '🇯🇵 Japan', '🇬🇧 UK', '🇩🇪 Germany', '🇳🇴 Norway', '🇷🇺 Russia', '🇸🇬 Singapore'];
  const destinations = ['Singapore', 'Rotterdam', 'Shanghai', 'Los Angeles', 'Dubai', 'Hamburg', 'New York', 'Tokyo'];
  
  return Array.from({ length: 40 }, (_, i) => ({
    mmsi: String(200000000 + Math.floor(Math.random() * 99999999)),
    name: `VESSEL-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${100 + i}`,
    type: vesselTypes[Math.floor(Math.random() * vesselTypes.length)],
    latitude: (Math.random() - 0.5) * 160,
    longitude: (Math.random() - 0.5) * 360,
    speed: Math.random() * 25,
    course: Math.random() * 360,
    destination: destinations[Math.floor(Math.random() * destinations.length)],
    flag: flags[Math.floor(Math.random() * flags.length)],
  }));
};

export function MaritimePanel() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setVessels(generateVessels());
    setIsLoading(false);
    
    const interval = setInterval(() => {
      setVessels(generateVessels());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getVesselIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cargo':
      case 'tanker':
        return <Ship className="w-4 h-4 text-blue-400" />;
      case 'passenger':
        return <Ship className="w-4 h-4 text-cyan-400" />;
      case 'fishing':
        return <Anchor className="w-4 h-4 text-green-400" />;
      case 'military':
        return <Ship className="w-4 h-4 text-red-400" />;
      default:
        return <Ship className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Scanning AIS transponders...</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Active Vessels</div>
          <div className="text-2xl font-mono text-blue-400">{vessels.length}</div>
        </div>
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">AIS Update</div>
          <div className="text-2xl font-mono text-cyan-400">30s</div>
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-auto">
        {vessels.map((vessel) => (
          <div 
            key={vessel.mmsi}
            className="bg-[#1c2128] rounded p-3 border border-gray-800 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getVesselIcon(vessel.type)}
                <span className="font-mono text-sm text-white">{vessel.name}</span>
              </div>
              <span className="text-xs text-gray-500">{vessel.flag}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div className="flex items-center gap-1">
                <Navigation className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{vessel.course.toFixed(0)}°</span>
              </div>
              <div className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{vessel.speed.toFixed(1)} kn</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <span className="text-gray-400">Destination:</span> {vessel.destination}
            </div>
            <div className="text-xs text-gray-600 font-mono mt-1">
              {vessel.latitude.toFixed(4)}, {vessel.longitude.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
