import { useEffect } from 'react';
import { useSatellites } from '../../hooks/useSatellites';
import { useDashboardStore } from '../../store/dashboardStore';
import { Satellite, Orbit, Radio, Globe } from 'lucide-react';

export function SatellitePanel() {
  const { satellites, isLoading, error } = useSatellites();
  const { setSatellites } = useDashboardStore();

  useEffect(() => {
    setSatellites(satellites);
  }, [satellites, setSatellites]);

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Connecting to tracking stations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-400 text-sm">Tracking station offline</p>
        <p className="text-gray-500 text-xs mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Active Satellites</div>
          <div className="text-2xl font-mono text-purple-400">{satellites.length}</div>
        </div>
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Orbital Regimes</div>
          <div className="text-2xl font-mono text-blue-400">3</div>
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-auto">
        {satellites.map((sat) => (
          <div 
            key={sat.noradId}
            className="bg-[#1c2128] rounded p-3 border border-gray-800 hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-sm text-white truncate max-w-[150px]">{sat.name}</span>
              </div>
              <span className="text-xs text-gray-500 font-mono">{sat.noradId}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Orbit className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{(sat.altitude / 1000).toFixed(1)} km</span>
              </div>
              <div className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{sat.velocity?.toFixed(1) || 0} km/s</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <Globe className="w-3 h-3" />
              <span className="font-mono">
                {sat.latitude?.toFixed(2)}°, {sat.longitude?.toFixed(2)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
