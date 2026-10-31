interface Env {
  LASTFM_API_KEY: string;
}

const BASE = 'https://ws.audioscrobbler.com/2.0/';
const PERIODS = new Set(['7day', '1month', '3month', '6month', '12month', 'overall']);

type Json = Record<string, any>;

async function lfFetch(
  apiKey: string,
  method: string,
  user: string,
  extra: Record<string, string> = {}
): Promise<Json> {
  const url = new URL(BASE);
  url.searchParams.set('method', method);
  url.searchParams.set('user', user);
  url.searchParams.set('api_key', apiKey);
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

// Keep only what the Music page reads, so the JSON stays small
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

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const params = new URL(request.url).searchParams;
  const user = params.get('user');

  if (!user) return json({ error: 'Missing user' }, 400);
  if (!env.LASTFM_API_KEY) {
    return json({ error: 'Server is missing the Last.fm API key' }, 500);
  }

  // This endpoint is public and uses your key, so don't trust the inputs
  const rawPeriod = params.get('period') ?? '';
  const period = PERIODS.has(rawPeriod) ? rawPeriod : '1month';
  const limit = String(
    Math.min(Math.max(Number.parseInt(params.get('limit') ?? '10', 10) || 10, 1), 50)
  );

  const key = env.LASTFM_API_KEY;
  const [recent, topTracks, topArtists, info] = await Promise.allSettled([
    lfFetch(key, 'user.getrecenttracks', user, { limit }),
    lfFetch(key, 'user.gettoptracks', user, { period, limit }),
    lfFetch(key, 'user.gettopartists', user, { period, limit }),
    lfFetch(key, 'user.getinfo', user),
  ]);

  // Don't return an empty 200 when everything failed (bad key, rate limit)
  const results = [recent, topTracks, topArtists, info];
  if (results.every((r) => r.status === 'rejected')) {
    const reason = (results[0] as PromiseRejectedResult).reason;
    return json(
      { error: reason instanceof Error ? reason.message : 'Last.fm request failed' },
      502,
      { 'Cache-Control': 'no-store' }
    );
  }

  return json(
    {
      recentTracks:
        recent.status === 'fulfilled'
          ? (recent.value.recenttracks?.track ?? []).map(slimRecent)
          : [],
      topTracks:
        topTracks.status === 'fulfilled'
          ? (topTracks.value.toptracks?.track ?? []).map(slimTop)
          : [],
      topArtists:
        topArtists.status === 'fulfilled'
          ? (topArtists.value.topartists?.artist ?? []).map(slimTop)
          : [],
      userInfo:
        info.status === 'fulfilled' && info.value.user
          ? slimUser(info.value.user)
          : null,
    },
    200,
    { 'Cache-Control': 'no-store' }
  );
};