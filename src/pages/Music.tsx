import moment from 'moment';
import { type ReactNode, useState } from 'react';
import useSWR from 'swr';
import Loading from '../components/Loading';
import Nav from '../components/Navigation';
import { getAllLastFmData } from '../service/lastfm';
import type { LastFmAllData } from '../types/lastfm';

type TabType = 'recent' | 'toptracks' | 'topartists';

const TABS: { id: TabType; label: string; caption?: string }[] = [
  { id: 'recent', label: 'Recent tracks' },
  { id: 'toptracks', label: 'Top tracks', caption: 'This month' },
  { id: 'topartists', label: 'Top artists', caption: 'This month' },
];

// Last.fm returns this image when there is no real artwork
const LASTFM_PLACEHOLDER = '2a96cbd8b46e442fc41c2b86b821562f';

function realCover(url?: string) {
  return url && !url.includes(LASTFM_PLACEHOLDER) ? url : undefined;
}

function Cover({
  src,
  alt = '',
  className,
}: {
  src?: string;
  alt?: string;
  className: string;
}) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`${className} border border-teal-900/60 bg-base-100`}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`${className} border border-base-300 object-cover`}
    />
  );
}

// Fixed-height scroll area with a fade at the bottom edge
function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="max-h-112 overflow-y-auto border border-teal-900 bg-base-200">
      <div className="pb-8">{children}</div>
      <div className="pointer-events-none sticky bottom-0 h-0" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-base-200 to-transparent" />
      </div>
    </div>
  );
}

type RankedItem = {
  id: string;
  name: string;
  sub?: string;
  plays: number;
  href: string;
};

