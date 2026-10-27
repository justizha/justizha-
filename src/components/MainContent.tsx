import { Link } from "react-router";
import useSWR from "swr";
import { getAllLastFmData } from "../service/lastfm";
import type { LastFmAllData } from "../types/lastfm";
import Contact from "./Contanct";

// Music row with what you last played underneath
function MusicLink() {
  const username = import.meta.env.VITE_USER_NAME as string;

  // Same key as the Music page, so both share one cached request
  const { data, isLoading } = useSWR<LastFmAllData>(
    `last-fm-${username}`,
    () => getAllLastFmData(username),
    { refreshInterval: 30000, revalidateOnFocus: false }
  );

  const latest = data?.recentTracks?.[0];
  const isLive = Boolean(latest?.["@attr"]?.nowplaying);

  return (
    <Link
      to="/music"
      className="btn btn-outline btn-accent h-auto w-full flex-col gap-1 rounded-none py-3 text-lg"
    >
      Music
      {isLoading && (
        <span
          aria-hidden="true"
          className="my-0.5 h-3 w-40 bg-current opacity-20 motion-safe:animate-pulse"
        />
      )}
      {latest && (
        <span className="flex max-w-full min-w-0 items-center gap-2 text-xs font-normal opacity-70">
          {isLive && (
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-green-500 motion-safe:animate-pulse"
            />
          )}
          <span className="truncate">
            {isLive ? "Now playing" : "Last played"}: {latest.name} by{" "}
            {latest.artist["#text"]}
          </span>
        </span>
      )}
    </Link>
  );
}

export default function MainContent() {
  return (
    <section className="grid place-items-center px-8 pb-10">
      <div className="relative mt-6 grid w-full gap-3 sm:w-lg">
        {/* Sleeping on the top edge of the first row; tweak -top-8 / right-3 to taste */}
        <img
          loading="lazy"
          src="/assets/catsleep.gif"
          alt=""
          className="pointer-events-none absolute -top-8 right-3 z-10 w-14"
        />

        <MusicLink />

        <Link
          to="/blog"
          className="btn btn-outline btn-accent w-full rounded-none text-lg"
        >
          Blogs
        </Link>

        <Contact />
      </div>
    </section>
  );
}