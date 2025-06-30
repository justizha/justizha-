import { useState, useEffect } from "react"
import { getRecentTracks, getUserInfo, getTopTracks, getTopArtists } from '../service/lastfm';
import type {
  LastFmTrack,
  LastFmTopTrack,
  LastFmArtistDetailed,
  LastFmUser
} from '../types/lastfm';

export default function Music() {

  type TabType = 'recent' | 'toptracks' | 'topartists';
  const [recentTracks, setRecentTracks] = useState<LastFmTrack[]>([]);
  const [topTracks, setTopTracks] = useState<LastFmTopTrack[]>([]);
  const [topArtists, setTopArtists] = useState<LastFmArtistDetailed[]>([]);
  const [userInfo, setUserInfo] = useState<LastFmUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('recent');

  const username = 'izha112';


  const [lastUpdate, setLastUpdate] = useState<number>(0);

  useEffect(() => {
    const fetchData = async (showLoading = true): Promise<void> => {
      try {
        if (showLoading) setLoading(true);

        const [recentData, topTracksData, topArtistsData, userData] = await Promise.all([
          getRecentTracks(username, 10),
          getTopTracks(username, '1month', 10),
          getTopArtists(username, '1month', 10),
          getUserInfo(username)
        ]);

        const newDataHash = JSON.stringify({
          recent: recentData.recenttracks?.track?.[0]?.date?.uts,
          topTracks: topTracksData.toptracks?.track?.[0]?.playcount,
          topArtists: topArtistsData.topartists?.artist?.[0]?.playcount
        });

        const currentHash = JSON.stringify({
          recent: recentTracks[0]?.date?.uts,
          topTracks: topTracks[0]?.playcount,
          topArtists: topArtists[0]?.playcount
        });

        if (newDataHash !== currentHash) {
          if (recentData.recenttracks) {
            setRecentTracks(recentData.recenttracks.track || []);
          }
          if (topTracksData.toptracks) {
            setTopTracks(topTracksData.toptracks.track || []);
          }
          if (topArtistsData.topartists) {
            setTopArtists(topArtistsData.topartists.artist || []);
          }
          if (userData.user) {
            setUserInfo(userData.user);
          }
          setLastUpdate(Date.now());
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => fetchData(false), 30000);

    return () => clearInterval(interval);
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8shadow-md-b-2shadow-md-gray-900 mx-auto"></div>
          <p className="mt-4">Loading Last.fm data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p >{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl max-h-fit font-mono">
      {/* User Info Header */}
      {userInfo && (
        <div className="mb-8 text-center">
          <img
            src={userInfo.image?.[2]?.['#text'] || '/default-avatar.png'}
            alt={userInfo.name}
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold">{userInfo.realname || userInfo.name}</h1>
          <p >@{userInfo.name}</p>
          <div className="flex justify-center space-x-6 mt-4 text-sm ">
            <span>{parseInt(userInfo.playcount || '0').toLocaleString()} plays</span>
            <span>{parseInt(userInfo.artist_count || '0').toLocaleString()} artists</span>
            <span>{parseInt(userInfo.track_count || '0').toLocaleString()} tracks</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-base-200 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'recent'
            ? 'bg-base-100 text-gray-200 shadow-sm'
            : 'text-gray-300 hover:text-gray-200'
            }`}
        >
          Recent Tracks
        </button>
        <button
          onClick={() => setActiveTab('toptracks')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'toptracks'
            ? 'bg-base-100 text-gray-300 shadow-sm'
            : 'text-gray-300 hover:text-gray-200'
            }`}
        >
          Top Tracks
        </button>
        <button
          onClick={() => setActiveTab('topartists')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${activeTab === 'topartists'
            ? 'bg-base-100 text-gray-200 shadow-sm'
            : 'text-gray-300 hover:text-gray-200'
            }`}
        >
          Top Artists
        </button>
      </div>

      {/* Content */}
      <section className="h-96 overflow-y-auto">
        {/* Recent Tracks */}
        {activeTab === 'recent' && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-4">Recent Tracks</h2>
            {recentTracks.map((track, index) => (
              <div key={`recent-${index}`} className="flex items-center p-4 bg-base-200 rounded-lg shadow-md">
                <img
                  src={track.image?.[1]?.['#text'] || '/default-track.png'}
                  alt={track.name}
                  className="w-12 h-12 rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{track.name}</h3>
                  <p >{track.artist['#text']}</p>
                  {track.album && track.album['#text'] && (
                    <p className="text-sm">{track.album['#text']}</p>
                  )}
                </div>
                {track['@attr'] && track['@attr'].nowplaying && (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm">Now Playing</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Top Tracks */}
        {activeTab === 'toptracks' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Top Tracks (This Month)</h2>
            {topTracks.map((track, index) => (
              <div key={`top-track-${index}`} className="flex items-center p-4 bg-base-200 rounded-lg shadow-smshadow-md">
                <div className="w-8 h-8 flex items-center justify-center bg-base-300 rounded-full mr-4 text-sm font-medium">
                  {index + 1}
                </div>
                <img
                  src={track.image?.[1]?.['#text'] || '/default-track.png'}
                  alt={track.name}
                  className="w-12 h-12 rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium ">{track.name}</h3>
                  <p >{track.artist.name}</p>
                  <p className="text-sm ">{parseInt(track.playcount).toLocaleString()} plays</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Top Artists */}
        {activeTab === 'topartists' && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-4">Top Artists (This Month)</h2>
            {topArtists.map((artist, index) => (
              <div key={`top-artist-${index}`} className="flex items-center p-4 bg-base-200 rounded-lg shadow-smshadow-md">
                <div className="w-8 h-8 flex items-center justify-center bg-base-300 rounded-full mr-4 text-sm font-medium">
                  {index + 1}
                </div>
                <img
                  src={artist.image?.[1]?.['#text'] || '/default-artist.png'}
                  alt={artist.name}
                  className="w-12 h-12 rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium ">{artist.name}</h3>
                  <p className="text-sm">{parseInt(artist.playcount).toLocaleString()} plays</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}