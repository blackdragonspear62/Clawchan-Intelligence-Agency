import { useEffect, useState } from 'react';
import { Cloud, Wind, Droplets, Thermometer, Eye, Gauge } from 'lucide-react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  coord: {
    lat: number;
    lon: number;
  };
}

const CITIES = [
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
];

export function WeatherPanel() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using demo data since we don't have an API key
        const demoData: WeatherData[] = CITIES.map((city, i) => ({
          name: city.name,
          coord: { lat: city.lat, lon: city.lon },
          main: {
            temp: [15, 12, 22, 30, 25, 38][i],
            feels_like: [14, 11, 23, 32, 24, 40][i],
            humidity: [65, 70, 55, 80, 60, 45][i],
            pressure: [1013, 1010, 1008, 1005, 1015, 1002][i],
          },
          weather: [{
            main: ['Clouds', 'Rain', 'Clear', 'Thunderstorm', 'Clear', 'Clear'][i],
            description: ['scattered clouds', 'light rain', 'clear sky', 'thunderstorm', 'clear sky', 'clear sky'][i],
          }],
          wind: {
            speed: [5.5, 8.2, 3.1, 6.7, 4.3, 7.8][i],
            deg: [180, 225, 90, 135, 270, 315][i],
          },
          visibility: 10000,
        }));
        setWeatherData(demoData);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case 'clear':
        return <div className="w-8 h-8 rounded-full bg-yellow-400/50" />;
      case 'clouds':
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rain':
        return <Droplets className="w-8 h-8 text-blue-400" />;
      case 'thunderstorm':
        return <div className="w-8 h-8 bg-purple-400/50 rounded" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Acquiring atmospheric data...</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Monitored Cities</div>
          <div className="text-2xl font-mono text-blue-400">{weatherData.length}</div>
        </div>
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Avg Temperature</div>
          <div className="text-2xl font-mono text-cyan-400">
            {(weatherData.reduce((acc, w) => acc + w.main.temp, 0) / weatherData.length).toFixed(1)}°C
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-auto">
        {weatherData.map((weather) => (
          <div 
            key={weather.name}
            className="bg-[#1c2128] rounded p-3 border border-gray-800 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getWeatherIcon(weather.weather[0].main)}
                <div>
                  <div className="font-medium text-white">{weather.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{weather.weather[0].description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono text-white">{Math.round(weather.main.temp)}°C</div>
                <div className="text-xs text-gray-500">Feels {Math.round(weather.main.feels_like)}°</div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span className="text-gray-300">{weather.main.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-cyan-400" />
                <span className="text-gray-300">{weather.wind.speed} m/s</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-purple-400" />
                <span className="text-gray-300">{weather.main.pressure} hPa</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
