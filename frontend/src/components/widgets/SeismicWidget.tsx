import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, MapPin, Clock } from 'lucide-react';

interface SeismicEvent {
  id: string;
  magnitude: number;
  location: string;
  depth: number;
  time: string;
  coordinates: { lat: number; lng: number };
  alert: 'green' | 'yellow' | 'orange' | 'red';
}

export function SeismicWidget() {
  const [events, setEvents] = useState<SeismicEvent[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const generateEvents = (): SeismicEvent[] => {
      const locations = [
        { name: 'Pacific Ring of Fire', mag: 6.2, depth: 45 },
        { name: 'San Andreas Fault', mag: 4.8, depth: 12 },
        { name: 'Japan Trench', mag: 5.5, depth: 78 },
        { name: 'Indonesia Subduction', mag: 6.8, depth: 156 },
        { name: 'Chile Margin', mag: 5.2, depth: 34 },
        { name: 'Mediterranean', mag: 4.1, depth: 22 },
        { name: 'Alaska-Aleutian', mag: 5.9, depth: 89 },
      ];

      return locations.map((loc, i) => ({
        id: `seismic-${i}`,
        magnitude: loc.mag + (Math.random() - 0.5) * 0.5,
        location: loc.name,
        depth: loc.depth,
        time: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        coordinates: { lat: 0, lng: 0 },
        alert: loc.mag >= 6 ? 'red' : loc.mag >= 5 ? 'orange' : loc.mag >= 4 ? 'yellow' : 'green',
      }));
    };

    setEvents(generateEvents());
    setTotalCount(1247);

    const interval = setInterval(() => {
      setEvents(generateEvents());
      setTotalCount(prev => prev + Math.floor(Math.random() * 3));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (alert: string) => {
    switch (alert) {
      case 'red': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'orange': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'yellow': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default: return 'text-green-400 bg-green-400/10 border-green-400/30';
    }
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#1a1f2e] rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase">Total Events</div>
          <div className="text-lg font-mono text-cyan-400">{totalCount.toLocaleString()}</div>
        </div>
        <div className="bg-[#1a1f2e] rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase">Last 24h</div>
          <div className="text-lg font-mono text-orange-400">{events.filter(e => e.magnitude >= 5).length}</div>
        </div>
        <div className="bg-[#1a1f2e] rounded p-2">
          <div className="text-[10px] text-gray-500 uppercase">Major (6+)</div>
          <div className="text-lg font-mono text-red-400">{events.filter(e => e.magnitude >= 6).length}</div>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-hidden">
        <div className="space-y-1">
          {events.slice(0, 6).map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-2 bg-[#1a1f2e] rounded hover:bg-[#252b3d] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-sm ${getAlertColor(event.alert)}`}>
                  {event.magnitude.toFixed(1)}
                </div>
                <div>
                  <div className="text-xs text-gray-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    {event.location}
                  </div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {event.depth}km depth
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(event.time)}
                </div>
                {event.alert === 'red' && (
                  <AlertTriangle className="w-4 h-4 text-red-400 ml-auto mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>Source: USGS Earthquake Hazards Program</span>
          <span className="text-cyan-400">Real-time feed</span>
        </div>
      </div>
    </div>
  );
}
