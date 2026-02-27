import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Activity } from 'lucide-react';

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

export function MarketWidget() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);

  useEffect(() => {
    const generateIndices = (): MarketIndex[] => [
      { symbol: 'SPX', name: 'S&P 500', price: 4783.45, change: 12.34, changePercent: 0.26, volume: '2.1B' },
      { symbol: 'DJI', name: 'Dow Jones', price: 37468.61, change: -45.23, changePercent: -0.12, volume: '312M' },
      { symbol: 'IXIC', name: 'NASDAQ', price: 15095.14, change: 89.67, changePercent: 0.60, volume: '4.8B' },
      { symbol: 'VIX', name: 'Volatility', price: 13.42, change: -0.85, changePercent: -5.95, volume: '45M' },
    ];

    setIndices(generateIndices());

    const interval = setInterval(() => {
      setIndices(prev => prev.map(idx => {
        const change = (Math.random() - 0.5) * 2;
        const newPrice = idx.price * (1 + change / 1000);
        const newChange = idx.change + change;
        const newChangePercent = (newChange / (idx.price - idx.change)) * 100;
        return {
          ...idx,
          price: newPrice,
          change: newChange,
          changePercent: newChangePercent,
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-400">Global Markets</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400">MARKET OPEN</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="space-y-1">
          {indices.map((idx) => (
            <div
              key={idx.symbol}
              className="flex items-center justify-between p-2 bg-[#1a1f2e] rounded hover:bg-[#252b3d] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-300 font-medium">{idx.symbol}</div>
                  <div className="text-[10px] text-gray-500">{idx.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-gray-200">{idx.price.toFixed(2)}</div>
                <div className={`text-[10px] flex items-center gap-1 justify-end ${idx.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {idx.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)} ({idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>Real-time Market Data</span>
          <span className="text-green-400">● NYSE/NASDAQ</span>
        </div>
      </div>
    </div>
  );
}
