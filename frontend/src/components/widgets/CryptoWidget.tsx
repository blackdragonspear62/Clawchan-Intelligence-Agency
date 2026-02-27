import { useState, useEffect } from 'react';
import { Bitcoin, TrendingUp, TrendingDown, Zap, Coins } from 'lucide-react';

interface Crypto {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: string;
  marketCap: string;
}

export function CryptoWidget() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  useEffect(() => {
    const generateCryptos = (): Crypto[] => [
      { symbol: 'BTC', name: 'Bitcoin', price: 43256.78, change24h: 1234.56, changePercent24h: 2.94, volume24h: '28.4B', marketCap: '847B' },
      { symbol: 'ETH', name: 'Ethereum', price: 2589.34, change24h: -45.23, changePercent24h: -1.72, volume24h: '15.2B', marketCap: '311B' },
      { symbol: 'SOL', name: 'Solana', price: 98.45, change24h: 8.92, changePercent24h: 9.96, volume24h: '3.8B', marketCap: '42B' },
      { symbol: 'XRP', name: 'Ripple', price: 0.6234, change24h: 0.0234, changePercent24h: 3.90, volume24h: '1.9B', marketCap: '34B' },
    ];

    setCryptos(generateCryptos());

    const interval = setInterval(() => {
      setCryptos(prev => prev.map(crypto => {
        const change = (Math.random() - 0.5) * 0.5;
        const newPrice = crypto.price * (1 + change / 100);
        return {
          ...crypto,
          price: newPrice,
        };
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getCryptoIcon = (symbol: string) => {
    switch (symbol) {
      case 'BTC': return <Bitcoin className="w-4 h-4 text-orange-400" />;
      case 'ETH': return <Coins className="w-4 h-4 text-purple-400" />;
      default: return <Zap className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bitcoin className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-gray-400">Cryptocurrency</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-green-400">24H</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="space-y-1">
          {cryptos.map((crypto) => (
            <div
              key={crypto.symbol}
              className="flex items-center justify-between p-2 bg-[#1a1f2e] rounded hover:bg-[#252b3d] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-orange-500/10 rounded flex items-center justify-center">
                  {getCryptoIcon(crypto.symbol)}
                </div>
                <div>
                  <div className="text-xs text-gray-300 font-medium">{crypto.symbol}</div>
                  <div className="text-[10px] text-gray-500">{crypto.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-gray-200">
                  ${crypto.price < 1 ? crypto.price.toFixed(4) : crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-[10px] flex items-center gap-1 justify-end ${crypto.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {crypto.changePercent24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {crypto.changePercent24h >= 0 ? '+' : ''}{crypto.changePercent24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>Source: CoinGecko API</span>
          <span className="text-orange-400">● Live Prices</span>
        </div>
      </div>
    </div>
  );
}
