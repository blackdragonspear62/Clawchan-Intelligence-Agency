import { useEffect, useState } from 'react';
import { 
  Wifi, 
  Server, 
  Database, 
  Cpu, 
  HardDrive,
  Activity,
  Clock,
  Zap,
  Globe,
  Shield
} from 'lucide-react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  activeConnections: number;
  dataRate: number;
  apiLatency: number;
  uptime: number;
}

interface DataSource {
  name: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
}

export function StatusBar() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    activeConnections: 0,
    dataRate: 0,
    apiLatency: 0,
    uptime: 0,
  });

  const [dataSources, setDataSources] = useState<DataSource[]>([
    { name: 'USGS', status: 'online', latency: 42 },
    { name: 'NASA', status: 'online', latency: 67 },
    { name: 'ADS-B', status: 'online', latency: 89 },
    { name: 'N2YO', status: 'online', latency: 123 },
    { name: 'CoinGecko', status: 'online', latency: 156 },
  ]);

  useEffect(() => {
    const startTime = Date.now();
    
    const updateMetrics = () => {
      setMetrics({
        cpu: 15 + Math.random() * 30,
        memory: 40 + Math.random() * 20,
        disk: 35 + Math.random() * 10,
        network: 50 + Math.random() * 100,
        activeConnections: 1247 + Math.floor(Math.random() * 100),
        dataRate: 45 + Math.random() * 20,
        apiLatency: 30 + Math.floor(Math.random() * 50),
        uptime: Date.now() - startTime,
      });

      // Randomly update data source latencies
      setDataSources(prev => prev.map(ds => ({
        ...ds,
        latency: Math.max(20, ds.latency + Math.floor((Math.random() - 0.5) * 20)),
      })));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="h-7 bg-[#0d1117] border-t border-gray-800 flex items-center justify-between px-3 text-[10px] shrink-0">
      {/* Left Section - Data Sources */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="text-gray-500 font-medium">SOURCES:</span>
        </div>
        
        <div className="flex items-center gap-3">
          {dataSources.map((source) => (
            <div key={source.name} className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${
                source.status === 'online' ? 'bg-green-400' : 
                source.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              <span className="text-gray-400">{source.name}</span>
              <span className="text-gray-600 font-mono">{source.latency}ms</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center Section - System Status */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Server className="w-3 h-3 text-blue-400" />
          <span className="text-gray-500">API:</span>
          <span className="text-green-400 font-medium">ONLINE</span>
          <span className="text-gray-600 font-mono">{metrics.apiLatency}ms</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Database className="w-3 h-3 text-purple-400" />
          <span className="text-gray-500">DB:</span>
          <span className="text-green-400 font-medium">CONNECTED</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-cyan-400" />
          <span className="text-gray-500">WS:</span>
          <span className="text-cyan-400 font-mono">{metrics.activeConnections.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-green-400" />
          <span className="text-gray-500">SEC:</span>
          <span className="text-green-400 font-medium">ACTIVE</span>
        </div>
      </div>

      {/* Right Section - Performance Metrics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-yellow-400" />
          <span className="text-gray-500">CPU:</span>
          <span className="text-cyan-400 font-mono">{metrics.cpu.toFixed(1)}%</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-green-400" />
          <span className="text-gray-500">MEM:</span>
          <span className="text-cyan-400 font-mono">{metrics.memory.toFixed(1)}%</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3 h-3 text-orange-400" />
          <span className="text-gray-500">DISK:</span>
          <span className="text-cyan-400 font-mono">{metrics.disk.toFixed(1)}%</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-purple-400" />
          <span className="text-gray-500">DATA:</span>
          <span className="text-cyan-400 font-mono">{metrics.dataRate.toFixed(1)} MB/s</span>
        </div>

        <div className="flex items-center gap-1.5 border-l border-gray-700 pl-4">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-gray-500">UP:</span>
          <span className="text-green-400 font-mono">{formatUptime(metrics.uptime)}</span>
        </div>
      </div>
    </div>
  );
}
