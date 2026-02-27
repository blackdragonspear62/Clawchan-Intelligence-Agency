import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye, CloudSnow, CloudLightning } from 'lucide-react';

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  lat: number;
  lng: number;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [globalTemp, setGlobalTemp] = useState(0);

  useEffect(() => {
    const generateWeather = (): WeatherData[] => [
      { city: 'New York', country: 'USA', temp: 8, condition: 'cloudy', humidity: 65, windSpeed: 18, visibility: 10, lat: 40.71, lng: -74.00 },
      { city: 'London', country: 'UK', temp: 12, condition: 'rainy', humidity: 82, windSpeed: 24, visibility: 6, lat: 51.51, lng: -0.13 },
      { city: 'Tokyo', country: 'JP', temp: 18, condition: 'sunny', humidity: 45, windSpeed: 12, visibility: 15, lat: 35.68, lng: 139.76 },
      { city: 'Sydney', country: 'AU', temp: 26, condition: 'sunny', humidity: 55, windSpeed: 22, visibility: 12, lat: -33.87, lng: 151.21 },
      { city: 'Dubai', country: 'UAE', temp: 34, condition: 'sunny', humidity: 35, windSpeed: 15, visibility: 8, lat: 25.20, lng: 55.27 },
      { city: 'Moscow', country: 'RU', temp: -5, condition: 'snowy', humidity: 70, windSpeed: 28, visibility: 4, lat: 55.76, lng: 37.62 },
    ];

    setWeather(generateWeather());
    setGlobalTemp(14.2);

    const interval = setInterval(() => {
      setWeather(prev => prev.map(w => ({
        ...w,
        temp: w.temp + (Math.random() - 0.5) * 0.5,
        windSpeed: Math.max(0, w.windSpeed + (Math.random() - 0.5) * 3),
      })));
      setGlobalTemp(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-400" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'snowy': return <CloudSnow className="w-5 h-5 text-cyan-200" />;
      case 'stormy': return <CloudLightning className="w-5 h-5 text-purple-400" />;
      default: return <Sun className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-gray-400">Global Weather</span>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-3 h-3 text-orange-400" />
          <span className="text-sm font-mono text-orange-400">{globalTemp.toFixed(1)}°C</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 gap-1.5">
          {weather.map((w) => (
            <div
              key={w.city}
              className="p-2 bg-[#1a1f2e] rounded hover:bg-[#252b3d] transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="text-xs text-gray-200 font-medium">{w.city}</div>
                  <div className="text-[9px] text-gray-500">{w.country}</div>
                </div>
                {getWeatherIcon(w.condition)}
              </div>
              <div className="text-lg font-mono text-cyan-400">{w.temp.toFixed(1)}°C</div>
              <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Droplets className="w-3 h-3" />
                  {w.humidity}%
                </span>
                <span className="flex items-center gap-0.5">
                  <Wind className="w-3 h-3" />
                  {w.windSpeed.toFixed(0)} km/h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            OpenWeatherMap API
          </span>
          <span className="text-cyan-400">● Updated</span>
        </div>
      </div>
    </div>
  );
}
