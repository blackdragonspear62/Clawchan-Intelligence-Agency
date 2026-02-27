import { useEffect, useState } from 'react';
import { Shield, Lock, Unlock, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'intrusion' | 'firewall' | 'auth' | 'malware' | 'anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  source: string;
  timestamp: number;
  status: 'active' | 'resolved' | 'investigating';
}

const generateSecurityEvents = (): SecurityEvent[] => {
  const types: Array<'intrusion' | 'firewall' | 'auth' | 'malware' | 'anomaly'> = ['intrusion', 'firewall', 'auth', 'malware', 'anomaly'];
  const severities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low', 'low', 'medium'];
  const statuses: Array<'active' | 'resolved' | 'investigating'> = ['active', 'resolved', 'resolved', 'investigating'];
  
  const messages = [
    'Suspicious login attempt detected',
    'Port scan from external IP',
    'Malware signature detected',
    'Unusual data exfiltration pattern',
    'Brute force attack blocked',
    'Privilege escalation attempt',
    'DDoS attack mitigated',
    'Unauthorized API access',
    'Certificate expiration warning',
    'Firewall rule triggered',
  ];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: `SEC-${10000 + i}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    source: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    timestamp: Date.now() - Math.random() * 86400000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  })).sort((a, b) => b.timestamp - a.timestamp);
};

export function SecurityPanel() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('all');

  useEffect(() => {
    setEvents(generateSecurityEvents());
    setIsLoading(false);
    
    const interval = setInterval(() => {
      setEvents(generateSecurityEvents());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'active') return event.status === 'active';
    if (filter === 'critical') return event.severity === 'critical' || event.severity === 'high';
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      default: return 'text-blue-500 bg-blue-500/20 border-blue-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Eye className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'intrusion':
        return <Unlock className="w-4 h-4 text-red-400" />;
      case 'firewall':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'auth':
        return <Lock className="w-4 h-4 text-green-400" />;
      case 'malware':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <Eye className="w-4 h-4 text-purple-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Analyzing security logs...</p>
      </div>
    );
  }

  const activeThreats = events.filter(e => e.status === 'active').length;
  const criticalCount = events.filter(e => e.severity === 'critical' || e.severity === 'high').length;

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Active Threats</div>
          <div className={`text-2xl font-mono ${activeThreats > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {activeThreats}
          </div>
        </div>
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Critical/High</div>
          <div className={`text-2xl font-mono ${criticalCount > 0 ? 'text-orange-400' : 'text-green-400'}`}>
            {criticalCount}
          </div>
        </div>
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">24h Events</div>
          <div className="text-2xl font-mono text-blue-400">{events.length}</div>
        </div>
      </div>

      <div className="flex gap-1 overflow-auto pb-1">
        {(['all', 'active', 'critical'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                : 'bg-[#1c2128] text-gray-400 border border-gray-800 hover:border-gray-600'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-[calc(100vh-340px)] overflow-auto">
        {filteredEvents.map((event) => (
          <div 
            key={event.id}
            className={`rounded p-3 border transition-colors ${getSeverityColor(event.severity)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(event.type)}
                <span className="font-mono text-sm text-white">{event.id}</span>
              </div>
              {getStatusIcon(event.status)}
            </div>
            
            <div className="text-sm text-gray-200 mb-2">{event.message}</div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono">{event.source}</span>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${
                event.status === 'active' ? 'bg-red-500/30 text-red-400' :
                event.status === 'resolved' ? 'bg-green-500/30 text-green-400' :
                'bg-yellow-500/30 text-yellow-400'
              }`}>
                {event.status.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500 uppercase">{event.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
