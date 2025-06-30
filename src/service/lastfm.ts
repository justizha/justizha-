const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';


import type {
 LastFmRecentTracksResponse,
 LastFmUserResponse,
 LastFmTopTracksResponse,
 LastFmTopArtistsResponse
} from '../type/lastfm';


export const getRecentTracks = async (
 username: string,
 limit: number = 10
): Promise<LastFmRecentTracksResponse> => {
 try {
  const response = await fetch(
   `${BASE_URL}?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=${limit}`
  );

  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
   throw new Error(data.message || 'Unknown Last.fm API error');
  }

  return data;
 } catch (error) {
  console.error('Error fetching recent tracks:', error);
  throw error;
 }
};

export const getUserInfo = async (username: string): Promise<LastFmUserResponse> => {
 try {
  const response = await fetch(
   `${BASE_URL}?method=user.getinfo&user=${username}&api_key=${API_KEY}&format=json`
  );

  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
   throw new Error(data.message || 'Unknown Last.fm API error');
  }

  return data;
 } catch (error) {
  console.error('Error fetching user info:', error);
  throw error;
 }
};

export const getTopTracks = async (
 username: string,
 period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' = 'overall',
 limit: number = 10
): Promise<LastFmTopTracksResponse> => {
 try {
  const response = await fetch(
   `${BASE_URL}?method=user.gettoptracks&user=${username}&api_key=${API_KEY}&format=json&period=${period}&limit=${limit}`
  );

  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
   throw new Error(data.message || 'Unknown Last.fm API error');
  }

  return data;
 } catch (error) {
  console.error('Error fetching top tracks:', error);
  throw error;
 }
};

export const getTopArtists = async (
 username: string,
 period: 'overall' | '7day' | '1month' | '3month' | '6month' | '12month' = 'overall',
 limit: number = 10
): Promise<LastFmTopArtistsResponse> => {
 try {
  const response = await fetch(
   `${BASE_URL}?method=user.gettopartists&user=${username}&api_key=${API_KEY}&format=json&period=${period}&limit=${limit}`
  );

  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
   throw new Error(data.message || 'Unknown Last.fm API error');
  }

  return data;
 } catch (error) {
  console.error('Error fetching top artists:', error);
  throw error;
 }
};