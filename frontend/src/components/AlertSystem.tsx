import { useState } from 'react';
import { X, AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
}

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export function AlertSystem({ alerts, onDismiss }: AlertSystemProps) {
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/50 text-red-400';
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/50 text-orange-400';
      case 'success':
        return 'bg-green-500/10 border-green-500/50 text-green-400';
      default:
        return 'bg-blue-500/10 border-blue-500/50 text-blue-400';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="bg-[#0d1117] border-b border-gray-800 p-2 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start gap-3 p-3 rounded border ${getAlertStyles(alert.type)}`}
        >
          {getAlertIcon(alert.type)}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{alert.title}</div>
            <div className="text-sm opacity-80 truncate">{alert.message}</div>
          </div>
          <button
            onClick={() => onDismiss(alert.id)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