// Rank, name, playcount, and a bar scaled to the #1 item
function RankedList({ items }: { items: RankedItem[] }) {
  const max = Math.max(...items.map((item) => item.plays), 1);

  return (
    <ol>
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex items-center gap-4 border-b border-teal-900/50 px-5 py-3 transition-colors last:border-b-0 hover:bg-base-300/30"
        >
          <span className="w-6 text-right text-sm text-gray-400 tabular-nums">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-medium text-gray-100 hover:underline"
              >
                {item.name}
              </a>
              <span className="shrink-0 text-xs text-gray-400 tabular-nums">
                {item.plays.toLocaleString()} plays
              </span>
            </div>
            {item.sub && (
              <p className="truncate text-xs text-gray-300">{item.sub}</p>
            )}
            <div className="mt-2 h-0.5 bg-teal-900/40">
              <div
                className="h-full bg-teal-600"
                style={{ width: `${(item.plays / max) * 100}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Music() {
  const [activeTab, setActiveTab] = useState<TabType>('recent');

  const username = import.meta.env.VITE_USER_NAME as string;

  const { data, error, isLoading } = useSWR<LastFmAllData>(
    `last-fm-${username}`,
    () => getAllLastFmData(username),
    {
      refreshInterval: 10000,
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-bold text-red-600">Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const { recentTracks, topArtists, topTracks, userInfo } = data || {};

  // The newest track gets the hero; the list shows everything after it
  const latest = recentTracks?.[0];
  const isLive = Boolean(latest?.['@attr']?.nowplaying);
  const olderTracks = recentTracks?.slice(1) ?? [];

  const trackItems: RankedItem[] =
    topTracks?.map((track) => ({
      id: `${track.artist.name}-${track.name}`,
      name: track.name,
      sub: track.artist.name,
      plays: Number.parseInt(track.playcount, 10),
      href: `https://www.last.fm/music/${encodeURIComponent(track.artist.name)}/_/${encodeURIComponent(track.name)}`,
    })) ?? [];

  const artistItems: RankedItem[] =
    topArtists?.map((artist) => ({
      id: artist.name,
      name: artist.name,
      plays: Number.parseInt(artist.playcount, 10),
      href: `https://www.last.fm/music/${encodeURIComponent(artist.name)}`,
    })) ?? [];

  const stats = [
    { label: 'plays', value: userInfo?.playcount },
    { label: 'artists', value: userInfo?.artist_count },
    { label: 'tracks', value: userInfo?.track_count },
  ];

  const activeCaption = TABS.find((tab) => tab.id === activeTab)?.caption;

  return (
    <>
      <Nav />
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-4 py-20 pt-12">
        {/* Profile and stats in one line */}
        {userInfo && (
          <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border border-teal-900 bg-base-300/60 p-4">
            <div className="flex min-w-0 items-center gap-4">
              <img
                src={userInfo.image?.[2]?.['#text'] || '/default-avatar.png'}
                alt={userInfo.name}
                className="h-14 w-14 shrink-0 border border-base-300 object-cover"
              />
              <div className="min-w-0">
                <a
                  href={`https://last.fm/user/${userInfo.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-lg font-bold text-gray-100 hover:underline"
                >
                  {userInfo.realname || userInfo.name}
                </a>
                <p className="text-sm text-gray-400">@{userInfo.name}</p>
              </div>
            </div>

            <dl className="flex gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="text-xs text-gray-400">{stat.label}</dt>
                  <dd className="text-lg font-semibold text-gray-200 tabular-nums">
                    {Number.parseInt(stat.value || '0', 10).toLocaleString()}
                  </dd>
                </div>
              ))}
            </dl>
          </header>
        )}

        {/* Hero: now playing, or the last thing played */}
        {latest && (
          <section className="flex flex-col gap-6 border border-teal-900 bg-base-200 p-5 sm:flex-row">
            <Cover
              src={realCover(
                latest.image?.[3]?.['#text'] || latest.image?.[2]?.['#text']
              )}
              alt={`${latest.name} cover`}
              className="h-48 w-48 shrink-0"
            />
            <div className="flex min-w-0 flex-col justify-center gap-1">
              {isLive ? (
                <p className="flex items-center gap-2 text-sm font-medium text-green-500">
                  <span className="h-2 w-2 rounded-full bg-green-500 motion-safe:animate-pulse" />
                  Now playing
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Last played {moment(Number(latest.date?.uts) * 1000).fromNow()}
                </p>
              )}
              <h2 className="wrap-break-word text-2xl font-bold text-gray-100">
                {latest.name}
              </h2>
              <p className="text-gray-300">by {latest.artist['#text']}</p>
              {latest.album?.['#text'] && (
                <p className="text-sm text-gray-400">{latest.album['#text']}</p>
              )}
            </div>
          </section>
        )}

        {/* Tabs */}
        <section>
          <div
            role="tablist"
            className="mb-3 flex gap-1 border border-teal-900 bg-base-200 p-2"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 border px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-700 bg-base-100 text-gray-100'
                    : 'border-transparent text-gray-300 hover:bg-base-300/50 hover:text-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div role="tabpanel">
            <Panel>
              {activeCaption && (
                <p className="border-b border-teal-900/50 px-5 py-3 text-xs text-gray-400">
                  {activeCaption}
                </p>
              )}

              {activeTab === 'recent' && (
                <ul>
                  {olderTracks.map((track) => (
                    <li
                      key={`${track.date?.uts}-${track.name}`}
                      className="flex items-center gap-3 border-b border-teal-900/50 px-5 py-2 transition-colors last:border-b-0 hover:bg-base-300/30"
                    >
                      <Cover
                        src={realCover(
                          track.image?.[1]?.['#text'] ||
                            track.image?.[2]?.['#text']
                        )}
                        className="h-10 w-10 shrink-0"
                      />
                      <div
                        className="min-w-0 flex-1"
                        title={track.album?.['#text'] || undefined}
                      >
                        <p className="truncate text-sm font-medium text-gray-100">
                          {track.name}
                        </p>
                        <p className="truncate text-xs text-gray-300">
                          {track.artist['#text']}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs text-gray-400">
                        {moment(Number(track.date?.uts) * 1000).fromNow()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'toptracks' && <RankedList items={trackItems} />}
              {activeTab === 'topartists' && <RankedList items={artistItems} />}
            </Panel>
          </div>
        </section>
      </main>
    </>
  );
}