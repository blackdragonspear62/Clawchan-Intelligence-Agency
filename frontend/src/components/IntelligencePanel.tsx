import { useDashboardStore } from '../store/dashboardStore';
import { AircraftPanel } from './panels/AircraftPanel';
import { SatellitePanel } from './panels/SatellitePanel';
import { GeophysicalPanel } from './panels/GeophysicalPanel';
import { FinancialPanel } from './panels/FinancialPanel';
import { WeatherPanel } from './panels/WeatherPanel';
import { BroadcastPanel } from './panels/BroadcastPanel';
import { MaritimePanel } from './panels/MaritimePanel';
import { SigintPanel } from './panels/SigintPanel';
import { SecurityPanel } from './panels/SecurityPanel';
import { GlobalIntelPanel } from './panels/GlobalIntelPanel';

export function IntelligencePanel() {
  const { selectedModule } = useDashboardStore();

  const renderPanel = () => {
    switch (selectedModule) {
      case 'aircraft':
        return <AircraftPanel />;
      case 'satellite':
        return <SatellitePanel />;
      case 'geophysical':
        return <GeophysicalPanel />;
      case 'financial':
        return <FinancialPanel />;
      case 'weather':
        return <WeatherPanel />;
      case 'broadcast':
        return <BroadcastPanel />;
      case 'maritime':
        return <MaritimePanel />;
      case 'sigint':
        return <SigintPanel />;
      case 'security':
        return <SecurityPanel />;
      case 'globe':
      default:
        return <GlobalIntelPanel />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-cyan-500/20 bg-[#161b22]">
        <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
          {selectedModule.replace('_', ' ')} Intelligence
        </h2>
      </div>
      <div className="flex-1 overflow-auto">
        {renderPanel()}
      </div>
    </div>
  );
}
