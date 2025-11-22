import moment from "moment";
import { useEffect, useState } from "react";
import Nav from "../components/Navigation";
import {
  getRecentTracks,
  getTopArtists,
  getTopTracks,
  getUserInfo,
} from "../service/lastfm";
import type {
  LastFmArtistDetailed,
  LastFmTopTrack,
  LastFmTrack,
  LastFmUser,
} from "../types/lastfm";
import Loading from "../components/Loading";

export default function Music() {
  type TabType = "recent" | "toptracks" | "topartists";
  const [recentTracks, setRecentTracks] = useState<LastFmTrack[]>([]);
  const [topTracks, setTopTracks] = useState<LastFmTopTrack[]>([]);
  const [topArtists, setTopArtists] = useState<LastFmArtistDetailed[]>([]);
  const [userInfo, setUserInfo] = useState<LastFmUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("recent");

  const [, setLastUpdate] = useState<number>(0);

  const username = "izha112";
  useEffect(() => {
    const fetchData = async (showLoading = true): Promise<void> => {
      try {
        if (showLoading) setLoading(true);
        const [recentData, topTracksData, topArtistsData, userData] =
          await Promise.all([
            getRecentTracks(username, 10),
            getTopTracks(username, "1month", 10),
            getTopArtists(username, "1month", 10),
            getUserInfo(username),
          ]);

        // Always update the data
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
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    let isMounted = true;
     const timer = setTimeout(() => {
       if (isMounted) fetchData(true);
     }, 3000);
     const interval = setInterval(() => {
       if (isMounted) fetchData(false);
     }, 30000);

     return () => {
       isMounted = false;
       clearTimeout(timer);
       clearInterval(interval);
     };
   }, [username])

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <main className="mx-auto p-4 max-w-7xl h-fit  pt-12  flex gap-4 sm:flex-row flex-col justify-center py-20">
        {/* User Info Sidebar - Reduced width */}
        {userInfo && (
          <aside className="sm:w-80 flex-shrink-0 w-full">
            <section className="bg-base-300/60  p-6 shadow-md outline-teal-900 outline flex items-center flex-col sticky top-4">
              <div className="text-center mb-6">
                <img
                  src={userInfo.image?.[2]?.["#text"] || "/default-avatar.png"}
                  alt={userInfo.name}
                  className="w-36 h-36  object-cover border border-base-300 mx-auto mb-4"
                />
                <a
                  href={`https://last.fm/user/${userInfo.name}`}
                  target="_blank"
                  className="text-xl font-bold text-gray-100 btn-link block"
                  rel="noreferrer"
                >
                  {userInfo.realname || userInfo.name}
                </a>
                <p className="text-sm text-gray-400">@{userInfo.name}</p>
              </div>

              <div className="w-full">
                <div className="space-y-4 text-sm text-gray-300">
                  <div className="flex justify-between items-center p-3 bg-base-100/50 ">
                    <div className="text-lg font-semibold">
                      {Number.parseInt(
                        userInfo.playcount || "0",
                      ).toLocaleString()}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">
                      Plays
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-base-100/50 ">
                    <div className="text-lg font-semibold">
                      {Number.parseInt(
                        userInfo.artist_count || "0",
                      ).toLocaleString()}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">
                      Artists
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-base-100/50 ">
                    <div className="text-lg font-semibold">
                      {Number.parseInt(
                        userInfo.track_count || "0",
                      ).toLocaleString()}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">
                      Tracks
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        )}

        {/* Main Content Area - Expanded */}
        <section className="flex-1 min-w-0 max-w-[38rem] ">
          {/* Tabs */}
          <div className="flex space-x-1 mb-3 bg-base-200 p-2  border border-teal-900">
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`flex-1 py-3 px-6 text-sm font-medium shadow  duration-300
            transition-all ${
              activeTab === "recent"
                ? "bg-base-100 text-gray-200 border border-teal-700 transform scale-[1.02]"
                : "text-gray-300 hover:text-gray-200 hover:bg-base-300/50"
            }`}
            >
              Recent Tracks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("toptracks")}
              className={`flex-1 py-3 px-6 text-sm font-medium shadow  duration-300 transition-all ${
                activeTab === "toptracks"
                  ? "bg-base-100 text-gray-300 border border-teal-700 transform scale-[1.02]"
                  : "text-gray-300 hover:text-gray-200 hover:bg-base-300/50"
              }`}
            >
              Top Tracks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("topartists")}
              className={`flex-1 py-3 px-6 text-sm font-medium shadow  duration-300 transition-all ${
                activeTab === "topartists"
                  ? "bg-base-100 text-gray-200 shadow-sm border border-teal-700 transform scale-[1.02]"
                  : "text-gray-300 hover:text-gray-200 hover:bg-base-300/50"
              }`}
            >
              Top Artists
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 ">
            {/* Recent Tracks */}
            {activeTab === "recent" && (
              <div>
                <h2 className="text-xl font-semibold px-6 border-b border-teal-900 border bg-base-200 py-4  sticky top-0 z-10">
                  Recent Tracks
                </h2>
                <div className="bg-base-200  border-x border-b border-teal-900 h-[21rem] overflow-y-auto">
                  {recentTracks.map((track, index) => (
                    <div
                      key={`recent-${index}`}
                      className={`${
                        track["@attr"]?.nowplaying
                          ? `flex items-center pt-5 px-2 bg-base-200 hover:bg-base-300/30 transition-colors duration-200 mx-5`
                          : `flex items-center p-1 mx-5 bg-base-200 hover:bg-base-300/30 transition-colors duration-200`
                      }
                  ${
                    index < recentTracks.length - 1
                      ? "border-b border-teal-900/50"
                      : ""
                  }`}
                    >
                      {track["@attr"]?.nowplaying ? (
                        <div className="pr-2">
                          <img
                            src={
                              track.image?.[2]?.["#text"] ||
                              "/default-avatar.png"
                            }
                            alt={track.name}
                            className="w-28 h-28  object-cover border border-base-300 mx-auto mb-4"
                          />
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <div className="flex-1 min-w-0 mr-4">
                        <h3
                          className={`${
                            track["@attr"]?.nowplaying
                              ? `font-medium truncate text-gray-100 mb-1`
                              : `font-medium truncate text-gray-100 mb-1 text-xs`
                          } `}
                        >
                          {track.name}
                        </h3>
                        <p
                          className={`${
                            track["@attr"]?.nowplaying
                              ? `text-sm text-gray-300 truncate`
                              : `text-xs text-gray-300 truncate`
                          } `}
                        >
                          by {track.artist["#text"]}
                        </p>
                        {track.album?.["#text"] && (
                          <p className="text-xs text-gray-400 truncate">
                            {track.album["#text"]}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {track["@attr"]?.nowplaying ? (
                          <div className="animate-pulse flex items-center text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                            <span className="text-sm font-medium">
                              Now Playing
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">
                            {moment(Number(track.date?.uts) * 1000).fromNow()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Tracks */}
            {activeTab === "toptracks" && (
              <div>
                <h2 className="text-xl font-semibold px-6 border-b border-teal-900 border bg-base-200 py-4  sticky top-0 z-10">
                  Top Tracks (This Month)
                </h2>
                <div className="bg-base-200  border-x border-b border-teal-900 h-[21rem] overflow-y-auto">
                  {topTracks.map((track, index) => (
                    <div
                      key={`top-track-${index}`}
                      className={`flex items-center p-5 bg-base-200 hover:bg-base-300/30 transition-colors duration-200
                  ${
                    index < topTracks.length - 1
                      ? "border-b border-teal-900/50"
                      : ""
                  }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-base-100  mr-5 text-sm font-medium shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="font-medium text-gray-100 mb-1">
                          {track.name}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {track.artist.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {Number.parseInt(track.playcount).toLocaleString()}{" "}
                          plays
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <a
                          href={`https://last.fm/music/${track.artist.name}`}
                          className="btn btn-outline btn-error btn-sm hover:scale-105 transition-transform duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit
                          <img
                            src="/assets/lastfm.png"
                            alt="Last.fm"
                            className="w-4 h-4 ml-1"
                          />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Artists */}
            {activeTab === "topartists" && (
              <div>
                <h2 className="text-xl font-semibold px-6 border-b border-teal-900 border bg-base-200 py-4  sticky top-0 z-10">
                  Top Artists (This Month)
                </h2>
                <div className="bg-base-200  border-x border-b border-teal-900 h-[21rem] overflow-y-auto">
                  {topArtists.map((artist, index) => (
                    <div
                      key={`top-artist-${index}`}
                      className={`flex items-center p-5 bg-base-200 hover:bg-base-300/30 transition-colors duration-200
                  ${
                    index < topArtists.length - 1
                      ? "border-b border-teal-900/50"
                      : ""
                  }`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-base-100  mr-5 text-sm font-medium shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="font-semibold text-gray-100 mb-1">
                          {artist.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {Number.parseInt(artist.playcount).toLocaleString()}{" "}
                          plays
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <a
                          href={`https://last.fm/music/${artist.name}`}
                          className="btn btn-outline btn-error btn-sm hover:scale-105 transition-transform duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit
                          <img
                            src="/assets/lastfm.png"
                            alt="Last.fm"
                            className="w-4 h-4 ml-1"
                          />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
