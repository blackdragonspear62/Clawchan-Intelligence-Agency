import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Plane, 
  Satellite, 
  TrendingUp, 
  Bitcoin, 
  Newspaper, 
  Cloud,
  Activity,
  Shield,
  Ship,
  Radio,
  Menu,
  X
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { AlertSystem } from './AlertSystem';
import { useDashboardStore } from '../store/dashboardStore';
import {
  GlobeWidget,
  AircraftWidget,
  SatelliteWidget,
  MarketWidget,
  CryptoWidget,
  NewsWidget,
  WeatherWidget,
  SeismicWidget,
  SecurityWidget,
  MaritimeWidget,
  SigintWidget,
} from './widgets';

interface Widget {
  id: string;
  title: string;
  icon: React.ElementType;
  component: React.ComponentType;
  colSpan: number;
  rowSpan: number;
}

const WIDGETS: Widget[] = [
  { id: 'globe', title: 'GLOBAL INTELLIGENCE', icon: Globe, component: GlobeWidget, colSpan: 2, rowSpan: 2 },
  { id: 'news', title: 'INTELLIGENCE FEED', icon: Newspaper, component: NewsWidget, colSpan: 2, rowSpan: 2 },
  { id: 'aircraft', title: 'ADS-B TRACKING', icon: Plane, component: AircraftWidget, colSpan: 1, rowSpan: 1 },
  { id: 'satellite', title: 'SATELLITE TRACKING', icon: Satellite, component: SatelliteWidget, colSpan: 1, rowSpan: 1 },
  { id: 'market', title: 'GLOBAL MARKETS', icon: TrendingUp, component: MarketWidget, colSpan: 1, rowSpan: 1 },
  { id: 'crypto', title: 'CRYPTOCURRENCY', icon: Bitcoin, component: CryptoWidget, colSpan: 1, rowSpan: 1 },
  { id: 'weather', title: 'GLOBAL WEATHER', icon: Cloud, component: WeatherWidget, colSpan: 1, rowSpan: 1 },
  { id: 'seismic', title: 'SEISMIC MONITOR', icon: Activity, component: SeismicWidget, colSpan: 1, rowSpan: 1 },
  { id: 'security', title: 'CYBER SECURITY', icon: Shield, component: SecurityWidget, colSpan: 1, rowSpan: 1 },
  { id: 'maritime', title: 'MARITIME AIS', icon: Ship, component: MaritimeWidget, colSpan: 1, rowSpan: 1 },
  { id: 'sigint', title: 'SIGINT COLLECTION', icon: Radio, component: SigintWidget, colSpan: 1, rowSpan: 1 },
];

interface WidgetContainerProps {
  widget: Widget;
}

function WidgetContainer({ widget }: WidgetContainerProps) {
  const Icon = widget.icon;
  const Component = widget.component;

  return (
    <div 
      className={`
        bg-[#0d1117] border border-gray-800 rounded-sm overflow-hidden
        flex flex-col
        ${widget.colSpan === 2 ? 'col-span-2' : 'col-span-1'}
        ${widget.rowSpan === 2 ? 'row-span-2' : 'row-span-1'}
        min-h-[200px]
      `}
    >
      {/* Widget Header - Bloomberg Style */}
      <div className="h-7 bg-[#161b22] border-b border-gray-800 flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold text-gray-300 tracking-wide">{widget.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[9px] text-green-400 font-mono">LIVE</span>
        </div>
      </div>
      
      {/* Widget Content */}
      <div className="flex-1 p-2 overflow-hidden">
        <Component />
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { alerts, clearAlert } = useDashboardStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'all', label: 'ALL', icon: LayoutDashboard },
    { id: 'intel', label: 'INTEL', icon: Globe },
    { id: 'tracking', label: 'TRACKING', icon: Plane },
    { id: 'finance', label: 'FINANCE', icon: TrendingUp },
    { id: 'security', label: 'SECURITY', icon: Shield },
  ];

  const filteredWidgets = activeTab === 'all' 
    ? WIDGETS 
    : activeTab === 'intel' 
      ? WIDGETS.filter(w => ['globe', 'news', 'weather', 'seismic'].includes(w.id))
    : activeTab === 'tracking'
      ? WIDGETS.filter(w => ['aircraft', 'satellite', 'maritime'].includes(w.id))
    : activeTab === 'finance'
      ? WIDGETS.filter(w => ['market', 'crypto'].includes(w.id))
    : activeTab === 'security'
      ? WIDGETS.filter(w => ['security', 'sigint'].includes(w.id))
      : WIDGETS;

  return (
    <div className="h-screen w-screen bg-[#0a0a0f] text-gray-100 overflow-hidden flex flex-col">
      {/* Bloomberg-style Header */}
      <header className="h-12 bg-[#0d1117] border-b border-gray-800 flex items-center justify-between px-3 shrink-0">
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">CIA</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-cyan-400 tracking-tight">CLAWCHAN</h1>
              <p className="text-[8px] text-gray-500 tracking-widest -mt-0.5">INTELLIGENCE AGENCY</p>
            </div>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-medium transition-all
                  ${activeTab === tab.id 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Time & Status */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-cyan-400 font-mono text-sm">
              {currentTime.toISOString().split('T')[1].split('.')[0]}
            </div>
            <div className="text-gray-500 text-[9px]">
              {currentTime.toISOString().split('T')[0]} UTC
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-green-400 font-medium">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="shrink-0">
          <AlertSystem alerts={alerts} onDismiss={clearAlert} />
        </div>
      )}

      {/* Main Content - Bloomberg Terminal Grid */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid grid-cols-4 gap-2 min-h-full">
          {filteredWidgets.map((widget) => (
            <WidgetContainer key={widget.id} widget={widget} />
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-[#0d1117] border-r border-gray-800 p-4">
            <h2 className="text-sm font-bold text-gray-300 mb-4">MODULES</h2>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors
                      ${activeTab === tab.id 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'text-gray-400 hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
