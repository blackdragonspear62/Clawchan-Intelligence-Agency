import { useEffect, useState } from 'react';
import { Radio, Signal, Wifi, Shield, AlertCircle } from 'lucide-react';

interface SignalData {
  id: string;
  frequency: number;
  bandwidth: number;
  signalType: string;
  modulation: string;
  snr: number;
  location: { lat: number; lon: number };
  timestamp: number;
  classification: 'civilian' | 'military' | 'unknown' | 'suspicious';
}

const generateSignals = (): SignalData[] => {
  const signalTypes = ['FM Broadcast', 'AM Broadcast', 'Digital TV', 'Cellular', 'WiFi', 'Radar', 'Satellite', 'Military'];
  const modulations = ['FM', 'AM', 'QAM', 'PSK', 'FSK', 'OFDM', 'Unknown'];
  const classifications: Array<'civilian' | 'military' | 'unknown' | 'suspicious'> = ['civilian', 'civilian', 'civilian', 'military', 'unknown', 'suspicious'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `SIG-${1000 + i}`,
    frequency: 88 + Math.random() * 900, // MHz
    bandwidth: 0.1 + Math.random() * 20, // MHz
    signalType: signalTypes[Math.floor(Math.random() * signalTypes.length)],
    modulation: modulations[Math.floor(Math.random() * modulations.length)],
    snr: 10 + Math.random() * 40, // dB
    location: {
      lat: (Math.random() - 0.5) * 180,
      lon: (Math.random() - 0.5) * 360,
    },
    timestamp: Date.now() - Math.random() * 3600000,
    classification: classifications[Math.floor(Math.random() * classifications.length)],
  }));
};

export function SigintPanel() {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBand, setSelectedBand] = useState<'all' | 'hf' | 'vhf' | 'uhf' | 'shf'>('all');

  useEffect(() => {
    setSignals(generateSignals());
    setIsLoading(false);
    
    const interval = setInterval(() => {
      setSignals(generateSignals());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredSignals = signals.filter(sig => {
    if (selectedBand === 'all') return true;
    if (selectedBand === 'hf') return sig.frequency >= 3 && sig.frequency < 30;
    if (selectedBand === 'vhf') return sig.frequency >= 30 && sig.frequency < 300;
    if (selectedBand === 'uhf') return sig.frequency >= 300 && sig.frequency < 3000;
    if (selectedBand === 'shf') return sig.frequency >= 3000;
    return true;
  });

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'military': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'suspicious': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'unknown': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default: return 'text-green-400 bg-green-500/20 border-green-500/50';
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4 text-cyan-400" />;
      case 'military':
      case 'radar':
        return <Shield className="w-4 h-4 text-red-400" />;
      default:
        return <Radio className="w-4 h-4 text-blue-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Scanning spectrum...</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Active Signals</div>
          <div className="text-2xl font-mono text-purple-400">{filteredSignals.length}</div>
        </div>
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Suspicious</div>
          <div className="text-2xl font-mono text-orange-400">
            {signals.filter(s => s.classification === 'suspicious').length}
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-auto pb-1">
        {(['all', 'hf', 'vhf', 'uhf', 'shf'] as const).map((band) => (
          <button
            key={band}
            onClick={() => setSelectedBand(band)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              selectedBand === band
                ? 'bg-purple-500/30 text-purple-400 border border-purple-500/50'
                : 'bg-[#1c2128] text-gray-400 border border-gray-800 hover:border-gray-600'
            }`}
          >
            {band.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-[calc(100vh-340px)] overflow-auto">
        {filteredSignals.map((signal) => (
          <div 
            key={signal.id}
            className={`rounded p-3 border transition-colors ${getClassificationColor(signal.classification)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getSignalIcon(signal.signalType)}
                <span className="font-mono text-sm text-white">{signal.id}</span>
              </div>
              <span className="text-xs uppercase">{signal.classification}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div className="flex items-center gap-1">
                <Signal className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300 font-mono">{signal.frequency.toFixed(2)} MHz</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300">{signal.bandwidth.toFixed(2)} MHz</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{signal.signalType}</span>
              <span className="text-gray-500">SNR: {signal.snr.toFixed(1)} dB</span>
            </div>
            
            {signal.classification === 'suspicious' && (
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-400">
                <AlertCircle className="w-3 h-3" />
                <span>Anomalous pattern detected</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
