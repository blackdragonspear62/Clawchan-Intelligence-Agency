import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Activity } from 'lucide-react';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export function FinancialPanel() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1'
        );
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error('Failed to fetch crypto data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrypto();
    const interval = setInterval(fetchCrypto, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Connecting to markets...</p>
      </div>
    );
  }

  const totalMarketCap = cryptoData.reduce((acc, c) => acc + c.market_cap, 0);

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">Top 20 MCap</div>
          <div className="text-xl font-mono text-green-400">{formatMarketCap(totalMarketCap)}</div>
        </div>
        <div className="bg-[#1c2128] rounded p-3 border border-gray-800">
          <div className="text-gray-500 text-xs mb-1">24h Volume</div>
          <div className="text-xl font-mono text-blue-400">
            {formatMarketCap(cryptoData.reduce((acc, c) => acc + c.total_volume, 0))}
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-auto">
        {cryptoData.map((crypto) => (
          <div 
            key={crypto.id}
            className="bg-[#1c2128] rounded p-3 border border-gray-800 hover:border-green-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {crypto.symbol === 'btc' ? (
                  <Bitcoin className="w-4 h-4 text-orange-400" />
                ) : (
                  <DollarSign className="w-4 h-4 text-green-400" />
                )}
                <div>
                  <span className="font-medium text-sm text-white">{crypto.name}</span>
                  <span className="text-xs text-gray-500 ml-2 uppercase">{crypto.symbol}</span>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs ${
                crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {crypto.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg text-white">{formatPrice(crypto.current_price)}</span>
              <span className="text-xs text-gray-500">{formatMarketCap(crypto.market_cap)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
