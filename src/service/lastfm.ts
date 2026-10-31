import type { LastFmAllData } from '../types/lastfm';

async function parse(res: Response): Promise<LastFmAllData> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export async function getAllLastFmData(username: string): Promise<LastFmAllData> {
  // Reuse the request index.html started before the JS loaded (once only,
  // so the 20 s polling always fetches fresh data)
  const early = (window as any).__lastfm as Promise<LastFmAllData> | undefined;
  (window as any).__lastfm = undefined;
  if (early) {
    try {
      return await early;
    } catch {
      /* fall through to a normal request */
    }
  }

  return parse(
    await fetch(
      `/.netlify/functions/lastfm-all?user=${encodeURIComponent(username)}`
    )
  );
}