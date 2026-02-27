import { useEffect } from 'react';
import { useAircraft } from '../../hooks/useAircraft';
import { useDashboardStore } from '../../store/dashboardStore';
import { Plane, Navigation, Gauge, ArrowUp } from 'lucide-react';

export function AircraftPanel() {
  const { aircraft, isLoading, error } = useAircraft();
  const { setAircraft } = useDashboardStore();

  useEffect(() => {
    setAircraft(aircraft);
  }, [aircraft, setAircraft]);

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Acquiring ADS-B signals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-400 text-sm">Signal acquisition failed</p>
        <p className="text-gray-500 text-xs mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Total Tracked</div>
          <div className="text-2xl font-mono text-cyan-400">{aircraft.length}</div>
        </div>
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Update Rate</div>
          <div className="text-2xl font-mono text-green-400">1s</div>
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-auto">
        {aircraft.slice(0, 50).map((ac) => (
          <div 
            key={ac.icao24}
            className="bg-[#1c2128] rounded p-3 border border-gray-800 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-sm text-white">{ac.callsign || 'N/A'}</span>
              </div>
              <span className="text-xs text-gray-500 font-mono">{ac.icao24.toUpperCase()}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Navigation className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{ac.heading?.toFixed(0) || 0}°</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{((ac.velocity || 0) * 1.94384).toFixed(0)} kts</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{((ac.altitude || 0) * 3.28084).toFixed(0)} ft</span>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 font-mono">
              {ac.latitude?.toFixed(4)}, {ac.longitude?.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
