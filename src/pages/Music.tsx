import { useState, useEffect } from "react"
import Nav from "../components/Navigation";
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


  const [, setLastUpdate] = useState<number>(0);
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

    const timer = setTimeout(() => {
      fetchData(true);
    }, 3000);

    const interval = setInterval(() => fetchData(false), 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8shadow-md-b-2shadow-md-gray-900 mx-auto"></div>
          <img src="/assets/rollingcar.gif" alt="cat" className='w-20' />
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
    <>
      <Nav />
      <div className="mx-auto p-4 max-w-2xl h-fit font-mono pb-16">
        {/* User Info Header */}
        {userInfo && (
          <div className="bg-base-200 rounded-2xl p-6 shadow-md flex items-center max-w-2xl mx-auto mb-8">
            <img
              src={userInfo.image?.[2]?.['#text'] || '/default-avatar.png'}
              alt={userInfo.name}
              className="sm:w-36 w-24 sm:h-36 h-24  rounded-lg object-cover sm:mr-8 mr-6 border border-base-300"
            />

            <div className="flex-1">
              <a href={`https://last.fm/user/${userInfo.name}`} target="_blank" className="text-2xl font-bold text-gray-100 btn-link">{userInfo.realname || userInfo.name}
              </a>
              <p className="text-sm text-gray-400 mb-3">@{userInfo.name}</p>

              <ul className="flex space-x-6 text-sm text-gray-300">
                <li className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{parseInt(userInfo.playcount || '0').toLocaleString()}</span>
                  <span className="text-xs uppercase tracking-wide text-gray-400">Plays</span>
                </li>
                <li className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{parseInt(userInfo.artist_count || '0').toLocaleString()}</span>
                  <span className="text-xs uppercase tracking-wide text-gray-400">Artists</span>
                </li>
                <li className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{parseInt(userInfo.track_count || '0').toLocaleString()}</span>
                  <span className="text-xs uppercase tracking-wide text-gray-400">Tracks</span>
                </li>

              </ul>
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
        <section className="h-[26rem] overflow-y-auto">
          {/* Recent Tracks */}
          {activeTab === 'recent' && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold mb-4">Recent Tracks</h2>
              {recentTracks.map((track, index) => (
                <div key={`recent-${index}`} className="flex items-center p-4 bg-base-200 rounded-lg shadow-md">
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
            <div className="space-y-3">
              <h2 className="text-xl font-semibold mb-4">Top Tracks (This Month)</h2>
              {topTracks.map((track, index) => (
                <div key={`top-track-${index}`} className="flex items-center p-4 bg-base-200 rounded-lg shadow-smshadow-md">
                  <div className="w-8 h-8 flex items-center justify-center bg-base-300 rounded-full mr-4 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium ">{track.name}</h3>
                    <p >{track.artist.name}</p>
                    <p className="text-sm ">{parseInt(track.playcount).toLocaleString()} plays</p>
                  </div>
                  <div>
                    <a href={`https://last.fm/music/${track.artist.name}`} className="btn btn-outline btn-error">Visit <img src="/assets/lastfm.png" alt="last Fm" className="w-4 h-4" /></a>
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
                  <div className="flex-1">
                    <h3 className="font-medium ">{artist.name}</h3>
                    <p className="text-sm">{parseInt(artist.playcount).toLocaleString()} plays</p>
                  </div>
                  <div className="">
                    <a href={`https://last.fm/music/${artist.name}`} className="btn btn-outline btn-error">Visit <img src="/assets/lastfm.png" alt="last Fm" className="w-4 h-4" /></a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}