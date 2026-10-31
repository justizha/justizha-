import type { ComponentChildren, TargetedKeyboardEvent } from 'preact';
import { useRef, useState } from 'preact/hooks';
import useSWR from 'swr';
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

// Replaces moment (~70% of the old Music chunk) with the built-in Intl API
const RTF = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

function timeAgo(uts?: string) {
  const ms = Number(uts) * 1000;
  if (!uts || Number.isNaN(ms)) return '';
  const diff = Math.round((ms - Date.now()) / 1000);
  for (const [unit, secs] of UNITS) {
    if (Math.abs(diff) >= secs)
      return RTF.format(Math.round(diff / secs), unit);
  }
  return 'just now';
}

function Cover({
  src,
  alt = '',
  className,
  size,
  priority = false,
}: {
  src?: string;
  alt?: string;
  className: string;
  size: number;
  priority?: boolean;
}) {
  // Remember which URL failed so a new track gets a fresh attempt
  const [failedSrc, setFailedSrc] = useState<string>();

  if (!src || failedSrc === src) {
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
      width={size}
      height={size}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailedSrc(src)}
      className={`${className} border border-base-300 object-cover`}
    />
  );
}

// Scroll area with a fade at the bottom edge
function Panel({ children }: { children: ComponentChildren }) {
  return (
    <div className="max-h-112 overflow-y-auto border border-teal-900 bg-base-200">
      <div className="pb-8">{children}</div>
      <div
        className="pointer-events-none sticky bottom-0 h-0"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-base-200 to-transparent" />
      </div>
    </div>
  );
}

function EmptyState({ children }: { children: ComponentChildren }) {
  return <p className="px-5 py-6 text-sm text-gray-400">{children}</p>;
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
  if (items.length === 0) return <EmptyState>Nothing here yet.</EmptyState>;

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
                className="truncate font-medium text-gray-100 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
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

// Shown instead of the old full-screen loader so the nav and layout
// appear immediately (better FCP, no layout jump when data arrives)
function MusicSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-hidden="true">
      <div className="h-22 border border-teal-900 bg-base-300/60" />
      <div className="h-62 border border-teal-900 bg-base-200" />
      <div className="h-96 border border-teal-900 bg-base-200" />
    </div>
  );
}

