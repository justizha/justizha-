export const getAllLastFmData = (username: string) =>
  fetch(`/.netlify/functions/lastfm-all?user=${username}`).then((res) =>
    res.json()
  );
