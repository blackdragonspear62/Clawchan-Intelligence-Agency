import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, AlertCircle, Shield, Cpu, TrendingUp, Flame } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: 'geopolitics' | 'military' | 'tech' | 'finance' | 'disaster';
  timestamp: string;
  url?: string;
}

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated news data - in production, this would call the news API
    const generateNews = (): NewsItem[] => [
      {
        id: '1',
        title: 'NATO deploys additional forces to Eastern Europe amid rising tensions',
        source: 'Reuters',
        category: 'military',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '2',
        title: 'Major tech companies report record quarterly earnings',
        source: 'Bloomberg',
        category: 'finance',
        timestamp: new Date(Date.now() - 900000).toISOString(),
      },
      {
        id: '3',
        title: 'New AI breakthrough in quantum computing announced',
        source: 'TechCrunch',
        category: 'tech',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: '4',
        title: 'Earthquake measuring 6.2 strikes Pacific region',
        source: 'USGS',
        category: 'disaster',
        timestamp: new Date(Date.now() - 2700000).toISOString(),
      },
      {
        id: '5',
        title: 'Diplomatic talks resume in Geneva over trade disputes',
        source: 'BBC',
        category: 'geopolitics',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '6',
        title: 'Cyber attack targets critical infrastructure in Europe',
        source: 'The Guardian',
        category: 'military',
        timestamp: new Date(Date.now() - 4500000).toISOString(),
      },
    ];

    setNews(generateNews());
    setLoading(false);

    const interval = setInterval(() => {
      setNews(prev => {
        const newItem: NewsItem = {
          id: `news-${Date.now()}`,
          title: 'Breaking: New intelligence report released on global security',
          source: 'Intelligence Feed',
          category: 'geopolitics',
          timestamp: new Date().toISOString(),
        };
        return [newItem, ...prev.slice(0, 9)];
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'military': return <Shield className="w-3 h-3" />;
      case 'tech': return <Cpu className="w-3 h-3" />;
      case 'finance': return <TrendingUp className="w-3 h-3" />;
      case 'disaster': return <Flame className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'military': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'tech': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
      case 'finance': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'disaster': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      default: return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
    }
  };

  const formatTime = (time: string) => {
    const diff = Date.now() - new Date(time).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-gray-400">Intelligence Feed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-green-400">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-1.5">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-2 bg-[#1a1f2e] rounded hover:bg-[#252b3d] transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-200 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${getCategoryColor(item.category)}`}>
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                      <span className="text-[9px] text-gray-500">{item.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatTime(item.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>Multi-source aggregation</span>
          <span className="text-blue-400 flex items-center gap-1">
            View All <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