export default function Music() {
  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const tabRefs = useRef<Partial<Record<TabType, HTMLButtonElement | null>>>(
    {}
  );

  const username = import.meta.env.VITE_USER_NAME as string | undefined;

  const { data, error, isLoading, mutate } = useSWR<LastFmAllData>(
    // null key = don't fetch when the env var is missing
    username ? `last-fm-${username}` : null,
    () => getAllLastFmData(username as string),
    {
      // 4 requests per refresh, so poll gently and not while the tab is hidden
      refreshInterval: 20_000,
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  // Arrow keys / Home / End move between tabs, as the tab pattern expects
  function onTabKeyDown(event: TargetedKeyboardEvent<HTMLDivElement>) {
    const current = TABS.findIndex((tab) => tab.id === activeTab);
    let next = current;

    if (event.key === 'ArrowRight') next = (current + 1) % TABS.length;
    else if (event.key === 'ArrowLeft')
      next = (current - 1 + TABS.length) % TABS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TABS.length - 1;
    else return;

    event.preventDefault();
    const id = TABS[next].id;
    setActiveTab(id);
    tabRefs.current[id]?.focus();
  }

  const { recentTracks, topArtists, topTracks, userInfo } = data || {};

  // The newest track gets the hero; the list shows everything after it
  const latest = recentTracks?.[0];
  const isLive = String(latest?.['@attr']?.nowplaying) === 'true';
  const olderTracks = recentTracks?.slice(1) ?? [];

  const trackItems: RankedItem[] =
    topTracks?.map((track) => ({
      id: `${track.artist.name}-${track.name}`,
      name: track.name,
      sub: track.artist.name,
      plays: Number.parseInt(track.playcount, 10) || 0,
      href: `https://www.last.fm/music/${encodeURIComponent(track.artist.name)}/_/${encodeURIComponent(track.name)}`,
    })) ?? [];

  const artistItems: RankedItem[] =
    topArtists?.map((artist) => ({
      id: artist.name,
      name: artist.name,
      plays: Number.parseInt(artist.playcount, 10) || 0,
      href: `https://www.last.fm/music/${encodeURIComponent(artist.name)}`,
    })) ?? [];

  const stats = [
    { label: 'plays', value: userInfo?.playcount },
    { label: 'artists', value: userInfo?.artist_count },
    { label: 'tracks', value: userInfo?.track_count },
  ];

  const activeCaption = TABS.find((tab) => tab.id === activeTab)?.caption;
  const avatar = realCover(userInfo?.image?.[2]?.['#text']);
  const lastPlayed = timeAgo(latest?.date?.uts);

  let body: ComponentChildren;

  if (!username) {
    body = (
      <div className="border border-teal-900 bg-base-200 p-6 text-center">
        <h2 className="mb-2 text-lg font-bold text-gray-100">
          Last.fm user not set
        </h2>
        <p className="text-sm text-gray-400">
          Add <code>VITE_USER_NAME</code> to your environment and rebuild.
        </p>
      </div>
    );
  } else if (isLoading) {
    body = <MusicSkeleton />;
  } else if (error && !data) {
    body = (
      <div
        role="alert"
        className="border border-red-900 bg-base-200 p-6 text-center"
      >
        <h2 className="mb-2 text-lg font-bold text-red-500">
          Couldn't load Last.fm data
        </h2>
        <p className="mb-4 text-sm text-gray-400">{error.message}</p>
        <button
          type="button"
          onClick={() => mutate()}
          className="border border-teal-700 px-4 py-2 text-sm text-gray-100 transition-colors hover:bg-base-300/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
        >
          Try again
        </button>
      </div>
    );
  } else {
    body = (
      <>
        {/* Profile and stats */}
        {userInfo && (
          <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border border-teal-900 bg-base-300/60 p-4">
            <div className="flex min-w-0 items-center gap-4">
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  width={56}
                  height={56}
                  decoding="async"
                  className="h-14 w-14 shrink-0 border border-base-300 object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center border border-teal-900 bg-base-100 text-lg font-bold text-gray-300"
                >
                  {(userInfo.realname || userInfo.name).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <a
                  href={`https://www.last.fm/user/${encodeURIComponent(userInfo.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-lg font-bold text-gray-100 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
                >
                  {userInfo.realname || userInfo.name}
                </a>
                <p className="truncate text-sm text-gray-400">
                  @{userInfo.name}
                </p>
              </div>
            </div>

            <dl className="flex flex-wrap gap-x-8 gap-y-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="text-xs text-gray-400">{stat.label}</dt>
                  <dd className="text-lg font-semibold text-gray-200 tabular-nums">
                    {(
                      Number.parseInt(stat.value || '0', 10) || 0
                    ).toLocaleString()}
                  </dd>
                </div>
              ))}
            </dl>
          </header>
        )}

        {/* Hero: now playing, or the last thing played. This is the LCP element. */}
        {latest ? (
          <section
            aria-label={isLive ? 'Now playing' : 'Last played'}
            className="flex flex-col items-center gap-6 border border-teal-900 bg-base-200 p-5 sm:flex-row sm:items-stretch"
          >
            <Cover
              priority
              size={192}
              src={realCover(
                latest.image?.[3]?.['#text'] || latest.image?.[2]?.['#text']
              )}
              alt={`${latest.name} cover`}
              className="aspect-square w-full max-w-48 shrink-0 sm:h-48 sm:w-48"
            />
            <div className="flex min-w-0 flex-col justify-center gap-1 self-start sm:self-center">
              {isLive ? (
                <p className="flex items-center gap-2 text-sm font-medium text-green-500">
                  <span className="h-2 w-2 rounded-full bg-green-500 motion-safe:animate-pulse" />
                  Now playing
                </p>
              ) : (
                lastPlayed && (
                  <p className="text-sm text-gray-400">
                    Last played {lastPlayed}
                  </p>
                )
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
        ) : (
          <EmptyState>No listening history yet.</EmptyState>
        )}

        {/* Tabs */}
        <section>
          <div
            role="tablist"
            aria-label="Listening history"
            onKeyDown={onTabKeyDown}
            className="mb-3 flex gap-1 border border-teal-900 bg-base-200 p-2"
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 border px-2 py-3 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-400 sm:px-4 sm:text-sm ${
                    selected
                      ? 'border-teal-700 bg-base-100 text-gray-100'
                      : 'border-transparent text-gray-300 hover:bg-base-300/50 hover:text-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {/* key resets scroll position when switching tabs */}
            <Panel key={activeTab}>
              {activeCaption && (
                <p className="border-b border-teal-900/50 px-5 py-3 text-xs text-gray-400">
                  {activeCaption}
                </p>
              )}

              {activeTab === 'recent' &&
                (olderTracks.length === 0 ? (
                  <EmptyState>No other recent tracks.</EmptyState>
                ) : (
                  <ul>
                    {olderTracks.map((track, index) => (
                      <li
                        key={`${track.date?.uts ?? 'live'}-${track.name}-${index}`}
                        className="flex items-center gap-3 border-b border-teal-900/50 px-5 py-2 transition-colors last:border-b-0 hover:bg-base-300/30"
                      >
                        <Cover
                          size={40}
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
                          {timeAgo(track.date?.uts)}
                        </p>
                      </li>
                    ))}
                  </ul>
                ))}

              {activeTab === 'toptracks' && <RankedList items={trackItems} />}
              {activeTab === 'topartists' && <RankedList items={artistItems} />}
            </Panel>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-4 py-20 pt-12">
        <h1 className="sr-only">Music</h1>
        {body}
      </main>
    </>
  );
}
