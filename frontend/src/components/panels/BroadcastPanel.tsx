import { useState, useRef, useEffect } from 'react';
import { Tv, Radio, Globe, Volume2, VolumeX, Maximize } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  country: string;
  category: string;
  url: string;
  language: string;
}

const CHANNELS: Channel[] = [
  { id: '1', name: 'CNN International', country: 'USA', category: 'News', language: 'English', url: 'https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8' },
  { id: '2', name: 'BBC World News', country: 'UK', category: 'News', language: 'English', url: 'https://bbcworldnews-live.bbcfmt.hs.llnwd.net/bbcworldnews/live/bbc_world_news_au_v3.m3u8' },
  { id: '3', name: 'Al Jazeera', country: 'Qatar', category: 'News', language: 'English', url: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8' },
  { id: '4', name: 'France 24', country: 'France', category: 'News', language: 'English', url: 'https://f24hls-i.akamaihd.net/hls/live/741309/f24hls_en/F24_EN_EN_1500.m3u8' },
  { id: '5', name: 'Deutsche Welle', country: 'Germany', category: 'News', language: 'English', url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8' },
  { id: '6', name: 'NHK World', country: 'Japan', category: 'News', language: 'English', url: 'https://nhkwlive-xjp.akamaized.net/hls/live/2003458/nhkwlive-xjp/index_1M.m3u8' },
  { id: '7', name: 'RT News', country: 'Russia', category: 'News', language: 'English', url: 'https://rt-glb.gcdn.co/live/rtnews/playlist.m3u8' },
  { id: '8', name: 'CCTV-4', country: 'China', category: 'News', language: 'Chinese', url: 'https://cctvtxyh5ca.liveplay.myqcloud.com/live/cctv4_2.m3u8' },
  { id: '9', name: 'Arirang TV', country: 'South Korea', category: 'News', language: 'English', url: 'https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8' },
  { id: '10', name: 'TRT World', country: 'Turkey', category: 'News', language: 'English', url: 'https://trtworld.blutv.com/blutv_trtworld/live.m3u8' },
];

export function BroadcastPanel() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>(CHANNELS[0]);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, selectedChannel]);

  return (
    <div className="p-3 space-y-3">
      <div className="bg-[#1c2128] rounded-lg overflow-hidden border border-gray-800">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={selectedChannel.url}
            autoPlay
            muted={isMuted}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Video load error:', e);
            }}
          />
          <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            LIVE
          </div>
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-black/70 p-2 rounded hover:bg-black/90 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-black/70 p-2 rounded hover:bg-black/90 transition-colors"
            >
              <Maximize className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <Tv className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-white">{selectedChannel.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {selectedChannel.country}
            </span>
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3" />
              {selectedChannel.language}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1 max-h-[calc(100vh-420px)] overflow-auto">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Available Channels</div>
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setSelectedChannel(channel)}
            className={`w-full text-left p-2 rounded flex items-center justify-between transition-colors ${
              selectedChannel.id === channel.id
                ? 'bg-cyan-500/20 border border-cyan-500/50'
                : 'bg-[#1c2128] border border-gray-800 hover:border-gray-600'
            }`}
          >
            <div>
              <div className={`text-sm ${selectedChannel.id === channel.id ? 'text-cyan-400' : 'text-white'}`}>
                {channel.name}
              </div>
              <div className="text-xs text-gray-500">{channel.country} • {channel.category}</div>
            </div>
            {selectedChannel.id === channel.id && (
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
