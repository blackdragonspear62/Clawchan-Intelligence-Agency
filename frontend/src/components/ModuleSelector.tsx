import { useDashboardStore, IntelligenceModule } from '../store/dashboardStore';
import { 
  Globe, 
  Plane, 
  Satellite, 
  Ship, 
  Radio, 
  Activity, 
  TrendingUp, 
  Cloud,
  Tv,
  Shield
} from 'lucide-react';

const modules: { id: IntelligenceModule; label: string; icon: React.ElementType }[] = [
  { id: 'globe', label: 'Global Intel', icon: Globe },
  { id: 'aircraft', label: 'ADS-B Track', icon: Plane },
  { id: 'satellite', label: 'Satellites', icon: Satellite },
  { id: 'maritime', label: 'Maritime', icon: Ship },
  { id: 'sigint', label: 'SIGINT', icon: Radio },
  { id: 'geophysical', label: 'Geo Events', icon: Activity },
  { id: 'financial', label: 'Financial', icon: TrendingUp },
  { id: 'weather', label: 'Weather', icon: Cloud },
  { id: 'broadcast', label: 'Live TV', icon: Tv },
  { id: 'security', label: 'Security', icon: Shield },
];

export function ModuleSelector() {
  const { selectedModule, setModule } = useDashboardStore();

  return (
    <div className="flex items-center gap-1">
      {modules.map((mod) => {
        const Icon = mod.icon;
        const isActive = selectedModule === mod.id;
        
        return (
          <button
            key={mod.id}
            onClick={() => setModule(mod.id)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200
              ${isActive 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{mod.label}</span>
          </button>
        );
      })}
    </div>
  );
}
