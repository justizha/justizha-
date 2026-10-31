import type { Handler } from '@netlify/functions';

// Server-only key. Prefer a name without the VITE_ prefix so it can never
// be bundled into client code by accident.
const API_KEY = process.env.LASTFM_API_KEY ?? process.env.VITE_LASTFM_API_KEY;
const BASE = 'https://ws.audioscrobbler.com/2.0/';

const PERIODS = new Set(['7day', '1month', '3month', '6month', '12month', 'overall']);

type Json = Record<string, any>;

async function lfFetch(
  method: string,
  user: string,
  extra: Record<string, string> = {}
): Promise<Json> {
  const url = new URL(BASE);
  url.searchParams.set('method', method);
  url.searchParams.set('user', user);
  url.searchParams.set('api_key', API_KEY as string);
  url.searchParams.set('format', 'json');
  for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v);

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const json = (await res.json()) as Json;
  // Last.fm reports many errors as HTTP 200 with { error, message }
  if (!res.ok || json.error) {
    throw new Error(json.message ?? `Last.fm responded ${res.status}`);
  }
  return json;
}

const images = (list?: Json[]) =>
  list?.map((img) => ({ '#text': img['#text'] as string })) ?? [];

// Keep only what the Music page reads, so the JSON is a fraction of the size
const slimRecent = (t: Json) => ({
  name: t.name,
  artist: { '#text': t.artist?.['#text'] },
  album: { '#text': t.album?.['#text'] },
  image: images(t.image),
  date: t.date ? { uts: t.date.uts } : undefined,
  '@attr': t['@attr'] ? { nowplaying: t['@attr'].nowplaying } : undefined,
});

const slimTop = (t: Json) => ({
  name: t.name,
  playcount: t.playcount,
  artist: t.artist ? { name: t.artist.name } : undefined,
});

const slimUser = (u: Json) => ({
  name: u.name,
  realname: u.realname,
  image: images(u.image),
  playcount: u.playcount,
  artist_count: u.artist_count,
  track_count: u.track_count,
});

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const handler: Handler = async (event) => {
  const params = event.queryStringParameters || {};
  const user = params.user;

  if (!user) {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Missing user' }) };
  }
  if (!API_KEY) {
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Server is missing the Last.fm API key' }) };
  }

  // This endpoint is public and uses your key, so don't trust the inputs
  const period = PERIODS.has(params.period ?? '') ? (params.period as string) : '1month';
  const limit = String(Math.min(Math.max(Number.parseInt(params.limit ?? '10', 10) || 10, 1), 50));

  const [recent, topTracks, topArtists, info] = await Promise.allSettled([
    lfFetch('user.getrecenttracks', user, { limit }),
    lfFetch('user.gettoptracks', user, { period, limit }),
    lfFetch('user.gettopartists', user, { period, limit }),
    lfFetch('user.getinfo', user),
  ]);

  // Don't return an empty 200 when everything failed (bad key, rate limit):
  // the page would show "no history" instead of an error with a retry button
  const results = [recent, topTracks, topArtists, info];
  if (results.every((r) => r.status === 'rejected')) {
    const reason = (results[0] as PromiseRejectedResult).reason;
    return {
      statusCode: 502,
      headers: { ...JSON_HEADERS, 'Cache-Control': 'no-store' },
      body: JSON.stringify({ error: reason instanceof Error ? reason.message : 'Last.fm request failed' }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      ...JSON_HEADERS,
      // Browser always revalidates; Netlify's CDN serves a cached copy for 15 s
      // and refreshes it in the background for up to 60 s more. This removes
      // the cold start and the 4 Last.fm calls from most requests.
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': 'public, max-age=15, stale-while-revalidate=60',
    },
    body: JSON.stringify({
      recentTracks: recent.status === 'fulfilled' ? (recent.value.recenttracks?.track ?? []).map(slimRecent) : [],
      topTracks: topTracks.status === 'fulfilled' ? (topTracks.value.toptracks?.track ?? []).map(slimTop) : [],
      topArtists: topArtists.status === 'fulfilled' ? (topArtists.value.topartists?.artist ?? []).map(slimTop) : [],
      userInfo: info.status === 'fulfilled' && info.value.user ? slimUser(info.value.user) : null,
    }),
  };
};