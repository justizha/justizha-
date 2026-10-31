interface Env {
  LASTFM_API_KEY: string;
}

const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const params = new URL(request.url).searchParams;
  const method = params.get('method');
  const user = params.get('user');
  const period = params.get('period') ?? 'overall';
  const limit = params.get('limit') ?? '10';

  if (!method || !user) {
    return json({ error: 'Missing required params: method and user' }, 400);
  }

  const url = new URL(BASE_URL);
  url.searchParams.set('method', method);
  url.searchParams.set('user', user);
  url.searchParams.set('api_key', env.LASTFM_API_KEY);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', limit);
  url.searchParams.set('period', period);

  try {
    const res = await fetch(url);
    return json(await res.json(), res.status);
  } catch (error) {
    return json({ error: (error as Error).message }, 500);
  }
};