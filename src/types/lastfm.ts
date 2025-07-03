export interface LastFmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge";
}

export interface LastFmArtist {
  "#text": string;
  mbid?: string;
}

export interface LastFmArtistDetailed {
  name: string;
  playcount: string;
  listeners?: string;
  mbid?: string;
  url: string;
  streamable?: string;
  image: LastFmImage[];
}

export interface LastFmAlbum {
  "#text": string;
  mbid?: string;
}

export interface LastFmTrack {
  name: string;
  artist: LastFmArtist;
  album?: LastFmAlbum;
  image: LastFmImage[];
  streamable?: string;
  date?: {
    uts: string;
    "#text": string;
  };
  url?: string;
  "@attr"?: {
    nowplaying?: string;
  };
}

export interface LastFmTopTrack {
  name: string;
  playcount: string;
  listeners?: string;
  mbid?: string;
  url: string;
  streamable: {
    "#text": string;
    fulltrack: string;
  };
  artist: {
    name: string;
    mbid?: string;
    url: string;
  };
  image: LastFmImage[];
  "@attr"?: {
    rank: string;
  };
}

export interface LastFmUser {
  name: string;
  realname?: string;
  image: LastFmImage[];
  url: string;
  country?: string;
  age?: string;
  gender?: string;
  subscriber?: string;
  playcount: string;
  playlists?: string;
  bootstrap?: string;
  registered: {
    unixtime: string;
    "#text": string;
  };
  type?: string;
  artist_count?: string;
  track_count?: string;
  album_count?: string;
}

export interface LastFmRecentTracksResponse {
  recenttracks: {
    track: LastFmTrack[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      total: string;
      perPage: string;
    };
  };
}

export interface LastFmTopTracksResponse {
  toptracks: {
    track: LastFmTopTrack[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      total: string;
      perPage: string;
    };
  };
}

export interface LastFmTopArtistsResponse {
  topartists: {
    artist: LastFmArtistDetailed[];
    "@attr": {
      user: string;
      totalPages: string;
      page: string;
      total: string;
      perPage: string;
    };
  };
}

export interface LastFmUserResponse {
  user: LastFmUser;
}
