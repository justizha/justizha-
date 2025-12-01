import type { LastFmAllData } from '../types/lastfm';
// service/lastfm.ts
const BASE = '/.netlify/functions/lastfm';

export const getRecentTracks = (user: string, limit = 10) =>
  fetch(`${BASE}?method=user.getrecenttracks&user=${user}&limit=${limit}`).then(
    (res) => res.json()
  );

export const getTopTracks = (user: string, period = 'overall', limit = 10) =>
  fetch(
    `${BASE}?method=user.gettoptracks&user=${user}&period=${period}&limit=${limit}`
  ).then((res) => res.json());

export const getTopArtists = (user: string, period = 'overall', limit = 10) =>
  fetch(
    `${BASE}?method=user.gettopartists&user=${user}&period=${period}&limit=${limit}`
  ).then((res) => res.json());

export const getUserInfo = (user: string) =>
  fetch(`${BASE}?method=user.getinfo&user=${user}`).then((res) => res.json());

export const getAllLastFmData = async (
  username: string
): Promise<LastFmAllData> => {
  const [recentData, topTracksData, topArtistsData, userData] =
    await Promise.all([
      getRecentTracks(username, 10),
      getTopTracks(username, '1month', 10),
      getTopArtists(username, '1month', 10),
      getUserInfo(username),
    ]);

  return {
    recentTracks: recentData.recenttracks?.track || [],
    topTracks: topTracksData.toptracks?.track || [],
    topArtists: topArtistsData.topartists?.artist || [],
    userInfo: userData.user || null,
  };
};
