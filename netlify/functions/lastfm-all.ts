import type { Handler } from '@netlify/functions';

const API_KEY = process.env.VITE_LASTFM_API_KEY;
const BASE = 'https://ws.audioscrobbler.com/2.0/';

const lfFetch = (method: string, user: string, extra: Record<string, string> = {}) => {
  const url = new URL(BASE);
  url.searchParams.set('method', method);
  url.searchParams.set('user', user);
  url.searchParams.set('api_key', API_KEY!);
  url.searchParams.set('format', 'json');
  Object.entries(extra).forEach(([k, v]) => url.searchParams.set(k, v));
  return fetch(url.toString()).then(r => r.json());
};

export const handler: Handler = async (event) => {
  const { user, period = '1month', limit = '10' } = event.queryStringParameters || {};
  if (!user) return { statusCode: 400, body: JSON.stringify({ error: 'Missing user' }) };

  const [recentData, topTracksData, topArtistsData, userData] = await Promise.allSettled([
    lfFetch('user.getrecenttracks', user, { limit }),
    lfFetch('user.gettoptracks', user, { period, limit }),
    lfFetch('user.gettopartists', user, { period, limit }),
    lfFetch('user.getinfo', user),
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      recentTracks: recentData.status === 'fulfilled' ? recentData.value.recenttracks?.track ?? [] : [],
      topTracks: topTracksData.status === 'fulfilled' ? topTracksData.value.toptracks?.track ?? [] : [],
      topArtists: topArtistsData.status === 'fulfilled' ? topArtistsData.value.topartists?.artist ?? [] : [],
      userInfo: userData.status === 'fulfilled' ? userData.value.user ?? null : null,
    }),
  };
};