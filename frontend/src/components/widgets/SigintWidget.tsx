import { useState, useEffect } from 'react';
import { Radio, Signal, Wifi, Satellite, Mic, Headphones, Zap, Activity } from 'lucide-react';

interface SignalData {
  id: string;
  frequency: number;
  bandwidth: number;
  modulation: string;
  strength: number;
  classification: string;
  source: string;
  encrypted: boolean;
}

interface Intercept {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  confidence: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export function SigintWidget() {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [intercepts, setIntercepts] = useState<Intercept[]>([]);
  const [activeFreq, setActiveFreq] = useState(0);

  useEffect(() => {
    const generateSignals = (): SignalData[] => [
      { id: 's1', frequency: 142.500, bandwidth: 12.5, modulation: 'FM', strength: -67, classification: 'Commercial', source: 'Cell Tower A', encrypted: false },
      { id: 's2', frequency: 446.000, bandwidth: 25.0, modulation: 'FM', strength: -82, classification: 'Military', source: 'Unknown', encrypted: true },
      { id: 's3', frequency: 121.500, bandwidth: 25.0, modulation: 'AM', strength: -45, classification: 'Aviation', source: 'ATC Tower', encrypted: false },
      { id: 's4', frequency: 157.425, bandwidth: 12.5, modulation: 'FM', strength: -73, classification: 'Maritime', source: 'Coast Guard', encrypted: false },
      { id: 's5', frequency: 243.000, bandwidth: 50.0, modulation: 'AM', strength: -91, classification: 'Military', source: 'Encrypted', encrypted: true },
    ];

    const generateIntercepts = (): Intercept[] => [
      { id: 'i1', timestamp: new Date(Date.now() - 120000).toISOString(), source: 'SAT-INT-42', type: 'Voice Comms', confidence: 87, priority: 'high' },
      { id: 'i2', timestamp: new Date(Date.now() - 480000).toISOString(), source: 'ELINT-07', type: 'Radar Signal', confidence: 94, priority: 'medium' },
      { id: 'i3', timestamp: new Date(Date.now() - 900000).toISOString(), source: 'COMINT-15', type: 'Data Transmission', confidence: 76, priority: 'critical' },
    ];

    setSignals(generateSignals());
    setIntercepts(generateIntercepts());
    setActiveFreq(142.500);

    const interval = setInterval(() => {
      setSignals(prev => prev.map(s => ({
        ...s,
        strength: Math.min(-30, Math.max(-100, s.strength + (Math.random() - 0.5) * 5)),
      })));
      setActiveFreq(140 + Math.random() * 120);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStrengthColor = (strength: number) => {
    if (strength > -50) return 'text-green-400';
    if (strength > -70) return 'text-yellow-400';
    if (strength > -85) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStrengthBars = (strength: number) => {
    const bars = strength > -50 ? 4 : strength > -70 ? 3 : strength > -85 ? 2 : 1;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`w-1 h-3 rounded-sm ${i <= bars ? getStrengthColor(strength) : 'bg-gray-700'}`}
          />
        ))}
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default: return 'text-green-400 bg-green-400/10 border-green-400/30';
    }
  };

  const formatTime = (time: string) => {
    const diff = Date.now() - new Date(time).getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Frequency Display */}
      <div className="bg-[#1a1f2e] rounded p-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] text-gray-500 uppercase">Active Frequency</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-green-400 animate-pulse" />
            <span className="text-xs text-green-400">SCANNING</span>
          </div>
        </div>
        <div className="text-2xl font-mono text-cyan-400 mt-1">
          {activeFreq.toFixed(3)} <span className="text-sm text-gray-500">MHz</span>
        </div>
        <div className="flex gap-1 mt-2">
          {signals.map((s, i) => (
            <div
              key={s.id}
              className="flex-1 h-6 bg-[#252b3d] rounded overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-t from-cyan-500/50 to-cyan-400"
                style={{ height: `${Math.max(10, 100 + s.strength)}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Signals List */}
      <div className="flex-1 overflow-hidden mb-2">
        <div className="text-[10px] text-gray-500 uppercase mb-1 flex items-center gap-1">
          <Signal className="w-3 h-3" />
          Detected Signals
        </div>
        <div className="space-y-1">
          {signals.slice(0, 4).map((signal) => (
            <div
              key={signal.id}
              className="flex items-center justify-between p-1.5 bg-[#1a1f2e] rounded"
            >
              <div className="flex items-center gap-2">
                {signal.encrypted ? <Zap className="w-3 h-3 text-red-400" /> : <Wifi className="w-3 h-3 text-cyan-400" />}
                <div>
                  <div className="text-[10px] text-gray-300 font-mono">{signal.frequency.toFixed(3)} MHz</div>
                  <div className="text-[9px] text-gray-500">{signal.modulation} | {signal.classification}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStrengthBars(signal.strength)}
                <span className={`text-[10px] font-mono ${getStrengthColor(signal.strength)}`}>
                  {signal.strength} dBm
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intercepts */}
      <div className="border-t border-gray-800 pt-2">
        <div className="text-[10px] text-gray-500 uppercase mb-1 flex items-center gap-1">
          <Mic className="w-3 h-3" />
          Recent Intercepts
        </div>
        <div className="space-y-1">
          {intercepts.map((intercept) => (
            <div
              key={intercept.id}
              className="flex items-center justify-between p-1.5 bg-[#1a1f2e] rounded"
            >
              <div className="flex items-center gap-2">
                <Headphones className="w-3 h-3 text-purple-400" />
                <div>
                  <div className="text-[10px] text-gray-300">{intercept.type}</div>
                  <div className="text-[9px] text-gray-500">{intercept.source}</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${getPriorityColor(intercept.priority)}`}>
                  {intercept.priority}
                </span>
                <div className="text-[9px] text-gray-500">{formatTime(intercept.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <Satellite className="w-3 h-3" />
            SIGINT Collection Active
          </span>
          <span className="text-cyan-400">5 Signals Detected</span>
        </div>
      </div>
    </div>
  );
}
