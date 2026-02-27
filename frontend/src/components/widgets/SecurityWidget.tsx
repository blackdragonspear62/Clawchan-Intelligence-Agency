import { useState, useEffect } from 'react';
import { Shield, AlertOctagon, Eye, Lock, Unlock, Globe, Server } from 'lucide-react';

interface Threat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  timestamp: string;
  status: 'active' | 'mitigated' | 'investigating';
}

export function SecurityWidget() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [stats, setStats] = useState({ blocked: 0, monitored: 0, active: 0 });

  useEffect(() => {
    const generateThreats = (): Threat[] => [
      {
        id: 'threat-1',
        type: 'DDoS Attack',
        severity: 'high',
        source: 'Unknown Botnet',
        target: 'Financial Sector',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'mitigated',
      },
      {
        id: 'threat-2',
        type: 'Phishing Campaign',
        severity: 'medium',
        source: 'APT Group',
        target: 'Government Email',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'investigating',
      },
      {
        id: 'threat-3',
        type: 'Malware Injection',
        severity: 'critical',
        source: 'State Actor',
        target: 'Critical Infrastructure',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'active',
      },
      {
        id: 'threat-4',
        type: 'Data Exfiltration',
        severity: 'high',
        source: 'Insider Threat',
        target: 'Corporate Network',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'investigating',
      },
      {
        id: 'threat-5',
        type: 'Ransomware',
        severity: 'medium',
        source: 'Cybercriminal Group',
        target: 'Healthcare System',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'mitigated',
      },
    ];

    setThreats(generateThreats());
    setStats({ blocked: 15432, monitored: 8921, active: 3 });

    const interval = setInterval(() => {
      setStats(prev => ({
        blocked: prev.blocked + Math.floor(Math.random() * 50),
        monitored: prev.monitored + Math.floor(Math.random() * 20),
        active: Math.max(0, prev.active + Math.floor(Math.random() * 3) - 1),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default: return 'text-green-400 bg-green-400/10 border-green-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertOctagon className="w-3 h-3 text-red-400" />;
      case 'mitigated': return <Lock className="w-3 h-3 text-green-400" />;
      case 'investigating': return <Eye className="w-3 h-3 text-yellow-400" />;
      default: return <Unlock className="w-3 h-3 text-gray-400" />;
    }
  };

  const formatTime = (time: string) => {
    const diff = Date.now() - new Date(time).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#1a1f2e] rounded p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="w-3 h-3 text-green-400" />
            <span className="text-[10px] text-gray-500 uppercase">Blocked</span>
          </div>
          <div className="text-lg font-mono text-green-400">{stats.blocked.toLocaleString()}</div>
        </div>
        <div className="bg-[#1a1f2e] rounded p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] text-gray-500 uppercase">Monitored</span>
          </div>
          <div className="text-lg font-mono text-cyan-400">{stats.monitored.toLocaleString()}</div>
        </div>
        <div className="bg-[#1a1f2e] rounded p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertOctagon className="w-3 h-3 text-red-400" />
            <span className="text-[10px] text-gray-500 uppercase">Active</span>
          </div>
          <div className="text-lg font-mono text-red-400">{stats.active}</div>
        </div>
      </div>

      {/* Threats List */}
      <div className="flex-1 overflow-hidden">
        <div className="space-y-1">
          {threats.map((threat) => (
            <div
              key={threat.id}
              className="flex items-center justify-between p-2 bg-[#1a1f2e] rounded hover:bg-[#252b3d] transition-colors"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(threat.status)}
                <div>
                  <div className="text-xs text-gray-300">{threat.type}</div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {threat.source}
                    <span className="text-gray-600">→</span>
                    <Server className="w-3 h-3" />
                    {threat.target}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getSeverityColor(threat.severity)}`}>
                  {threat.severity.toUpperCase()}
                </span>
                <div className="text-[10px] text-gray-500 mt-1">{formatTime(threat.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>Cyber Threat Intelligence Feed</span>
          <span className="text-green-400">● Real-time Protection Active</span>
        </div>
      </div>
    </div>
  );
}
