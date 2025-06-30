import type { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const API_KEY = process.env.VITE_LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export const handler: Handler = async (event) => {
 const { method, user, period = 'overall', limit = '10' } = event.queryStringParameters || {};

 if (!method || !user) {
  return {
   statusCode: 400,
   body: JSON.stringify({ error: 'Missing required params: method and user' }),
  };
 }

 const url = new URL(BASE_URL);
 url.searchParams.set('method', method);
 url.searchParams.set('user', user);
 url.searchParams.set('api_key', API_KEY!);
 url.searchParams.set('format', 'json');
 url.searchParams.set('limit', limit);
 if (period) url.searchParams.set('period', period);

 try {
  const res = await fetch(url.toString());
  const data = await res.json();
  return {
   statusCode: res.ok ? 200 : res.status,
   body: JSON.stringify(data),
  };
 } catch (error) {
  return {
   statusCode: 500,
   body: JSON.stringify({ error: (error as Error).message }),
  };
 }
};
