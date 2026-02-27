import axios from 'axios';

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

export interface ExchangeData {
  id: string;
  name: string;
  year_established: number | null;
  country: string | null;
  description: string;
  url: string;
  image: string;
  has_trading_incentive: boolean;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
}

const cryptoApi = axios.create({
  baseURL: COINGECKO_API_BASE,
  timeout: 15000,
});

export const cryptoService = {
  async getCoinsMarkets(
    vsCurrency: string = 'usd',
    ids?: string[],
    category?: string,
    order: string = 'market_cap_desc',
    perPage: number = 100,
    page: number = 1,
    sparkline: boolean = false,
    priceChangePercentage: string = '24h'
  ): Promise<CoinMarketData[]> {
    const params: Record<string, string | number | boolean | string[]> = {
      vs_currency: vsCurrency,
      order,
      per_page: perPage,
      page,
      sparkline,
      price_change_percentage: priceChangePercentage,
    };

    if (ids) params.ids = ids.join(',');
    if (category) params.category = category;

    const response = await cryptoApi.get('/coins/markets', { params });
    return response.data;
  },

  async getCoinById(id: string): Promise<CoinDetail> {
    const response = await cryptoApi.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    return response.data;
  },

  async getCoinHistory(id: string, date: string): Promise<unknown> {
    const response = await cryptoApi.get(`/coins/${id}/history`, {
      params: { date, localization: false },
    });
    return response.data;
  },

  async getCoinMarketChart(
    id: string,
    vsCurrency: string = 'usd',
    days: number | 'max' = 1
  ): Promise<{
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
  }> {
    const response = await cryptoApi.get(`/coins/${id}/market_chart`, {
      params: { vs_currency: vsCurrency, days },
    });
    return response.data;
  },

  async getExchanges(perPage: number = 100, page: number = 1): Promise<ExchangeData[]> {
    const response = await cryptoApi.get('/exchanges', {
      params: { per_page: perPage, page },
    });
    return response.data;
  },

  async getGlobalData(): Promise<{
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
  }> {
    const response = await cryptoApi.get('/global');
    return response.data;
  },

  async getTrendingCoins(): Promise<{
    coins: Array<{
      item: {
        id: string;
        coin_id: number;
        name: string;
        symbol: string;
        market_cap_rank: number;
        thumb: string;
        small: string;
        large: string;
        slug: string;
        price_btc: number;
        score: number;
      };
    }>;
    exchanges: unknown[];
  }> {
    const response = await cryptoApi.get('/search/trending');
    return response.data;
  },

  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  },

  formatMarketCap(marketCap: number, currency: string = 'USD'): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 2,
    });
    return formatter.format(marketCap);
  },

  formatPercentage(percentage: number): string {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  },
};

export default cryptoService;
