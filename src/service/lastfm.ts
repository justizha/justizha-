const BASE = "/.netlify/functions/lastfm";

export const getRecentTracks = (user: string, limit = 10) =>
  fetch(`${BASE}?method=user.getrecenttracks&user=${user}&limit=${limit}`).then(
    (res) => res.json()
  );

export const getTopTracks = (user: string, period = "overall", limit = 10) =>
  fetch(
    `${BASE}?method=user.gettoptracks&user=${user}&period=${period}&limit=${limit}`
  ).then((res) => res.json());

export const getTopArtists = (user: string, period = "overall", limit = 10) =>
  fetch(
    `${BASE}?method=user.gettopartists&user=${user}&period=${period}&limit=${limit}`
  ).then((res) => res.json());

export const getUserInfo = (user: string) =>
  fetch(`${BASE}?method=user.getinfo&user=${user}`).then((res) => res.json());
