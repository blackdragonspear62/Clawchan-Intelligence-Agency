import { useEffect, useState } from 'react';
import { 
  Globe, 
  Plane, 
  Satellite, 
  Ship, 
  Radio, 
  Activity, 
  TrendingUp, 
  Cloud,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface SystemStatus {
  module: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
  lastUpdate: number;
}

const generateSystemStatus = (): SystemStatus[] => [
  { module: 'ADS-B Network', status: 'online', latency: 45, lastUpdate: Date.now() },
  { module: 'Satellite Tracking', status: 'online', latency: 120, lastUpdate: Date.now() },
  { module: 'Maritime AIS', status: 'online', latency: 89, lastUpdate: Date.now() },
  { module: 'SIGINT Collection', status: 'online', latency: 23, lastUpdate: Date.now() },
  { module: 'Geophysical Monitor', status: 'online', latency: 567, lastUpdate: Date.now() },
  { module: 'Financial Intel', status: 'online', latency: 12, lastUpdate: Date.now() },
  { module: 'Weather Systems', status: 'online', latency: 234, lastUpdate: Date.now() },
  { module: 'Broadcast Intel', status: 'online', latency: 78, lastUpdate: Date.now() },
  { module: 'Security Operations', status: 'online', latency: 34, lastUpdate: Date.now() },
];

export function GlobalIntelPanel() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [stats, setStats] = useState({
    aircraft: 0,
    satellites: 0,
    vessels: 0,
    signals: 0,
    earthquakes: 0,
    threats: 0,
  });

  useEffect(() => {
    setSystemStatus(generateSystemStatus());
    
    // Simulate stats
    setStats({
      aircraft: 8472,
      satellites: 4856,
      vessels: 52341,
      signals: 1247,
      earthquakes: 156,
      threats: 3,
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-3 space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded p-3 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Plane className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400 text-xs">Aircraft</span>
          </div>
          <div className="text-2xl font-mono text-white">{stats.aircraft.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded p-3 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Satellite className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-xs">Satellites</span>
          </div>
          <div className="text-2xl font-mono text-white">{stats.satellites.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded p-3 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Ship className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-xs">Vessels</span>
          </div>
          <div className="text-2xl font-mono text-white">{stats.vessels.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded p-3 border border-orange-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-orange-400" />
            <span className="text-gray-400 text-xs">Signals</span>
          </div>
          <div className="text-2xl font-mono text-white">{stats.signals.toLocaleString()}</div>
        </div>
      </div>

      {/* System Status */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">System Status</div>
        <div className="space-y-1">
          {systemStatus.map((system) => (
            <div 
              key={system.module}
              className="flex items-center justify-between p-2 bg-[#1c2128] rounded border border-gray-800"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(system.status)} animate-pulse`} />
                <span className="text-sm text-gray-300">{system.module}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-mono">{system.latency}ms</span>
                <span className={`text-xs ${getStatusColor(system.status)}`}>
                  {system.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      {stats.threats > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">Active Alerts</span>
          </div>
          <div className="text-sm text-gray-300">
            {stats.threats} security events require attention
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Intelligence Modules</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Activity, label: 'Geo', color: 'text-red-400' },
            { icon: TrendingUp, label: 'Finance', color: 'text-green-400' },
            { icon: Cloud, label: 'Weather', color: 'text-blue-400' },
            { icon: Shield, label: 'Security', color: 'text-orange-400' },
            { icon: Globe, label: 'Global', color: 'text-cyan-400' },
            { icon: Radio, label: 'SIGINT', color: 'text-purple-400' },
          ].map((item) => (
            <div 
              key={item.label}
              className="flex flex-col items-center gap-1 p-2 bg-[#1c2128] rounded border border-gray-800 hover:border-gray-600 cursor-pointer transition-colors"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
