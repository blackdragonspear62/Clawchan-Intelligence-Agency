import axios from 'axios';
import { logger } from '../utils/logger';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
}

export interface GlobalCryptoData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

class CryptoService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

  private getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  }

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getCoinsMarkets(
    vsCurrency: string = 'usd',
    perPage: number = 100,
    page: number = 1
  ): Promise<CoinMarketData[]> {
    const cacheKey = this.getCacheKey('markets', { vsCurrency, perPage, page });
    const cached = this.getCached<CoinMarketData[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
        params: {
          vs_currency: vsCurrency,
          order: 'market_cap_desc',
          per_page: perPage,
          page,
          sparkline: false,
          price_change_percentage: '24h',
        },
        timeout: 15000,
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching crypto markets:', error);
      return this.getMockCoinsMarkets(perPage);
    }
  }

  async getCoinById(id: string): Promise<CoinDetail> {
    const cacheKey = this.getCacheKey('coin', { id });
    const cached = this.getCached<CoinDetail>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${COINGECKO_API_BASE}/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
        timeout: 15000,
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching coin details:', error);
      return this.getMockCoinDetail(id);
    }
  }

  async getGlobalData(): Promise<GlobalCryptoData['data']> {
    const cacheKey = this.getCacheKey('global');
    const cached = this.getCached<GlobalCryptoData['data']>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get<GlobalCryptoData>(`${COINGECKO_API_BASE}/global`, {
        timeout: 15000,
      });

      this.setCache(cacheKey, response.data.data);
      return response.data.data;
    } catch (error) {
      logger.error('Error fetching global crypto data:', error);
      return this.getMockGlobalData();
    }
  }

  async getTrendingCoins(): Promise<{
    coins: Array<{
      item: {
        id: string;
        name: string;
        symbol: string;
        market_cap_rank: number;
        thumb: string;
        score: number;
      };
    }>;
  }> {
    try {
      const response = await axios.get(`${COINGECKO_API_BASE}/search/trending`, {
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching trending coins:', error);
      return { coins: [] };
    }
  }

  private getMockCoinsMarkets(count: number): CoinMarketData[] {
    const coins = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'eth' },
      { id: 'tether', name: 'Tether', symbol: 'usdt' },
      { id: 'binancecoin', name: 'BNB', symbol: 'bnb' },
      { id: 'solana', name: 'Solana', symbol: 'sol' },
      { id: 'ripple', name: 'XRP', symbol: 'xrp' },
      { id: 'usd-coin', name: 'USDC', symbol: 'usdc' },
      { id: 'cardano', name: 'Cardano', symbol: 'ada' },
      { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge' },
      { id: 'avalanche-2', name: 'Avalanche', symbol: 'avax' },
    ];

    return coins.slice(0, count).map((coin, i) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: `https://assets.coingecko.com/coins/images/1/large/${coin.symbol}.png`,
      current_price: 100 + Math.random() * 60000,
      market_cap: 1000000000 + Math.random() * 1000000000000,
      market_cap_rank: i + 1,
      fully_diluted_valuation: 1000000000 + Math.random() * 1000000000000,
      total_volume: 100000000 + Math.random() * 50000000000,
      high_24h: 100 + Math.random() * 60000,
      low_24h: 100 + Math.random() * 60000,
      price_change_24h: (Math.random() - 0.5) * 1000,
      price_change_percentage_24h: (Math.random() - 0.5) * 20,
      market_cap_change_24h: (Math.random() - 0.5) * 10000000000,
      market_cap_change_percentage_24h: (Math.random() - 0.5) * 10,
      circulating_supply: 10000000 + Math.random() * 20000000,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 60000 + Math.random() * 10000,
      ath_change_percentage: -10 + Math.random() * 20,
      ath_date: '2021-11-10T14:24:11.849Z',
      atl: 1 + Math.random() * 100,
      atl_change_percentage: 10000 + Math.random() * 50000,
      atl_date: '2013-07-05T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString(),
    }));
  }

  private getMockCoinDetail(id: string): CoinDetail {
    return {
      id,
      symbol: id.substring(0, 3),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      description: {
        en: `${id} is a decentralized digital currency that can be transferred on the peer-to-peer network.`,
      },
      image: {
        thumb: `https://assets.coingecko.com/coins/images/1/thumb/${id}.png`,
        small: `https://assets.coingecko.com/coins/images/1/small/${id}.png`,
        large: `https://assets.coingecko.com/coins/images/1/large/${id}.png`,
      },
      market_cap_rank: 1,
      market_data: {
        current_price: { usd: 50000 + Math.random() * 10000 },
        market_cap: { usd: 1000000000000 },
        total_volume: { usd: 30000000000 },
        price_change_percentage_24h: (Math.random() - 0.5) * 10,
        price_change_percentage_7d: (Math.random() - 0.5) * 20,
        price_change_percentage_30d: (Math.random() - 0.5) * 30,
        circulating_supply: 19000000,
        total_supply: 21000000,
        max_supply: 21000000,
      },
    };
  }

  private getMockGlobalData(): GlobalCryptoData['data'] {
    return {
      active_cryptocurrencies: 10000 + Math.floor(Math.random() * 5000),
      upcoming_icos: 50 + Math.floor(Math.random() * 100),
      ongoing_icos: 100 + Math.floor(Math.random() * 200),
      ended_icos: 5000 + Math.floor(Math.random() * 1000),
      markets: 800 + Math.floor(Math.random() * 200),
      total_market_cap: {
        usd: 2000000000000 + Math.random() * 500000000000,
      },
      total_volume: {
        usd: 100000000000 + Math.random() * 50000000000,
      },
      market_cap_percentage: {
        btc: 45 + Math.random() * 10,
        eth: 15 + Math.random() * 5,
      },
      market_cap_change_percentage_24h_usd: (Math.random() - 0.5) * 10,
      updated_at: Math.floor(Date.now() / 1000),
    };
  }
}

export const cryptoService = new CryptoService();
export default cryptoService;
